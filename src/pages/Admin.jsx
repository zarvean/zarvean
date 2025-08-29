import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Truck, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminShopManager from '@/components/AdminShopManager';
import ReviewsManager from '@/components/ReviewsManager';
import PromoCodesManager from '@/components/PromoCodesManager';

const Admin = () => {
  console.log('Admin page rendered');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Check admin access
  useEffect(() => {
    console.log('Checking admin access for user:', user?.email);
    if (!user || user.email !== 'hehe@me.pk') {
      console.log('Access denied: not an admin user');
      navigate('/auth');
      return;
    }
    console.log('Admin access granted');
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    console.log('Fetching admin data...');
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
      ]);

      if (productsResponse.error) {
        console.error('Error fetching products:', productsResponse.error);
        throw productsResponse.error;
      }
      if (categoriesResponse.error) {
        console.error('Error fetching categories:', categoriesResponse.error);
        throw categoriesResponse.error;
      }

      console.log('Products loaded:', productsResponse.data?.length || 0);
      console.log('Categories loaded:', categoriesResponse.data?.length || 0);

      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    console.log('Resetting form');
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
    console.log('Editing product:', product.id, product.name);
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
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      image_url: formData.image_url,
      category_id: formData.category_id,
      stock_quantity: parseInt(formData.stock_quantity),
      is_featured: formData.is_featured,
      colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
      in_stock: formData.in_stock,
      sale_percentage: formData.sale_percentage ? parseInt(formData.sale_percentage) : null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    };

    console.log('Submitting product data:', {
      ...productData,
      action: editingProduct ? 'UPDATE' : 'CREATE',
      productId: editingProduct?.id
    });

    try {
      if (editingProduct) {
        console.log('Updating product:', editingProduct.id);
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('Product updated successfully:', editingProduct.id);
        toast({
          title: "Success",
          description: `Product "${formData.name}" updated successfully`
        });
      } else {
        console.log('Creating new product');
        const { error, data: newProduct } = await supabase
          .from('products')
          .insert([productData])
          .select();
        
        if (error) {
          console.error('Create error:', error);
          throw error;
        }
        
        console.log('Product created successfully:', newProduct?.[0]?.id);
        toast({
          title: "Success",
          description: `Product "${formData.name}" created successfully`
        });
      }
      
      setIsAddDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingProduct ? 'update' : 'create'} product: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (productId, productName) => {
    console.log('Delete requested for product:', productId, productName);
    
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
      console.log('Delete cancelled by user');
      return;
    }
    
    console.log('Deleting product:', productId);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      console.log('Product deleted successfully:', productId);
      toast({
        title: "Success",
        description: `Product "${productName}" deleted successfully`
      });
      
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleBulkInventoryUpdate = async () => {
    console.log('Triggering bulk inventory update...');
    try {
      const { data, error } = await supabase.functions.invoke('inventory-management', {
        body: {
          action: 'inventory_report',
          user_id: user.id
        }
      });

      if (error) {
        console.error('Inventory management error:', error);
        throw error;
      }

      console.log('Inventory report generated:', data);
      toast({
        title: "Inventory Report",
        description: `Total products: ${data.total_products}, Out of stock: ${data.out_of_stock}`,
      });
    } catch (error) {
      console.error('Error generating inventory report:', error);
      toast({
        title: "Error",
        description: "Failed to generate inventory report",
        variant: "destructive"
      });
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-container py-16">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading admin panel...
          </div>
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif font-semibold">Admin Panel</h1>
            <div className="flex gap-4">
              <Button onClick={handleBulkInventoryUpdate} variant="outline">
                <Truck className="h-4 w-4 mr-2" />
                Inventory Report
              </Button>
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
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        placeholder="https://example.com/image.jpg"
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
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="shop-manager">Shop Manager</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="promo-codes">Promo Codes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <Badge variant="secondary" className="bg-red-100 text-red-700">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Out of Stock
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {getCategoryName(product.category_id)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found. Add your first product to get started.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="categories">
              <AdminShopManager />
            </TabsContent>
            
            <TabsContent value="shop-manager">
              <AdminShopManager />
            </TabsContent>
            
            <TabsContent value="reviews">
              <ReviewsManager />
            </TabsContent>
            
            <TabsContent value="promo-codes">
              <PromoCodesManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;