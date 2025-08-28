-- Create function to decrement product stock
CREATE OR REPLACE FUNCTION public.decrement_stock(product_id UUID, quantity INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products 
  SET 
    stock_quantity = GREATEST(0, stock_quantity - quantity),
    in_stock = CASE 
      WHEN stock_quantity - quantity <= 0 THEN false 
      ELSE true 
    END
  WHERE id = product_id;
END;
$$;

-- Create function to validate promo code
CREATE OR REPLACE FUNCTION public.validate_promo_code(code_text TEXT, order_amount DECIMAL)
RETURNS TABLE(
  is_valid BOOLEAN,
  discount_type TEXT,
  discount_value DECIMAL,
  final_amount DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  promo RECORD;
  discount DECIMAL := 0;
BEGIN
  SELECT * INTO promo
  FROM public.promo_codes
  WHERE code = code_text
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (usage_limit IS NULL OR used_count < usage_limit)
    AND order_amount >= COALESCE(minimum_order_amount, 0);

  IF promo.id IS NULL THEN
    RETURN QUERY SELECT false, ''::TEXT, 0::DECIMAL, order_amount;
    RETURN;
  END IF;

  IF promo.discount_type = 'percentage' THEN
    discount := (order_amount * promo.discount_value) / 100;
  ELSE
    discount := promo.discount_value;
  END IF;

  RETURN QUERY SELECT 
    true, 
    promo.discount_type, 
    promo.discount_value, 
    GREATEST(0, order_amount - discount);
END;
$$;

-- Create function to get product analytics
CREATE OR REPLACE FUNCTION public.get_product_analytics(product_id UUID)
RETURNS TABLE(
  total_sold BIGINT,
  total_revenue DECIMAL,
  average_rating DECIMAL,
  review_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.id) as review_count
  FROM public.products p
  LEFT JOIN public.order_items oi ON p.id = oi.product_id
  LEFT JOIN public.orders o ON oi.order_id = o.id AND o.status = 'delivered'
  LEFT JOIN public.reviews r ON p.id = r.product_id AND r.is_approved = true
  WHERE p.id = product_id
  GROUP BY p.id;
END;
$$;