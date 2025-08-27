-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  sale_percentage INTEGER CHECK (sale_percentage >= 0 AND sale_percentage <= 100),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read access)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify categories" 
ON public.categories 
FOR ALL 
USING (auth.email() = 'hehe@me.pk');

-- Create policies for products (public read access)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify products" 
ON public.products 
FOR ALL 
USING (auth.email() = 'hehe@me.pk');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default categories
INSERT INTO public.categories (name) VALUES 
  ('Women'),
  ('Men'),
  ('Accessories'),
  ('Shoes'),
  ('Bags');