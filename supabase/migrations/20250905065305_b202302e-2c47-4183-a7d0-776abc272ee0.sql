-- Ensure the products storage bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for product images
CREATE POLICY IF NOT EXISTS "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'products');

CREATE POLICY IF NOT EXISTS "Authenticated users can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'products');

CREATE POLICY IF NOT EXISTS "Authenticated users can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'products');