import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!userRole || userRole.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const url = new URL(req.url);
    const reportType = url.searchParams.get('type') || 'dashboard';
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    let baseQuery = supabase.from('orders').select('*');
    
    if (startDate) {
      baseQuery = baseQuery.gte('created_at', startDate);
    }
    if (endDate) {
      baseQuery = baseQuery.lte('created_at', endDate);
    }

    switch (reportType) {
      case 'dashboard':
        // Get key metrics
        const [
          { data: orders },
          { data: products },
          { data: customers },
          { data: reviews }
        ] = await Promise.all([
          supabase.from('orders').select('total_amount, status, created_at'),
          supabase.from('products').select('id, stock_quantity, price'),
          supabase.from('profiles').select('id, created_at'),
          supabase.from('reviews').select('rating, created_at')
        ]);

        const totalRevenue = orders?.reduce((sum, order) => 
          order.status === 'delivered' ? sum + order.total_amount : sum, 0) || 0;

        const totalOrders = orders?.length || 0;
        const totalProducts = products?.length || 0;
        const totalCustomers = customers?.length || 0;
        const averageRating = reviews?.reduce((sum, review) => 
          sum + review.rating, 0) / (reviews?.length || 1);

        // Monthly revenue trend
        const monthlyRevenue = orders?.reduce((acc, order) => {
          if (order.status === 'delivered') {
            const month = new Date(order.created_at).toISOString().slice(0, 7);
            acc[month] = (acc[month] || 0) + order.total_amount;
          }
          return acc;
        }, {} as Record<string, number>);

        return new Response(
          JSON.stringify({
            success: true,
            metrics: {
              total_revenue: totalRevenue,
              total_orders: totalOrders,
              total_products: totalProducts,
              total_customers: totalCustomers,
              average_rating: Math.round(averageRating * 10) / 10,
              monthly_revenue: monthlyRevenue
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'sales':
        const { data: salesData } = await baseQuery;
        
        const salesByStatus = salesData?.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const dailySales = salesData?.reduce((acc, order) => {
          const date = new Date(order.created_at).toISOString().slice(0, 10);
          acc[date] = (acc[date] || 0) + order.total_amount;
          return acc;
        }, {} as Record<string, number>);

        return new Response(
          JSON.stringify({
            success: true,
            sales_by_status: salesByStatus,
            daily_sales: dailySales,
            total_sales: salesData?.reduce((sum, order) => sum + order.total_amount, 0) || 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'products':
        // Get product performance
        const { data: productSales } = await supabase
          .from('order_items')
          .select(`
            product_id,
            quantity,
            price,
            products(name, stock_quantity)
          `);

        const productPerformance = productSales?.reduce((acc, item) => {
          const productId = item.product_id;
          if (!acc[productId]) {
            acc[productId] = {
              name: item.products.name,
              total_sold: 0,
              revenue: 0,
              stock: item.products.stock_quantity
            };
          }
          acc[productId].total_sold += item.quantity;
          acc[productId].revenue += item.quantity * item.price;
          return acc;
        }, {} as Record<string, any>);

        return new Response(
          JSON.stringify({
            success: true,
            product_performance: Object.values(productPerformance || {})
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error('Invalid report type');
    }

  } catch (error) {
    console.error('Error generating analytics:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});