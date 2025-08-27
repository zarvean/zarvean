import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Edit, MessageSquare } from 'lucide-react';
import { useProducts, LocalProduct } from '@/contexts/ProductsContext';
import { toast } from '@/hooks/use-toast';

const ReviewsManager = () => {
  const { products, updateProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<LocalProduct | null>(null);
  const [reviewForm, setReviewForm] = useState({
    count: 0,
    rating: 0
  });
  const [reviewDialog, setReviewDialog] = useState(false);

  const openReviewDialog = (product: LocalProduct) => {
    setEditingProduct(product);
    setReviewForm({
      count: product.reviews?.count || 0,
      rating: product.reviews?.rating || 0
    });
    setReviewDialog(true);
  };

  const handleSubmitReviews = () => {
    if (!editingProduct) return;

    if (reviewForm.rating < 0 || reviewForm.rating > 5) {
      toast({
        title: "Error",
        description: "Rating must be between 0 and 5",
        variant: "destructive"
      });
      return;
    }

    if (reviewForm.count < 0) {
      toast({
        title: "Error", 
        description: "Review count cannot be negative",
        variant: "destructive"
      });
      return;
    }

    updateProduct(editingProduct.id, {
      reviews: {
        count: reviewForm.count,
        rating: reviewForm.rating
      }
    });

    toast({
      title: "Success",
      description: "Product reviews updated successfully"
    });

    setReviewDialog(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-200 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Reviews Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.category}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openReviewDialog(product)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderStars(product.reviews?.rating || 0)}
                    </div>
                    <span className="text-sm font-medium">
                      {product.reviews?.rating || 0}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.reviews?.count || 0} reviews
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Reviews - {editingProduct?.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="review-count">Number of Reviews</Label>
                <Input
                  id="review-count"
                  type="number"
                  min="0"
                  value={reviewForm.count}
                  onChange={(e) => setReviewForm(prev => ({ 
                    ...prev, 
                    count: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>
              
              <div>
                <Label htmlFor="review-rating">Average Rating (0-5)</Label>
                <Input
                  id="review-rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm(prev => ({ 
                    ...prev, 
                    rating: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">Preview:</span>
                <div className="flex">
                  {renderStars(reviewForm.rating)}
                </div>
                <span className="text-sm">
                  {reviewForm.rating} ({reviewForm.count} reviews)
                </span>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setReviewDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReviews}>
                  Update Reviews
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ReviewsManager;