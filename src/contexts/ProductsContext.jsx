import React, { createContext, useContext, useState } from 'react';

export const LocalProduct = {};

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

const initialProducts = [
  {
    id: "1",
    name: "Royal Silk Shalwar Kameez",
    price: 2999,
    images: ["/src/assets/product-bag.jpg", "/src/assets/product-blouse.jpg", "/src/assets/product-boots.jpg"],
    category: "Formal",
    description: "Exquisite royal silk shalwar kameez with intricate embroidery. Perfect for weddings and special occasions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Royal Blue", "Gold", "Maroon"],
    inStock: true,
    featured: false,
    isNew: true,
    reviews: {
      count: 24,
      rating: 4.5
    },
    sizeChart: {
      "S": { chest: "38\"", waist: "32\"", length: "44\"", shoulder: "16\"" },
      "M": { chest: "40\"", waist: "34\"", length: "45\"", shoulder: "17\"" },
      "L": { chest: "42\"", waist: "36\"", length: "46\"", shoulder: "18\"" },
      "XL": { chest: "44\"", waist: "38\"", length: "47\"", shoulder: "19\"" },
      "XXL": { chest: "46\"", waist: "40\"", length: "48\"", shoulder: "20\"" }
    }
  }
];

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('products', JSON.stringify(initialProducts));
    return initialProducts;
  });

  const addProduct = (product) => {
    console.log('🆕 ProductsContext: Adding new product:', product.name);
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => {
      const updated = [...prev, newProduct];
      localStorage.setItem('products', JSON.stringify(updated));
      console.log('✅ ProductsContext: Product added successfully:', newProduct.name);
      return updated;
    });
    return newProduct;
  };

  const updateProduct = (id, productUpdates) => {
    console.log('🔄 ProductsContext: Updating product ID:', id, 'with updates:', productUpdates);
    setProducts(prev => {
      const updated = prev.map(p => 
        p.id === id ? { ...p, ...productUpdates } : p
      );
      localStorage.setItem('products', JSON.stringify(updated));
      const updatedProduct = updated.find(p => p.id === id);
      console.log('✅ ProductsContext: Product updated successfully:', updatedProduct?.name);
      return updated;
    });
  };

  const deleteProduct = (id) => {
    const productToDelete = products.find(p => p.id === id);
    console.log('🗑️ ProductsContext: Deleting product:', productToDelete?.name);
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(updated));
      console.log('✅ ProductsContext: Product deleted successfully:', productToDelete?.name);
      return updated;
    });
  };

  return (
    <ProductsContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductsContext.Provider>
  );
};