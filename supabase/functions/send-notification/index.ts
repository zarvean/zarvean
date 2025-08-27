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
    const { type, data } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    let emailContent = '';
    let subject = '';
    let recipient = '';

    switch (type) {
      case 'order_confirmation':
        subject = `Order Confirmation - ${data.order_number}`;
        recipient = data.customer_email;
        emailContent = `
          <h2>Thank you for your order!</h2>
          <p>Order Number: ${data.order_number}</p>
          <p>Total Amount: PKR ${data.total_amount}</p>
          <p>Status: ${data.status}</p>
          <p>We'll send you updates as your order progresses.</p>
        `;
        break;
        
      case 'order_status_update':
        subject = `Order Update - ${data.order_number}`;
        recipient = data.customer_email;
        emailContent = `
          <h2>Order Status Update</h2>
          <p>Order Number: ${data.order_number}</p>
          <p>New Status: ${data.status}</p>
          <p>Thank you for your patience!</p>
        `;
        break;
        
      case 'newsletter_welcome':
        subject = 'Welcome to our Newsletter!';
        recipient = data.email;
        emailContent = `
          <h2>Welcome!</h2>
          <p>Thank you for subscribing to our newsletter.</p>
          <p>You'll be the first to know about our latest products and exclusive offers!</p>
        `;
        break;
        
      case 'review_approved':
        subject = 'Your Review Has Been Approved';
        recipient = data.user_email;
        emailContent = `
          <h2>Review Approved!</h2>
          <p>Your review for "${data.product_name}" has been approved and is now visible to other customers.</p>
          <p>Thank you for sharing your experience!</p>
        `;
        break;
        
      default:
        throw new Error('Invalid notification type');
    }

    // Log the email (in production, you'd integrate with an email service like SendGrid, Resend, etc.)
    console.log('Email notification:', {
      to: recipient,
      subject: subject,
      content: emailContent,
      type: type
    });

    // In a real application, you would send the email here
    // For now, we'll just log it and return success
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully',
        recipient: recipient 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});