-- Fix security vulnerability: Remove public access to promo_codes table
-- Drop the existing public read policy
DROP POLICY IF EXISTS "Promo codes are viewable by everyone" ON public.promo_codes;

-- Create secure policy: Only admins can view all promo codes
CREATE POLICY "Only admins can view promo codes" 
ON public.promo_codes 
FOR SELECT 
USING (is_admin());

-- Create a secure function for public promo code validation
CREATE OR REPLACE FUNCTION public.validate_promo_code_public(code_text text, order_amount numeric DEFAULT 0)
RETURNS TABLE(is_valid boolean, discount_amount numeric, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  promo RECORD;
  calculated_discount DECIMAL := 0;
BEGIN
  -- Find active, non-expired promo code that meets minimum order requirements
  SELECT * INTO promo
  FROM public.promo_codes
  WHERE code = code_text
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (usage_limit IS NULL OR used_count < usage_limit)
    AND order_amount >= COALESCE(minimum_order_amount, 0);

  -- If no valid promo code found
  IF promo.id IS NULL THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'Invalid or expired promo code'::TEXT;
    RETURN;
  END IF;

  -- Calculate discount based on type
  IF promo.discount_type = 'percentage' THEN
    calculated_discount := ROUND((order_amount * promo.discount_value) / 100, 2);
  ELSE
    calculated_discount := promo.discount_value;
  END IF;

  -- Return validation result with discount amount
  RETURN QUERY SELECT 
    true, 
    calculated_discount, 
    CONCAT(promo.discount_value, CASE WHEN promo.discount_type = 'percentage' THEN '% discount applied!' ELSE ' discount applied!' END)::TEXT;
END;
$$;