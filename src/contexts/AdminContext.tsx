import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ShopSection {
  id: string;
  name: string;
  description: string;
  categories: string[];
  isActive: boolean;
}

export interface ProductAssignment {
  productId: string;
  sectionIds: string[];
}

interface AdminContextType {
  categories: string[];
  sections: ShopSection[];
  productAssignments: ProductAssignment[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  updateCategory: (oldCategory: string, newCategory: string) => void;
  addSection: (section: Omit<ShopSection, 'id'>) => void;
  updateSection: (id: string, section: Partial<ShopSection>) => void;
  removeSection: (id: string) => void;
  assignProductToSections: (productId: string, sectionIds: string[]) => void;
  getProductSections: (productId: string) => string[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [sections, setSections] = useState<ShopSection[]>([]);
  const [productAssignments, setProductAssignments] = useState<ProductAssignment[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCategories = localStorage.getItem('admin_categories');
    const savedSections = localStorage.getItem('admin_sections');
    const savedAssignments = localStorage.getItem('admin_product_assignments');

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Default categories
      const defaultCategories = ["All", "Casual", "Formal", "Traditional", "Festive", "Wedding"];
      setCategories(defaultCategories);
      localStorage.setItem('admin_categories', JSON.stringify(defaultCategories));
    }

    if (savedSections) {
      setSections(JSON.parse(savedSections));
    } else {
      // Default section
      const defaultSections: ShopSection[] = [
        {
          id: '1',
          name: "Men's Shalwar Kameez Collection",
          description: "Explore our premium collection of traditional men's wear crafted with finest fabrics and attention to detail.",
          categories: ["All", "Casual", "Formal", "Traditional", "Festive", "Wedding"],
          isActive: true
        }
      ];
      setSections(defaultSections);
      localStorage.setItem('admin_sections', JSON.stringify(defaultSections));
    }

    if (savedAssignments) {
      setProductAssignments(JSON.parse(savedAssignments));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('admin_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('admin_sections', JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem('admin_product_assignments', JSON.stringify(productAssignments));
  }, [productAssignments]);

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const removeCategory = (category: string) => {
    if (category !== "All") { // Don't allow removing "All" category
      setCategories(prev => prev.filter(cat => cat !== category));
      // Update sections to remove this category
      setSections(prev => prev.map(section => ({
        ...section,
        categories: section.categories.filter(cat => cat !== category)
      })));
    }
  };

  const updateCategory = (oldCategory: string, newCategory: string) => {
    setCategories(prev => prev.map(cat => cat === oldCategory ? newCategory : cat));
    // Update sections that use this category
    setSections(prev => prev.map(section => ({
      ...section,
      categories: section.categories.map(cat => cat === oldCategory ? newCategory : cat)
    })));
  };

  const addSection = (section: Omit<ShopSection, 'id'>) => {
    const newSection: ShopSection = {
      ...section,
      id: Date.now().toString()
    };
    setSections(prev => [...prev, newSection]);
  };

  const updateSection = (id: string, updates: Partial<ShopSection>) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
    // Remove product assignments for this section
    setProductAssignments(prev => prev.map(assignment => ({
      ...assignment,
      sectionIds: assignment.sectionIds.filter(sectionId => sectionId !== id)
    })).filter(assignment => assignment.sectionIds.length > 0));
  };

  const assignProductToSections = (productId: string, sectionIds: string[]) => {
    setProductAssignments(prev => {
      const existingIndex = prev.findIndex(assignment => assignment.productId === productId);
      if (existingIndex >= 0) {
        // Update existing assignment
        const updated = [...prev];
        if (sectionIds.length === 0) {
          // Remove assignment if no sections selected
          updated.splice(existingIndex, 1);
        } else {
          updated[existingIndex] = { productId, sectionIds };
        }
        return updated;
      } else if (sectionIds.length > 0) {
        // Add new assignment
        return [...prev, { productId, sectionIds }];
      }
      return prev;
    });
  };

  const getProductSections = (productId: string): string[] => {
    const assignment = productAssignments.find(a => a.productId === productId);
    return assignment ? assignment.sectionIds : [];
  };

  return (
    <AdminContext.Provider value={{
      categories,
      sections,
      productAssignments,
      addCategory,
      removeCategory,
      updateCategory,
      addSection,
      updateSection,
      removeSection,
      assignProductToSections,
      getProductSections
    }}>
      {children}
    </AdminContext.Provider>
  );
};