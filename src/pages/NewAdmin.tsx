import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts, LocalProduct } from '@/contexts/ProductsContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useAlert } from '@/contexts/AlertContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Truck, ShoppingBag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUpload from '@/components/ImageUpload';

const NewAdmin = () => {
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { sections, assignProductToSections, getProductSections } = useAdmin();
  const { showDeleteConfirm } = useAlert();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LocalProduct | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    images: [] as string[],
    category: '',
    colors: '',
    sizes: '',
    inStock: true,
    featured: false,
    isSale: false,
    assignedSections: [] as string[]
  });

  // Check admin access
  React.useEffect(() => {
    if (!user || user.email !== 'hehe@me.pk') {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      description: '',
      images: [],
      category: '',
      colors: '',
      sizes: '',
      inStock: true,
      featured: false,
      isSale: false,
      assignedSections: []
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: LocalProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      description: product.description || '',
      images: product.images || [],
      category: product.category || '',
      colors: product.colors.join(', ') || '',
      sizes: product.sizes.join(', ') || '',
      inStock: product.inStock,
      featured: product.featured,
      isSale: product.isSale || false,
      assignedSections: getProductSections(product.id)
    });
    setIsAddDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      description: formData.description,
      images: formData.images,
      category: formData.category,
      colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
      inStock: formData.inStock,
      featured: formData.featured,
      isSale: formData.isSale
    };

    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, productData);
        // Update section assignments
        assignProductToSections(editingProduct.id, formData.assignedSections);
        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        const newProduct = addProduct(productData);
        // Assign to sections if any selected
        if (formData.assignedSections.length > 0 && newProduct) {
          assignProductToSections(newProduct.id, formData.assignedSections);
        }
        toast({
          title: "Success",
          description: "Product created successfully"
        });
      }
      
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    showDeleteConfirm({
      title: "Delete Product",
      description: "Are you sure you want to delete this product? This action cannot be undone.",
      itemName: productName,
      onConfirm: () => {
        try {
          deleteProduct(productId);
          toast({
            title: "Success",
            description: "Product deleted successfully"
          });
        } catch (error) {
          console.error('Error deleting product:', error);
          toast({
            title: "Error",
            description: "Failed to delete product",
            variant: "destructive"
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-card rounded-xl shadow-elegant p-6 sm:p-8 mb-8 border border-border/50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-foreground mb-2">
                  Admin Panel
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Manage your products and inventory
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate('/admin/orders')}
                  variant="outline"
                  className="btn-outline w-full sm:w-auto"
                  size="default"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Manage Orders</span>
                  <span className="sm:hidden">Orders</span>
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetForm()} className="btn-hero w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Add Product</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border border-border/50">
                    <DialogHeader className="pb-4 border-b border-border/20">
                      <DialogTitle className="text-xl font-serif">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">Product Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-sm font-medium">Price (RS)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            required
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice" className="text-sm font-medium">Original Price (RS - Only for Sale Items)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.01"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                          placeholder="Leave empty if not on sale"
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={3}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="images" className="text-sm font-medium">Product Images</Label>
                        <div className="border border-border/50 rounded-lg p-4 bg-muted/20">
                          <ImageUpload
                            onImagesChange={(images) => setFormData({...formData, images})}
                            initialImages={formData.images}
                            maxImages={5}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          placeholder="e.g., Clothing, Accessories"
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="colors" className="text-sm font-medium">Colors (comma separated)</Label>
                          <Input
                            id="colors"
                            value={formData.colors}
                            onChange={(e) => setFormData({...formData, colors: e.target.value})}
                            placeholder="Black, White, Navy"
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sizes" className="text-sm font-medium">Sizes (comma separated)</Label>
                          <Input
                            id="sizes"
                            value={formData.sizes}
                            onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                            placeholder="S, M, L, XL"
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg border border-border/30">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                            className="w-4 h-4 text-primary bg-transparent border-2 border-border rounded focus:ring-2 focus:ring-primary/20"
                          />
                          <span className="text-sm font-medium">Featured Product</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.inStock}
                            onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                            className="w-4 h-4 text-primary bg-transparent border-2 border-border rounded focus:ring-2 focus:ring-primary/20"
                          />
                          <span className="text-sm font-medium">In Stock</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isSale}
                            onChange={(e) => setFormData({...formData, isSale: e.target.checked})}
                            className="w-4 h-4 text-primary bg-transparent border-2 border-border rounded focus:ring-2 focus:ring-primary/20"
                          />
                          <span className="text-sm font-medium">Sale Item</span>
                        </label>
                      </div>

                      {/* Section Assignment */}
                      {sections.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Assign to Sections</Label>
                          <div className="border border-border/50 rounded-lg p-4 bg-muted/20 max-h-40 overflow-y-auto">
                            <div className="grid grid-cols-1 gap-3">
                              {sections.map((section) => (
                                <div key={section.id} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`section-${section.id}`}
                                    checked={formData.assignedSections.includes(section.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setFormData(prev => ({
                                          ...prev,
                                          assignedSections: [...prev.assignedSections, section.id]
                                        }));
                                      } else {
                                        setFormData(prev => ({
                                          ...prev,
                                          assignedSections: prev.assignedSections.filter(id => id !== section.id)
                                        }));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`section-${section.id}`} className="text-sm cursor-pointer">
                                    {section.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            If no sections are selected, the product will appear in all sections based on its category.
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border/20">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsAddDialogOpen(false)}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="btn-hero w-full sm:w-auto">
                          {editingProduct ? 'Update' : 'Create'} Product
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Products Grid - 2 products per row on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-card border border-border/50 overflow-hidden">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-sm sm:text-base lg:text-lg font-serif line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </CardTitle>
                    <div className="flex space-x-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(product.id, product.name)}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  {product.images[0] && (
                    <div className="relative overflow-hidden rounded-lg mb-3 bg-muted/20">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-32 sm:h-40 lg:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {product.isSale && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground text-xs px-2 py-1">
                            Sale
                          </Badge>
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs px-2 py-1">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.isSale && product.originalPrice ? (
                          <>
                            <p className="font-semibold text-primary text-sm sm:text-base">RS {product.price}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground line-through">RS {product.originalPrice}</p>
                          </>
                        ) : (
                          <p className="font-semibold text-primary text-sm sm:text-base">RS {product.price}</p>
                        )}
                      </div>
                      <Badge 
                        variant={product.inStock ? "secondary" : "destructive"} 
                        className={`text-xs ${product.inStock ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : ''}`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    
                    {product.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                        <Truck className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Free Delivery
                      </Badge>
                      {product.category && (
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                    
                    {(product.colors.length > 0 || product.sizes.length > 0) && (
                      <div className="space-y-1">
                        {product.colors.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Colors:</span> {product.colors.slice(0, 3).join(', ')}{product.colors.length > 3 ? '...' : ''}
                          </p>
                        )}
                        {product.sizes.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Sizes:</span> {product.sizes.slice(0, 4).join(', ')}{product.sizes.length > 4 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {getProductSections(product.id).length > 0 && (
                      <div className="pt-2 border-t border-border/30">
                        <p className="text-xs text-muted-foreground mb-1 font-medium">Sections:</p>
                        <div className="flex flex-wrap gap-1">
                          {getProductSections(product.id).slice(0, 2).map((sectionId) => {
                            const section = sections.find(s => s.id === sectionId);
                            return section ? (
                              <Badge key={sectionId} variant="outline" className="text-xs bg-accent/10 text-accent-foreground">
                                {section.name}
                              </Badge>
                            ) : null;
                          })}
                          {getProductSections(product.id).length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{getProductSections(product.id).length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewAdmin;