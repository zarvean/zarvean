-- Fix the remaining function search path security issue
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 6, '0');
END;
$$;

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('products', 'products', true),
  ('profiles', 'profiles', true),
  ('reviews', 'reviews', true);

-- Create storage policies for product images
CREATE POLICY "Product images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Only admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Only admins can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Only admins can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'products' AND public.is_admin());

-- Create storage policies for profile images
CREATE POLICY "Profile images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Users can upload their own profile images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profiles' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own profile images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profiles' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own profile images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profiles' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create storage policies for review images
CREATE POLICY "Review images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'reviews');

CREATE POLICY "Authenticated users can upload review images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'reviews' AND 
    auth.uid() IS NOT NULL
  );

-- Add some sample data for testing
INSERT INTO public.shop_sections (name, description, display_order) VALUES
  ('Featured Collection', 'Our most popular items', 1),
  ('New Arrivals', 'Latest fashion trends', 2),
  ('Sale Items', 'Discounted products', 3);