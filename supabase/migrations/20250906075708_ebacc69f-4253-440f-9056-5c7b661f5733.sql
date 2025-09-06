-- Create comments table for admin to manage product comments
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT,
  content TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage comments" 
ON public.comments 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();