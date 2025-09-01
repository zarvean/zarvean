import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '../hooks/use-toast';

export const LocalProduct = {};

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      console.log('🔄 ProductsContext: Fetching products from Supabase...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ ProductsContext: Error fetching products:', error);
        throw error;
      }
      
      console.log(`✅ ProductsContext: Successfully fetched ${data?.length || 0} products from database`);
      setProducts(data || []);
    } catch (error) {
      console.error('❌ ProductsContext: Failed to fetch products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    }
  };

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    try {
      console.log('🔄 ProductsContext: Fetching categories from Supabase...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('❌ ProductsContext: Error fetching categories:', error);
        throw error;
      }
      
      console.log(`✅ ProductsContext: Successfully fetched ${data?.length || 0} categories from database`);
      setCategories(data || []);
    } catch (error) {
      console.error('❌ ProductsContext: Failed to fetch categories:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const addProduct = async (productData) => {
    try {
      console.log('🆕 ProductsContext: Adding new product to Supabase:', productData.name);
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) {
        console.error('❌ ProductsContext: Error adding product:', error);
        throw error;
      }
      
      console.log('✅ ProductsContext: Product added successfully to database:', data.name);
      setProducts(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: `Product "${data.name}" added successfully`
      });
      
      return data;
    } catch (error) {
      console.error('❌ ProductsContext: Failed to add product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProduct = async (id, productUpdates) => {
    try {
      console.log('🔄 ProductsContext: Updating product in Supabase:', id, 'with updates:', productUpdates);
      const { data, error } = await supabase
        .from('products')
        .update(productUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ ProductsContext: Error updating product:', error);
        throw error;
      }
      
      console.log('✅ ProductsContext: Product updated successfully in database:', data.name);
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      
      toast({
        title: "Success",
        description: `Product "${data.name}" updated successfully`
      });
      
      return data;
    } catch (error) {
      console.error('❌ ProductsContext: Failed to update product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const productToDelete = products.find(p => p.id === id);
      console.log('🗑️ ProductsContext: Deleting product from Supabase:', productToDelete?.name);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ ProductsContext: Error deleting product:', error);
        throw error;
      }
      
      console.log('✅ ProductsContext: Product deleted successfully from database:', productToDelete?.name);
      setProducts(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Success",
        description: `Product "${productToDelete?.name}" deleted successfully`
      });
      
    } catch (error) {
      console.error('❌ ProductsContext: Failed to delete product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <ProductsContext.Provider value={{
      products,
      categories,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      fetchProducts,
      fetchCategories
    }}>
      {children}
    </ProductsContext.Provider>
  );
};