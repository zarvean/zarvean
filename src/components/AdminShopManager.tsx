import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useAdmin, ShopSection } from '@/contexts/AdminContext';
import { useAlert } from '@/contexts/AlertContext';
import { toast } from '@/hooks/use-toast';

const AdminShopManager = () => {
  const { categories, sections, addCategory, removeCategory, updateCategory, addSection, updateSection, removeSection } = useAdmin();
  const { showDeleteConfirm } = useAlert();
  
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string>('');
  const [editCategoryValue, setEditCategoryValue] = useState('');
  
  const [sectionDialog, setSectionDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<ShopSection | null>(null);
  const [sectionForm, setSectionForm] = useState({
    name: '',
    description: '',
    categories: [] as string[],
    isActive: true
  });

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
      toast({
        title: "Success",
        description: "Category added successfully"
      });
    }
  };

  const handleUpdateCategory = () => {
    if (editCategoryValue.trim() && editingCategory) {
      updateCategory(editingCategory, editCategoryValue.trim());
      setEditingCategory('');
      setEditCategoryValue('');
      toast({
        title: "Success",
        description: "Category updated successfully"
      });
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (category === "All") {
      toast({
        title: "Error",
        description: "Cannot delete 'All' category",
        variant: "destructive"
      });
      return;
    }
    
    showDeleteConfirm({
      title: "Delete Category",
      description: "Are you sure you want to delete this category? This action cannot be undone.",
      itemName: category,
      onConfirm: () => {
        removeCategory(category);
        toast({
          title: "Success",
          description: "Category deleted successfully"
        });
      }
    });
  };

  const openSectionDialog = (section?: ShopSection) => {
    if (section) {
      setEditingSection(section);
      setSectionForm({
        name: section.name,
        description: section.description,
        categories: section.categories,
        isActive: section.isActive
      });
    } else {
      setEditingSection(null);
      setSectionForm({
        name: '',
        description: '',
        categories: ['All'],
        isActive: true
      });
    }
    setSectionDialog(true);
  };

  const handleSectionSubmit = () => {
    if (!sectionForm.name.trim()) {
      toast({
        title: "Error",
        description: "Section name is required",
        variant: "destructive"
      });
      return;
    }

    if (editingSection) {
      updateSection(editingSection.id, sectionForm);
      toast({
        title: "Success",
        description: "Section updated successfully"
      });
    } else {
      addSection(sectionForm);
      toast({
        title: "Success",
        description: "Section created successfully"
      });
    }
    
    setSectionDialog(false);
  };

  const handleDeleteSection = (id: string, sectionName: string) => {
    showDeleteConfirm({
      title: "Delete Section",
      description: "Are you sure you want to delete this section? This action cannot be undone.",
      itemName: sectionName,
      onConfirm: () => {
        removeSection(id);
        toast({
          title: "Success",
          description: "Section deleted successfully"
        });
      }
    });
  };

  const toggleSectionCategory = (category: string) => {
    setSectionForm(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(cat => cat !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Categories Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Category Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Category */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter new category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Existing Categories */}
          <div className="space-y-2">
            <h4 className="font-medium">Existing Categories</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  {editingCategory === category ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        value={editCategoryValue}
                        onChange={(e) => setEditCategoryValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdateCategory()}
                        className="text-sm"
                      />
                        <Button size="sm" onClick={handleUpdateCategory}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingCategory('')}>Cancel</Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{category}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingCategory(category);
                            setEditCategoryValue(category);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCategory(category)}
                          disabled={category === "All"}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Shop Sections Management
            </CardTitle>
            <Dialog open={sectionDialog} onOpenChange={setSectionDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => openSectionDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSection ? 'Edit Section' : 'Create New Section'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="section-name">Section Name</Label>
                    <Input
                      id="section-name"
                      value={sectionForm.name}
                      onChange={(e) => setSectionForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Men's Watches Collection"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="section-description">Description</Label>
                    <Textarea
                      id="section-description"
                      value={sectionForm.description}
                      onChange={(e) => setSectionForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of this section..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label>Categories to Include</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cat-${category}`}
                            checked={sectionForm.categories.includes(category)}
                            onCheckedChange={() => toggleSectionCategory(category)}
                          />
                          <Label htmlFor={`cat-${category}`} className="text-sm">{category}</Label>
                        </div>
                       ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="section-active"
                      checked={sectionForm.isActive}
                      onCheckedChange={(checked) => setSectionForm(prev => ({ ...prev, isActive: !!checked }))}
                    />
                    <Label htmlFor="section-active">Active Section</Label>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setSectionDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSectionSubmit}>
                      {editingSection ? 'Update' : 'Create'} Section
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sections.map((section) => (
              <Card key={section.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{section.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {section.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openSectionDialog(section)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteSection(section.id, section.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={section.isActive ? "default" : "secondary"}>
                        {section.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {section.categories.length} categories
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {section.categories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminShopManager;
