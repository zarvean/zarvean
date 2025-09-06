import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Edit, Trash2, Truck } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '../hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminShopManager from '../components/AdminShopManager';
import ReviewsManager from '../components/ReviewsManager';
import PromoCodesManager from '../components/PromoCodesManager';
import CommentManager from '../components/CommentManager';
import ImageUpload from '../components/ImageUpload';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    category_id: '',
    stock_quantity: '',
    is_featured: false,
    colors: '',
    sizes: '',
    in_stock: true,
    sale_percentage: '',
    tags: ''
  });

  // Check admin access using AuthContext
  useEffect(() => {
    if (user) {
      console.log('✅ Admin: User authenticated, fetching data...');
      fetchData();
    } else {
      console.log('❌ Admin: No user found, redirecting to auth');
      navigate('/auth');
    }
  }, [navigate, user]);

  const fetchData = async () => {
    try {
      console.log('🔄 Admin: Fetching products and categories from database...');

      const [productsResponse, categoriesResponse] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
      ]);

      console.log('📊 Admin: Products response:', productsResponse);
      console.log('📊 Admin: Categories response:', categoriesResponse);

      if (productsResponse.error) {
        console.error('❌ Admin: Error fetching products:', productsResponse.error);
      }
      if (categoriesResponse.error) {
        console.error('❌ Admin: Error fetching categories:', categoriesResponse.error);
      }

      console.log(`✅ Admin: Successfully fetched ${productsResponse.data?.length || 0} products and ${categoriesResponse.data?.length || 0} categories`);
      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('❌ Admin: Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please check your authentication.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      image_url: '',
      category_id: '',
      stock_quantity: '',
      is_featured: false,
      colors: '',
      sizes: '',
      in_stock: true,
      sale_percentage: '',
      tags: ''
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      image_url: product.image_url || '',
      category_id: product.category_id || '',
      stock_quantity: product.stock_quantity.toString(),
      is_featured: product.is_featured,
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      in_stock: product.in_stock,
      sale_percentage: product.sale_percentage?.toString() || '',
      tags: product.tags?.join(', ') || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔄 Admin: Form submission started');
    console.log('📝 Admin: Form data:', formData);
    
    // Validate required fields
    if (!formData.name || !formData.price || !formData.stock_quantity) {
      console.error('❌ Admin: Missing required fields');
      toast({
        title: "Error",
        description: "Please fill in all required fields (name, price, stock quantity)",
        variant: "destructive"
      });
      return;
    }
    
    console.log('✅ Admin: Saving product with local auth...');
    
    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      description: formData.description?.trim() || '',
      image_url: formData.image_url?.trim() || '',
      category_id: formData.category_id || null,
      stock_quantity: parseInt(formData.stock_quantity),
      is_featured: Boolean(formData.is_featured),
      colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(c => c) : [],
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : [],
      in_stock: Boolean(formData.in_stock),
      sale_percentage: formData.sale_percentage ? parseInt(formData.sale_percentage) : null,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
    };

    console.log('📦 Admin: Prepared product data:', productData);

    try {
      if (editingProduct) {
        console.log('🔄 Admin: Updating existing product in Supabase:', editingProduct.name);
        console.log('📝 Admin: Update payload:', productData);
        
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select()
          .single();
        
        console.log('📊 Admin: Update response:', { data, error });
        
        if (error) {
          console.error('❌ Admin: Supabase update error:', error);
          throw error;
        }
        
        if (!data) {
          console.error('❌ Admin: No data returned from update');
          throw new Error('No data returned from update operation');
        }
        
        console.log('✅ Admin: Product updated successfully in database:', data.name);
        
        // Update local state
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? data : p));
        
        toast({
          title: "Success",
          description: `Product "${data.name}" updated successfully`
        });
        
      } else {
        console.log('🔄 Admin: Creating new product in Supabase:', formData.name);
        console.log('📝 Admin: Insert payload:', productData);
        
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();
        
        console.log('📊 Admin: Insert response:', { data, error });
        
        if (error) {
          console.error('❌ Admin: Supabase insert error:', error);
          throw error;
        }
        
        if (!data) {
          console.error('❌ Admin: No data returned from insert');
          throw new Error('No data returned from insert operation');
        }
        
        console.log('✅ Admin: Product created successfully in database:', data.name);
        
        // Update local state
        setProducts(prev => [data, ...prev]);
        
        toast({
          title: "Success",
          description: `Product "${data.name}" created successfully`
        });
      }
      
      setIsAddDialogOpen(false);
      resetForm();
      
      // Refresh data from database
      setTimeout(() => {
        fetchData();
      }, 500);
      
    } catch (error) {
      console.error('❌ Admin: Error saving product to database:', error);
      console.error('❌ Admin: Error details:', {
        message: error.message,
        hint: error.hint,
        code: error.code,
        details: error.details
      });
      
      let errorMessage = "Failed to save product";
      if (error.message.includes('duplicate')) {
        errorMessage = "A product with this name already exists";
      } else if (error.message.includes('foreign key')) {
        errorMessage = "Invalid category selected";
      } else if (error.message) {
        errorMessage = `Failed to save product: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) return;
    
    console.log('🔄 Admin: Delete operation initiated for:', productName, 'ID:', productId);
    
    console.log('✅ Admin: Deleting product with local auth...');
    
    try {
      console.log('🔄 Admin: Deleting product from Supabase database...');
      console.log('📝 Admin: Delete params:', { productId, productName });
      
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .select();
      
      console.log('📊 Admin: Delete response:', { data, error });
      
      if (error) {
        console.error('❌ Admin: Supabase delete error:', error);
        throw error;
      }
      
      console.log('✅ Admin: Product deleted successfully from database:', productName);
      
      // Update local state
      setProducts(prev => prev.filter(p => p.id !== productId));
      
      toast({
        title: "Success",
        description: `Product "${productName}" deleted successfully`
      });
      
      // Refresh data from database
      setTimeout(() => {
        fetchData();
      }, 500);
      
    } catch (error) {
      console.error('❌ Admin: Error deleting product from database:', error);
      console.error('❌ Admin: Delete error details:', {
        message: error.message,
        hint: error.hint,
        code: error.code,
        details: error.details
      });
      
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-container py-16">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-serif font-semibold">Admin Panel</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()} className="btn-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProduct ? 'Update the product details below.' : 'Fill in the details to add a new product to your store.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (PKR)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                    <div>
                      <Label htmlFor="image_url">Product Image</Label>
                      <ImageUpload
                        value={formData.image_url}
                        onChange={(url) => setFormData({...formData, image_url: url})}
                      />
                    </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.category_id} 
                        onValueChange={(value) => setFormData({...formData, category_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="stock_quantity">Stock Quantity</Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="colors">Colors (comma separated)</Label>
                      <Input
                        id="colors"
                        value={formData.colors}
                        onChange={(e) => setFormData({...formData, colors: e.target.value})}
                        placeholder="Black, White, Navy"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sizes">Sizes (comma separated)</Label>
                      <Input
                        id="sizes"
                        value={formData.sizes}
                        onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                        placeholder="S, M, L, XL"
                      />
                    </div>
                  </div>
                  
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="sale_percentage">Sale Percentage (optional)</Label>
                       <Input
                         id="sale_percentage"
                         type="number"
                         min="0"
                         max="100"
                         value={formData.sale_percentage}
                         onChange={(e) => setFormData({...formData, sale_percentage: e.target.value})}
                         placeholder="Enter sale percentage (e.g., 20 for 20% off)"
                       />
                     </div>
                     <div>
                       <Label htmlFor="tags">Tags (comma separated)</Label>
                       <Input
                         id="tags"
                         value={formData.tags || ''}
                         onChange={(e) => setFormData({...formData, tags: e.target.value})}
                         placeholder="trending, summer, casual"
                       />
                     </div>
                   </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                      />
                      <span>Featured Product</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.in_stock}
                        onChange={(e) => setFormData({...formData, in_stock: e.target.checked})}
                      />
                      <span>In Stock</span>
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="btn-hero">
                      {editingProduct ? 'Update' : 'Create'} Product
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Admin Management</h2>
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select section to manage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="comments">Comments</SelectItem>
                  <SelectItem value="categories">Categories</SelectItem>
                  <SelectItem value="shop-manager">Shop Manager</SelectItem>
                  <SelectItem value="reviews">Reviews</SelectItem>
                  <SelectItem value="promo-codes">Promo Codes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {activeTab === "products" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-md mb-3"
                        />
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">PKR {product.price}</p>
                          {product.sale_percentage && (
                            <Badge variant="secondary" className="bg-red-100 text-red-700">
                              {product.sale_percentage}% OFF
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {product.is_featured && (
                            <Badge variant="secondary">Featured</Badge>
                          )}
                          {product.in_stock ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              In Stock ({product.stock_quantity})
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Out of Stock</Badge>
                          )}
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            <Truck className="h-3 w-3 mr-1" />
                            Free Delivery
                          </Badge>
                        </div>
                        {Array.isArray(product.colors) && product.colors.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Colors: {product.colors.join(', ')}
                          </p>
                        )}
                        {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Sizes: {product.sizes.join(', ')}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "comments" && (
              <CommentManager />
            )}
            
            {activeTab === "categories" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
            
            {activeTab === "shop-manager" && (
              <AdminShopManager />
            )}
            
            {activeTab === "reviews" && (
              <ReviewsManager />
            )}
            
            {activeTab === "promo-codes" && (
              <PromoCodesManager />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;