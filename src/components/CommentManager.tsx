import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Edit, Trash2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useProducts } from '@/contexts/ProductsContext';

interface Comment {
  id: string;
  product_id: string;
  title: string;
  content: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const CommentManager = () => {
  const { products } = useProducts();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [formData, setFormData] = useState({
    product_id: '',
    title: '',
    content: '',
    is_featured: false,
    display_order: 0
  });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch comments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: '',
      title: '',
      content: '',
      is_featured: false,
      display_order: 0
    });
    setEditingComment(null);
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setFormData({
      product_id: comment.product_id,
      title: comment.title,
      content: comment.content,
      is_featured: comment.is_featured,
      display_order: comment.display_order
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product_id || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const commentData = {
        product_id: formData.product_id,
        title: formData.title.trim() || null,
        content: formData.content.trim(),
        is_featured: formData.is_featured,
        display_order: formData.display_order
      };

      if (editingComment) {
        const { error } = await supabase
          .from('comments')
          .update(commentData)
          .eq('id', editingComment.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Comment updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('comments')
          .insert([commentData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Comment created successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchComments();
    } catch (error) {
      console.error('Error saving comment:', error);
      toast({
        title: "Error",
        description: "Failed to save comment",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment deleted successfully"
      });

      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive"
      });
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading comments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingComment ? 'Edit Comment' : 'Add New Comment'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="product">Product</Label>
                  <Select 
                    value={formData.product_id} 
                    onValueChange={(value) => setFormData({...formData, product_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Title (optional)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter comment title"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Comment Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Enter comment content"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="is_featured">Featured Comment</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingComment ? 'Update Comment' : 'Create Comment'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">
                        {comment.title || 'Untitled Comment'}
                      </h4>
                      {comment.is_featured && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getProductName(comment.product_id)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(comment)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-2">
                  {comment.content}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Order: {comment.display_order}</span>
                  <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments found. Add your first comment!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentManager;