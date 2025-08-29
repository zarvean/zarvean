import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AdminContext = createContext(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  console.log('AdminContext initialized');
  
  const [categories, setCategories] = useState(['All', 'Formal', 'Casual', 'Traditional', 'Wedding', 'Festive']);
  const [sections, setSections] = useState([
    {
      id: '1',
      name: 'Featured Collection',
      description: 'Our handpicked selection of premium products',
      categories: ['All'],
      isActive: true
    },
    {
      id: '2', 
      name: 'New Arrivals',
      description: 'Latest additions to our catalog',
      categories: ['All'],
      isActive: true
    }
  ]);

  const addCategory = async (categoryName) => {
    console.log('Adding category to admin context:', categoryName);
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

      console.log('✅ Category added to database:', data.id);
      setCategories(prev => [...prev, categoryName]);
      
      toast({
        title: "Success",
        description: `Category "${categoryName}" added successfully`
      });
    } catch (error) {
      console.error('Failed to add category:', error);
      toast({
        title: "Error",
        description: `Failed to add category: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const removeCategory = async (categoryName) => {
    console.log('Removing category from admin context:', categoryName);
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('name', categoryName);

      if (error) {
        console.error('Error removing category:', error);
        throw error;
      }

      console.log('✅ Category removed from database:', categoryName);
      setCategories(prev => prev.filter(cat => cat !== categoryName));
      
      toast({
        title: "Success",
        description: `Category "${categoryName}" removed successfully`
      });
    } catch (error) {
      console.error('Failed to remove category:', error);
      toast({
        title: "Error",
        description: `Failed to remove category: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const updateCategory = async (oldName, newName) => {
    console.log('Updating category:', oldName, 'to:', newName);
    try {
      const { error } = await supabase
        .from('categories')
        .update({ name: newName })
        .eq('name', oldName);

      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }

      console.log('✅ Category updated in database');
      setCategories(prev => prev.map(cat => cat === oldName ? newName : cat));
      
      toast({
        title: "Success",
        description: `Category updated to "${newName}" successfully`
      });
    } catch (error) {
      console.error('Failed to update category:', error);
      toast({
        title: "Error",
        description: `Failed to update category: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const addSection = async (sectionData) => {
    console.log('Adding section to admin context:', sectionData);
    try {
      const { data, error } = await supabase
        .from('shop_sections')
        .insert([{
          name: sectionData.name,
          description: sectionData.description,
          is_active: sectionData.isActive
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding section:', error);
        throw error;
      }

      console.log('✅ Section added to database:', data.id);
      
      const newSection = {
        id: data.id,
        name: sectionData.name,
        description: sectionData.description,
        categories: sectionData.categories,
        isActive: sectionData.isActive
      };
      
      setSections(prev => [...prev, newSection]);
      
      toast({
        title: "Success",
        description: `Section "${sectionData.name}" added successfully`
      });
    } catch (error) {
      console.error('Failed to add section:', error);
      toast({
        title: "Error",
        description: `Failed to add section: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const updateSection = async (sectionId, sectionData) => {
    console.log('Updating section:', sectionId, 'with data:', sectionData);
    try {
      const { error } = await supabase
        .from('shop_sections')
        .update({
          name: sectionData.name,
          description: sectionData.description,
          is_active: sectionData.isActive
        })
        .eq('id', sectionId);

      if (error) {
        console.error('Error updating section:', error);
        throw error;
      }

      console.log('✅ Section updated in database');
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, ...sectionData }
          : section
      ));
      
      toast({
        title: "Success",
        description: `Section "${sectionData.name}" updated successfully`
      });
    } catch (error) {
      console.error('Failed to update section:', error);
      toast({
        title: "Error",
        description: `Failed to update section: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const removeSection = async (sectionId) => {
    console.log('Removing section:', sectionId);
    try {
      const { error } = await supabase
        .from('shop_sections')
        .delete()
        .eq('id', sectionId);

      if (error) {
        console.error('Error removing section:', error);
        throw error;
      }

      console.log('✅ Section removed from database');
      setSections(prev => prev.filter(section => section.id !== sectionId));
      
      toast({
        title: "Success",
        description: "Section removed successfully"
      });
    } catch (error) {
      console.error('Failed to remove section:', error);
      toast({
        title: "Error",
        description: `Failed to remove section: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const value = {
    categories,
    sections,
    addCategory,
    removeCategory,
    updateCategory,
    addSection,
    updateSection,
    removeSection
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};