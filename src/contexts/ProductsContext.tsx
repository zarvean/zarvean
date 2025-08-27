import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface LocalProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  isSale?: boolean;
  originalPrice?: number;
  isNew?: boolean;
  reviews?: {
    count: number;
    rating: number;
  };
  sizeChart?: {
    [key: string]: {
      chest: string;
      waist: string;
      length: string;
      shoulder: string;
    };
  };
}

interface ProductsContextType {
  products: LocalProduct[];
  addProduct: (product: Omit<LocalProduct, 'id'>) => LocalProduct;
  updateProduct: (id: string, product: Partial<LocalProduct>) => void;
  deleteProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

const initialProducts: LocalProduct[] = [
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
  },
  {
    id: "2", 
    name: "Classic Cotton Kurta",
    price: 899,
    images: ["/src/assets/product-blouse.jpg", "/src/assets/product-coat.jpg"],
    category: "Casual",
    description: "Comfortable cotton kurta for everyday wear. Breathable fabric with traditional cut.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Cream", "Light Blue"],
    inStock: true,
    featured: false,
    reviews: {
      count: 18,
      rating: 4.2
    },
    sizeChart: {
      "S": { chest: "38\"", waist: "32\"", length: "42\"", shoulder: "16\"" },
      "M": { chest: "40\"", waist: "34\"", length: "43\"", shoulder: "17\"" },
      "L": { chest: "42\"", waist: "36\"", length: "44\"", shoulder: "18\"" },
      "XL": { chest: "44\"", waist: "38\"", length: "45\"", shoulder: "19\"" },
      "XXL": { chest: "46\"", waist: "40\"", length: "46\"", shoulder: "20\"" }
    }
  },
  {
    id: "3",
    name: "Embroidered Festive Set",
    price: 3499,
    images: ["/src/assets/product-boots.jpg", "/src/assets/product-bag.jpg", "/src/assets/product-coat.jpg"],
    category: "Festive", 
    description: "Beautiful embroidered shalwar kameez perfect for Eid and festivals. Premium quality fabric with gold thread work.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Emerald Green"],
    inStock: true,
    featured: false,
    reviews: {
      count: 31,
      rating: 4.8
    },
    sizeChart: {
      "S": { chest: "38\"", waist: "32\"", length: "44\"", shoulder: "16\"" },
      "M": { chest: "40\"", waist: "34\"", length: "45\"", shoulder: "17\"" },
      "L": { chest: "42\"", waist: "36\"", length: "46\"", shoulder: "18\"" },
      "XL": { chest: "44\"", waist: "38\"", length: "47\"", shoulder: "19\"" },
      "XXL": { chest: "46\"", waist: "40\"", length: "48\"", shoulder: "20\"" }
    }
  },
  {
    id: "4",
    name: "Premium Linen Kurta",
    price: 1299,
    originalPrice: 1599,
    images: ["/src/assets/product-coat.jpg", "/src/assets/product-blouse.jpg"],
    category: "Casual", 
    description: "Premium linen kurta with modern cut. Perfect for summer wear with excellent breathability.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige", "Olive", "Navy"],
    inStock: true,
    featured: false,
    isSale: true,
    sizeChart: {
      "S": { chest: "38\"", waist: "32\"", length: "42\"", shoulder: "16\"" },
      "M": { chest: "40\"", waist: "34\"", length: "43\"", shoulder: "17\"" },
      "L": { chest: "42\"", waist: "36\"", length: "44\"", shoulder: "18\"" },
      "XL": { chest: "44\"", waist: "38\"", length: "45\"", shoulder: "19\"" },
      "XXL": { chest: "46\"", waist: "40\"", length: "46\"", shoulder: "20\"" }
    }
  },
  {
    id: "5",
    name: "Traditional Pathani Suit",
    price: 1899,
    images: ["/src/assets/product-bag.jpg", "/src/assets/product-boots.jpg"],
    category: "Traditional",
    description: "Classic Pathani suit with authentic cut and design. Perfect for cultural events and traditional occasions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Cream", "Light Gray", "Khaki"],
    inStock: true,
    featured: false,
    sizeChart: {
      "S": { chest: "38\"", waist: "32\"", length: "43\"", shoulder: "16\"" },
      "M": { chest: "40\"", waist: "34\"", length: "44\"", shoulder: "17\"" },
      "L": { chest: "42\"", waist: "36\"", length: "45\"", shoulder: "18\"" },
      "XL": { chest: "44\"", waist: "38\"", length: "46\"", shoulder: "19\"" },
      "XXL": { chest: "46\"", waist: "40\"", length: "47\"", shoulder: "20\"" }
    }
  },
  {
    id: "6",
    name: "Wedding Special Sherwani",
    price: 5999,
    images: ["/src/assets/product-blouse.jpg", "/src/assets/product-bag.jpg", "/src/assets/product-boots.jpg", "/src/assets/product-coat.jpg"],
    category: "Wedding",
    description: "Luxurious wedding sherwani with heavy embroidery and premium fabric. Complete set with churidar.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gold", "Ivory", "Deep Red"],
    inStock: true,
    featured: false,
    sizeChart: {
      "S": { chest: "38\"", waist: "32\"", length: "45\"", shoulder: "16\"" },
      "M": { chest: "40\"", waist: "34\"", length: "46\"", shoulder: "17\"" },
      "L": { chest: "42\"", waist: "36\"", length: "47\"", shoulder: "18\"" },
      "XL": { chest: "44\"", waist: "38\"", length: "48\"", shoulder: "19\"" },
      "XXL": { chest: "46\"", waist: "40\"", length: "49\"", shoulder: "20\"" }
    }
  },
  {
    id: "7",
    name: "Casual Chambray Kurta", 
    price: 1099,
    images: ["/src/assets/product-boots.jpg", "/src/assets/product-coat.jpg"],
    category: "Casual",
    description: "Modern chambray kurta with contemporary styling. Perfect for office wear and casual outings.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Light Blue", "Gray", "White"],
    inStock: true,
    featured: false,
    isNew: true,
    sizeChart: {
      "S": { chest: "38\"", waist: "32\"", length: "42\"", shoulder: "16\"" },
      "M": { chest: "40\"", waist: "34\"", length: "43\"", shoulder: "17\"" },
      "L": { chest: "42\"", waist: "36\"", length: "44\"", shoulder: "18\"" },
      "XL": { chest: "44\"", waist: "38\"", length: "45\"", shoulder: "19\"" },
      "XXL": { chest: "46\"", waist: "40\"", length: "46\"", shoulder: "20\"" }
    }
  },
  {
    id: "8",
    name: "Velvet Formal Kurta",
    price: 2799,
    images: ["/src/assets/product-coat.jpg", "/src/assets/product-bag.jpg"],
    category: "Formal",
    description: "Elegant velvet kurta with subtle embellishments. Perfect for formal dinners and special events.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Burgundy", "Navy", "Black"],
    inStock: true,
    featured: false,
    sizeChart: {
      "S": { chest: "38\"", waist: "32\"", length: "44\"", shoulder: "16\"" },
      "M": { chest: "40\"", waist: "34\"", length: "45\"", shoulder: "17\"" },
      "L": { chest: "42\"", waist: "36\"", length: "46\"", shoulder: "18\"" },
      "XL": { chest: "44\"", waist: "38\"", length: "47\"", shoulder: "19\"" },
      "XXL": { chest: "46\"", waist: "40\"", length: "48\"", shoulder: "20\"" }
    }
  }
];

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<LocalProduct[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('products', JSON.stringify(initialProducts));
    return initialProducts;
  });

  const addProduct = (product: Omit<LocalProduct, 'id'>): LocalProduct => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => {
      const updated = [...prev, newProduct];
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });
    return newProduct;
  };

  const updateProduct = (id: string, productUpdates: Partial<LocalProduct>) => {
    setProducts(prev => {
      const updated = prev.map(p => 
        p.id === id ? { ...p, ...productUpdates } : p
      );
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(updated));
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