import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ProductsContext = createContext(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  console.log('ProductsProvider initialized');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    console.log('Fetching products from Supabase...');
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} products from database`);
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    }
  };

  const fetchCategories = async () => {
    console.log('Fetching categories from Supabase...');
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} categories from database`);
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      console.log('Loading initial product data...');
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
      console.log('✅ Initial data loading completed');
    };

    loadData();
  }, []);

  const addProduct = async (productData) => {
    console.log('Adding new product:', productData.name);
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        throw error;
      }

      console.log('✅ Product added successfully:', data.id);
      
      // Refresh products list
      await fetchProducts();
      
      toast({
        title: "Success",
        description: `Product "${productData.name}" added successfully`
      });

      return data;
    } catch (error) {
      console.error('Failed to add product:', error);
      toast({
        title: "Error",
        description: `Failed to add product: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProduct = async (id, productUpdates) => {
    console.log('Updating product:', id, 'with updates:', productUpdates);
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }

      console.log('✅ Product updated successfully:', id);
      
      // Refresh products list
      await fetchProducts();
      
      toast({
        title: "Success",
        description: `Product updated successfully`
      });

      return data;
    } catch (error) {
      console.error('Failed to update product:', error);
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    console.log('Deleting product:', id);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }

      console.log('✅ Product deleted successfully:', id);
      
      // Refresh products list
      await fetchProducts();
      
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const addCategory = async (categoryName) => {
    console.log('Adding new category:', categoryName);
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: categoryName }])
        .select()
        .single();

      if (error) {
        console.error('Error adding category:', error);
        throw error;
      }

      console.log('✅ Category added successfully:', data.id);
      
      // Refresh categories list
      await fetchCategories();
      
      toast({
        title: "Success",
        description: `Category "${categoryName}" added successfully`
      });

      return data;
    } catch (error) {
      console.error('Failed to add category:', error);
      toast({
        title: "Error",
        description: `Failed to add category: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCategory = async (id, categoryUpdates) => {
    console.log('Updating category:', id, 'with updates:', categoryUpdates);
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(categoryUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }

      console.log('✅ Category updated successfully:', id);
      
      // Refresh categories list
      await fetchCategories();
      
      toast({
        title: "Success",
        description: "Category updated successfully"
      });

      return data;
    } catch (error) {
      console.error('Failed to update category:', error);
      toast({
        title: "Error",
        description: `Failed to update category: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    console.log('Deleting category:', id);
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        throw error;
      }

      console.log('✅ Category deleted successfully:', id);
      
      // Refresh categories list
      await fetchCategories();
      
      toast({
        title: "Success",
        description: "Category deleted successfully"
      });
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast({
        title: "Error",
        description: `Failed to delete category: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const value = {
    products,
    categories,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshProducts: fetchProducts,
    refreshCategories: fetchCategories
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};