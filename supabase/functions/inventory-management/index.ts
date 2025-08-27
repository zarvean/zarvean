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

    const { action, product_id, quantity, restock_threshold } = await req.json();

    switch (action) {
      case 'update_stock':
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            stock_quantity: quantity,
            in_stock: quantity > 0 
          })
          .eq('id', product_id);

        if (updateError) throw updateError;

        console.log(`Stock updated for product ${product_id}: ${quantity}`);
        break;

      case 'bulk_update':
        const updates = req.body.updates;
        for (const update of updates) {
          await supabase
            .from('products')
            .update({ 
              stock_quantity: update.quantity,
              in_stock: update.quantity > 0 
            })
            .eq('id', update.product_id);
        }
        break;

      case 'low_stock_report':
        const { data: lowStockProducts } = await supabase
          .from('products')
          .select('id, name, stock_quantity, category_id, categories(name)')
          .lt('stock_quantity', restock_threshold || 10)
          .eq('in_stock', true);

        return new Response(
          JSON.stringify({ 
            success: true, 
            low_stock_products: lowStockProducts 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'inventory_report':
        const { data: inventoryData } = await supabase
          .from('products')
          .select('id, name, stock_quantity, price, categories(name)')
          .order('stock_quantity', { ascending: true });

        const totalValue = inventoryData?.reduce((sum, product) => 
          sum + (product.stock_quantity * product.price), 0) || 0;

        return new Response(
          JSON.stringify({ 
            success: true, 
            inventory: inventoryData,
            total_inventory_value: totalValue,
            total_products: inventoryData?.length || 0,
            out_of_stock: inventoryData?.filter(p => p.stock_quantity === 0).length || 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Inventory updated successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in inventory management:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});