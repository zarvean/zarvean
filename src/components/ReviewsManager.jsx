import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Check, X, Eye, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ReviewsManager = () => {
  console.log('ReviewsManager component rendered');
  
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log('Fetching reviews and products data...');
    try {
      const [reviewsResponse, productsResponse] = await Promise.all([
        supabase
          .from('reviews')
          .select(`
            *,
            products (name),
            profiles (full_name, email)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('products')
          .select('id, name')
          .order('name')
      ]);

      if (reviewsResponse.error) {
        console.error('Error fetching reviews:', reviewsResponse.error);
        throw reviewsResponse.error;
      }
      
      if (productsResponse.error) {
        console.error('Error fetching products:', productsResponse.error);
        throw productsResponse.error;
      }

      console.log(`✅ Loaded ${reviewsResponse.data?.length || 0} reviews`);
      console.log(`✅ Loaded ${productsResponse.data?.length || 0} products`);

      setReviews(reviewsResponse.data || []);
      setProducts(productsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId, isApproved) => {
    console.log(`${isApproved ? 'Approving' : 'Rejecting'} review:`, reviewId);
    
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: isApproved })
        .eq('id', reviewId);

      if (error) {
        console.error('Error updating review status:', error);
        throw error;
      }

      console.log(`✅ Review ${isApproved ? 'approved' : 'rejected'} successfully`);
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, is_approved: isApproved }
          : review
      ));
      
      toast({
        title: "Success",
        description: `Review ${isApproved ? 'approved' : 'rejected'} successfully`
      });
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: "Error",
        description: "Failed to update review status",
        variant: "destructive"
      });
    }
  };

  const deleteReview = async (reviewId) => {
    console.log('Deleting review:', reviewId);
    
    if (!confirm('Are you sure you want to delete this review?')) {
      console.log('Review deletion cancelled by user');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Error deleting review:', error);
        throw error;
      }

      console.log('✅ Review deleted successfully');
      
      // Update local state
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      
      toast({
        title: "Success",
        description: "Review deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusBadge = (isApproved) => {
    if (isApproved === null || isApproved === undefined) {
      return <Badge variant="secondary">Pending</Badge>;
    }
    return isApproved ? (
      <Badge variant="secondary" className="bg-green-100 text-green-700">Approved</Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-700">Rejected</Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Reviews Management</h2>
        <div className="flex gap-2">
          <Badge variant="outline">Total: {reviews.length}</Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Approved: {reviews.filter(r => r.is_approved === true).length}
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            Pending: {reviews.filter(r => r.is_approved === null).length}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      {review.products?.name || 'Unknown Product'}
                    </CardTitle>
                    {getStatusBadge(review.is_approved)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      by {review.profiles?.full_name || 'Anonymous'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      • {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReview(review)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                      </DialogHeader>
                      {selectedReview && (
                        <div className="space-y-4">
                          <div>
                            <Label>Product</Label>
                            <p className="font-medium">{selectedReview.products?.name}</p>
                          </div>
                          <div>
                            <Label>Customer</Label>
                            <p>{selectedReview.profiles?.full_name || 'Anonymous'}</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedReview.profiles?.email}
                            </p>
                          </div>
                          <div>
                            <Label>Rating</Label>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {renderStars(selectedReview.rating)}
                              </div>
                              <span>({selectedReview.rating}/5)</span>
                            </div>
                          </div>
                          {selectedReview.title && (
                            <div>
                              <Label>Title</Label>
                              <p className="font-medium">{selectedReview.title}</p>
                            </div>
                          )}
                          <div>
                            <Label>Comment</Label>
                            <p className="text-sm whitespace-pre-wrap">
                              {selectedReview.comment || 'No comment provided'}
                            </p>
                          </div>
                          <div>
                            <Label>Date</Label>
                            <p className="text-sm">
                              {new Date(selectedReview.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  {review.is_approved !== true && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateReviewStatus(review.id, true)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {review.is_approved !== false && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateReviewStatus(review.id, false)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteReview(review.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                {review.title && (
                  <h4 className="font-medium text-sm">{review.title}</h4>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {review.comment || 'No comment provided'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No reviews found.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsManager;