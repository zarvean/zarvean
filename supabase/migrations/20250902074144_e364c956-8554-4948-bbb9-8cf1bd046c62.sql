-- Fix admin authentication by updating RLS policies to match the hardcoded email check
-- Update products RLS policy to allow the specific admin email
DROP POLICY IF EXISTS "Only admins can modify products" ON public.products;
CREATE POLICY "Only admins can modify products" 
ON public.products 
FOR ALL
USING (auth.email() = 'hehe@me.pk' OR is_admin());

-- Ensure categories policy is consistent
DROP POLICY IF EXISTS "Only admins can modify categories" ON public.categories;
CREATE POLICY "Only admins can modify categories" 
ON public.categories 
FOR ALL
USING (auth.email() = 'hehe@me.pk' OR is_admin());

-- Make sure the admin user has the admin role in the database
-- First, let's check if the user exists and create admin role if needed
DO $$
BEGIN
  -- Insert admin role for the hardcoded admin email if user exists
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin'::app_role
  FROM auth.users 
  WHERE email = 'hehe@me.pk'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.users.id AND role = 'admin'::app_role
  );
END $$;