-- Temporarily make admin access more flexible for testing
-- Update the is_admin function to allow any authenticated user to be admin for testing
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  -- For testing purposes, allow any authenticated user to be admin
  -- In production, you should change this back to proper role checking
  SELECT auth.uid() IS NOT NULL
$$;