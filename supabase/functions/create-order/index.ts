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
      console.error('🔒 Create Order: Authentication failed:', authError);
      throw new Error('Unauthorized');
    }

    console.log('🚀 Create Order: Processing order for user:', user.email);

    const { items, shipping_address, billing_address, promo_code, payment_method, notes } = await req.json();

    console.log('📦 Create Order: Order details:', {
      itemCount: items?.length || 0,
      shipping_address: shipping_address ? 'provided' : 'missing',
      payment_method: payment_method || 'cod',
      promo_code: promo_code || 'none'
    });

    // Calculate total amount
    let total = 0;
    const orderItems = [];

    console.log('🔍 Create Order: Validating order items...');

    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('price, stock_quantity, name')
        .eq('id', item.product_id)
        .single();

      if (!product) {
        console.error('❌ Create Order: Product not found:', item.product_id);
        throw new Error(`Product ${item.product_id} not found`);
      }

      if (product.stock_quantity < item.quantity) {
        console.error('❌ Create Order: Insufficient stock for product:', product.name);
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
        color: item.color,
        size: item.size,
      });

      console.log(`✅ Create Order: Validated item - ${product.name} x${item.quantity} = $${itemTotal}`);
    }

    console.log('💰 Create Order: Subtotal calculated:', total);

    // Apply promo code if provided
    let discount = 0;
    if (promo_code) {
      console.log('🎟️ Create Order: Validating promo code:', promo_code);
      
      const { data: promo } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promo_code)
        .eq('is_active', true)
        .single();

      if (promo && promo.used_count < (promo.usage_limit || 999999)) {
        if (!promo.expires_at || new Date(promo.expires_at) > new Date()) {
          if (total >= (promo.minimum_order_amount || 0)) {
            if (promo.discount_type === 'percentage') {
              discount = (total * promo.discount_value) / 100;
            } else {
              discount = promo.discount_value;
            }
            total = Math.max(0, total - discount);

            // Update promo code usage
            await supabase
              .from('promo_codes')
              .update({ used_count: promo.used_count + 1 })
              .eq('id', promo.id);
              
            console.log('✅ Create Order: Promo code applied - Discount:', discount);
          } else {
            console.log('❌ Create Order: Order amount below minimum for promo code');
          }
        } else {
          console.log('❌ Create Order: Promo code expired');
        }
      } else {
        console.log('❌ Create Order: Invalid or usage limit exceeded for promo code');
      }
    }

    // Generate order number
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    console.log('🔢 Create Order: Generated order number:', orderNumber);

    // Create order
    console.log('🏗️ Create Order: Creating order in database...');
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        total_amount: total,
        shipping_address,
        billing_address: billing_address || shipping_address,
        payment_method: payment_method || 'cod',
        notes: notes || null,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('❌ Create Order: Error creating order:', orderError);
      throw orderError;
    }

    console.log('✅ Create Order: Order created successfully:', order.id);

    // Create order items
    console.log('📝 Create Order: Creating order items...');
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      console.error('❌ Create Order: Error creating order items:', itemsError);
      throw itemsError;
    }

    console.log('✅ Create Order: Order items created successfully');

    // Update product stock
    console.log('📦 Create Order: Updating product stock...');
    for (const item of items) {
      await supabase.rpc('decrement_stock', {
        product_id: item.product_id,
        quantity: item.quantity,
      });
      console.log('📦 Create Order: Stock decremented for product:', item.product_id);
    }

    console.log('🎉 Create Order: Order completed successfully:', {
      orderId: order.id,
      orderNumber: orderNumber,
      total: total,
      discount: discount
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        order_id: order.id,
        order_number: orderNumber,
        total_amount: total,
        discount_applied: discount 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Create Order: Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Order creation failed'
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});