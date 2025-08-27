
export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  description: string
  sizes: string[]
  colors: string[]
  inStock: boolean
  isNew?: boolean
  isSale?: boolean
  sizeChart?: {
    [key: string]: {
      chest: string
      waist: string
      length: string
      shoulder: string
    }
  }
}

export const products: Product[] = [
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
    isNew: true,
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
    sizeChart: {
      "S": { chest: "38\"", waist: "32\"", length: "44\"", shoulder: "16\"" },
      "M": { chest: "40\"", waist: "34\"", length: "45\"", shoulder: "17\"" },
      "L": { chest: "42\"", waist: "36\"", length: "46\"", shoulder: "18\"" },
      "XL": { chest: "44\"", waist: "38\"", length: "47\"", shoulder: "19\"" },
      "XXL": { chest: "46\"", waist: "40\"", length: "48\"", shoulder: "20\"" }
    }
  }
]

export const categories = [
  "All",
  "Casual",
  "Formal", 
  "Traditional",
  "Festive",
  "Wedding"
]
