import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('=== INVENTORY MANAGEMENT FUNCTION START ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Creating Supabase client...');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get user from JWT
    console.log('Extracting user from JWT...');
    const authHeader = req.headers.get('Authorization')!;
    if (!authHeader) {
      console.error('No authorization header found');
      throw new Error('Authorization header required');
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted, getting user...');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Authentication failed');
    }
    
    if (!user) {
      console.error('No user found in token');
      throw new Error('User not found');
    }
    
    console.log('User authenticated:', user.email, '(ID:', user.id + ')');

    // Check if user is admin
    console.log('Checking admin permissions...');
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError) {
      console.error('Role check error:', roleError);
      // For now, check by email as fallback
      if (user.email !== 'hehe@me.pk') {
        throw new Error('Admin access required');
      }
      console.log('Admin access granted via email check');
    } else if (!userRole || userRole.role !== 'admin') {
      console.error('User role check failed:', userRole);
      throw new Error('Admin access required');
    } else {
      console.log('Admin access confirmed via role:', userRole.role);
    }

    console.log('Parsing request body...');
    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { action, product_id, quantity, restock_threshold } = requestBody;
    console.log('Action requested:', action);

    switch (action) {
      case 'update_stock':
        console.log(`Updating stock for product ${product_id} to quantity ${quantity}`);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            stock_quantity: quantity,
            in_stock: quantity > 0 
          })
          .eq('id', product_id);

        if (updateError) {
          console.error('Stock update error:', updateError);
          throw updateError;
        }

        console.log(`✅ Stock updated successfully for product ${product_id}: ${quantity} units`);
        break;

      case 'bulk_update':
        console.log('Processing bulk inventory update...');
        const updates = requestBody.updates;
        console.log(`Updating ${updates.length} products`);
        
        for (const update of updates) {
          console.log(`Updating product ${update.product_id} to ${update.quantity} units`);
          const { error } = await supabase
            .from('products')
            .update({ 
              stock_quantity: update.quantity,
              in_stock: update.quantity > 0 
            })
            .eq('id', update.product_id);
            
          if (error) {
            console.error(`Failed to update product ${update.product_id}:`, error);
          } else {
            console.log(`✅ Updated product ${update.product_id} successfully`);
          }
        }
        console.log('✅ Bulk update completed');
        break;

      case 'low_stock_report':
        console.log('Generating low stock report...');
        const threshold = restock_threshold || 10;
        console.log('Using restock threshold:', threshold);
        
        const { data: lowStockProducts, error: lowStockError } = await supabase
          .from('products')
          .select('id, name, stock_quantity, category_id, categories(name)')
          .lt('stock_quantity', threshold)
          .eq('in_stock', true);

        if (lowStockError) {
          console.error('Low stock query error:', lowStockError);
          throw lowStockError;
        }

        console.log(`Found ${lowStockProducts?.length || 0} products with low stock`);
        lowStockProducts?.forEach(product => {
          console.log(`- ${product.name}: ${product.stock_quantity} units remaining`);
        });

        return new Response(
          JSON.stringify({ 
            success: true, 
            low_stock_products: lowStockProducts,
            threshold_used: threshold
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'inventory_report':
        console.log('Generating comprehensive inventory report...');
        
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('products')
          .select('id, name, stock_quantity, price, categories(name)')
          .order('stock_quantity', { ascending: true });

        if (inventoryError) {
          console.error('Inventory query error:', inventoryError);
          throw inventoryError;
        }

        const totalValue = inventoryData?.reduce((sum, product) => 
          sum + (product.stock_quantity * product.price), 0) || 0;
        
        const outOfStock = inventoryData?.filter(p => p.stock_quantity === 0).length || 0;
        const lowStock = inventoryData?.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length || 0;
        
        console.log('📊 INVENTORY REPORT GENERATED:');
        console.log(`- Total products: ${inventoryData?.length || 0}`);
        console.log(`- Out of stock: ${outOfStock}`);
        console.log(`- Low stock (≤5): ${lowStock}`);
        console.log(`- Total inventory value: PKR ${totalValue.toLocaleString()}`);

        return new Response(
          JSON.stringify({ 
            success: true, 
            inventory: inventoryData,
            total_inventory_value: totalValue,
            total_products: inventoryData?.length || 0,
            out_of_stock: outOfStock,
            low_stock: lowStock,
            report_generated_at: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        console.error('❌ Invalid action requested:', action);
        throw new Error(`Invalid action: ${action}. Valid actions: update_stock, bulk_update, low_stock_report, inventory_report`);
    }

    console.log('✅ Operation completed successfully');
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Inventory operation completed successfully',
        action: action,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ ERROR in inventory management function:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: error.message.includes('Unauthorized') || error.message.includes('Admin access') ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } finally {
    console.log('=== INVENTORY MANAGEMENT FUNCTION END ===');
  }
});