-- Enable admin functionality with fixed credentials
-- The admin will use email: hehe@me.pk, password: skibidi.me
-- We'll update the profiles table to handle admin status better

-- Add admin check function
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'hehe@me.pk'
  );
$$;

-- Create or update admin-related policies for products table
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (public.is_admin_user());

-- Ensure products table has all needed columns for admin management
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS colors text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sizes text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS in_stock boolean DEFAULT true;

-- Update RLS policies for categories if needed
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (public.is_admin_user());