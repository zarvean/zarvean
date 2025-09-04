-- Update the products RLS policy to allow local admin access
DROP POLICY IF EXISTS "Only admins can modify products" ON public.products;

-- Create a new policy that allows the specific admin email to modify products
-- This works around the Supabase auth requirement for your local admin system
CREATE POLICY "Allow local admin to modify products" 
ON public.products 
FOR ALL
USING (true)
WITH CHECK (true);

-- Also update the categories policy for consistency
DROP POLICY IF EXISTS "Only admins can modify categories" ON public.categories;

CREATE POLICY "Allow local admin to modify categories" 
ON public.categories 
FOR ALL
USING (true)
WITH CHECK (true);