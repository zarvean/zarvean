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
      console.error('🔒 Inventory Management: Authentication failed:', authError);
      throw new Error('Unauthorized');
    }

    // Check if user is admin (using email for simplicity - in production use proper role system)
    if (user.email !== 'hehe@me.pk') {
      console.error('🚫 Inventory Management: Access denied for user:', user.email);
      throw new Error('Admin access required');
    }

    console.log('🔧 Inventory Management: Admin access granted for:', user.email);

    const { action, product_id, quantity, restock_threshold, updates } = await req.json();
    console.log('📋 Inventory Management: Processing action:', action, 'with params:', { product_id, quantity, restock_threshold });

    switch (action) {
      case 'update_stock':
        console.log('📦 Inventory Management: Updating stock for product:', product_id, 'to quantity:', quantity);
        
        const { data: productData, error: updateError } = await supabase
          .from('products')
          .update({ 
            stock_quantity: quantity,
            in_stock: quantity > 0 
          })
          .eq('id', product_id)
          .select('name, stock_quantity')
          .single();

        if (updateError) {
          console.error('❌ Inventory Management: Error updating stock:', updateError);
          throw updateError;
        }

        console.log('✅ Inventory Management: Stock updated successfully for:', productData.name);
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Stock updated for ${productData.name}`,
            product: productData
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'bulk_update':
        console.log('🔄 Inventory Management: Processing bulk update for', updates?.length || 0, 'products');
        
        if (!updates || !Array.isArray(updates)) {
          throw new Error('Invalid updates array');
        }
        
        const results = [];
        for (const update of updates) {
          try {
            const { data: bulkProductData, error: bulkError } = await supabase
              .from('products')
              .update({ 
                stock_quantity: update.quantity,
                in_stock: update.quantity > 0 
              })
              .eq('id', update.product_id)
              .select('name, stock_quantity')
              .single();
              
            if (bulkError) {
              console.error('❌ Inventory Management: Error in bulk update for product:', update.product_id);
              results.push({ product_id: update.product_id, success: false, error: bulkError.message });
            } else {
              console.log('✅ Inventory Management: Bulk update success for:', bulkProductData.name);
              results.push({ product_id: update.product_id, success: true, product: bulkProductData });
            }
          } catch (err) {
            results.push({ product_id: update.product_id, success: false, error: err.message });
          }
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Bulk update completed for ${results.length} products`,
            results
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'low_stock_report':
        const threshold = restock_threshold || 10;
        console.log('📊 Inventory Management: Generating low stock report with threshold:', threshold);
        
        const { data: lowStockProducts, error: lowStockError } = await supabase
          .from('products')
          .select('id, name, stock_quantity, category_id, categories(name)')
          .lt('stock_quantity', threshold)
          .eq('in_stock', true);

        if (lowStockError) {
          console.error('❌ Inventory Management: Error generating low stock report:', lowStockError);
          throw lowStockError;
        }

        console.log('📈 Inventory Management: Low stock report generated:', lowStockProducts?.length || 0, 'products found');
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            low_stock_products: lowStockProducts,
            threshold,
            count: lowStockProducts?.length || 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'inventory_report':
        console.log('📊 Inventory Management: Generating full inventory report');
        
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('products')
          .select('id, name, stock_quantity, price, categories(name)')
          .order('stock_quantity', { ascending: true });

        if (inventoryError) {
          console.error('❌ Inventory Management: Error generating inventory report:', inventoryError);
          throw inventoryError;
        }

        const totalValue = inventoryData?.reduce((sum, product) => 
          sum + (product.stock_quantity * product.price), 0) || 0;
        const outOfStock = inventoryData?.filter(p => p.stock_quantity === 0).length || 0;

        console.log('📈 Inventory Management: Inventory report generated:', {
          totalProducts: inventoryData?.length || 0,
          totalValue,
          outOfStock
        });

        return new Response(
          JSON.stringify({ 
            success: true, 
            inventory: inventoryData,
            total_inventory_value: totalValue,
            total_products: inventoryData?.length || 0,
            out_of_stock: outOfStock
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        console.error('❌ Inventory Management: Unknown action:', action);
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
    console.error('💥 Inventory Management: Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Inventory management operation failed'
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});