import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Percent, Calendar, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const PromoCodesManager = () => {
  console.log('PromoCodesManager component rendered');
  
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    minimum_order_amount: '',
    usage_limit: '',
    starts_at: '',
    expires_at: '',
    is_active: true
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    console.log('Fetching promo codes...');
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching promo codes:', error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} promo codes`);
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      toast({
        title: "Error",
        description: "Failed to load promo codes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    console.log('Resetting promo code form');
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      minimum_order_amount: '',
      usage_limit: '',
      starts_at: '',
      expires_at: '',
      is_active: true
    });
    setEditingPromo(null);
  };

  const handleEdit = (promo) => {
    console.log('Editing promo code:', promo.code);
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      description: promo.description || '',
      discount_type: promo.discount_type,
      discount_value: promo.discount_value.toString(),
      minimum_order_amount: promo.minimum_order_amount?.toString() || '',
      usage_limit: promo.usage_limit?.toString() || '',
      starts_at: promo.starts_at ? new Date(promo.starts_at).toISOString().slice(0, 16) : '',
      expires_at: promo.expires_at ? new Date(promo.expires_at).toISOString().slice(0, 16) : '',
      is_active: promo.is_active
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const promoData = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      minimum_order_amount: formData.minimum_order_amount ? parseFloat(formData.minimum_order_amount) : null,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
      expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
      is_active: formData.is_active
    };

    console.log('Submitting promo code data:', {
      ...promoData,
      action: editingPromo ? 'UPDATE' : 'CREATE',
      promoId: editingPromo?.id
    });

    try {
      if (editingPromo) {
        console.log('Updating promo code:', editingPromo.id);
        const { error } = await supabase
          .from('promo_codes')
          .update(promoData)
          .eq('id', editingPromo.id);
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('✅ Promo code updated successfully');
        toast({
          title: "Success",
          description: `Promo code "${formData.code}" updated successfully`
        });
      } else {
        console.log('Creating new promo code');
        const { error } = await supabase
          .from('promo_codes')
          .insert([promoData]);
        
        if (error) {
          console.error('Create error:', error);
          throw error;
        }
        
        console.log('✅ Promo code created successfully');
        toast({
          title: "Success",
          description: `Promo code "${formData.code}" created successfully`
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchPromoCodes();
    } catch (error) {
      console.error('Error saving promo code:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingPromo ? 'update' : 'create'} promo code: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (promoId, promoCode) => {
    console.log('Delete requested for promo code:', promoId, promoCode);
    
    if (!confirm(`Are you sure you want to delete promo code "${promoCode}"?`)) {
      console.log('Delete cancelled by user');
      return;
    }
    
    console.log('Deleting promo code:', promoId);
    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', promoId);
      
      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      console.log('✅ Promo code deleted successfully');
      toast({
        title: "Success",
        description: `Promo code "${promoCode}" deleted successfully`
      });
      
      fetchPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
      toast({
        title: "Error",
        description: `Failed to delete promo code: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const toggleActiveStatus = async (promoId, currentStatus) => {
    console.log('Toggling active status for promo:', promoId, 'from:', currentStatus, 'to:', !currentStatus);
    
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !currentStatus })
        .eq('id', promoId);
      
      if (error) {
        console.error('Toggle status error:', error);
        throw error;
      }
      
      console.log('✅ Promo code status updated successfully');
      toast({
        title: "Success",
        description: `Promo code ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });
      
      fetchPromoCodes();
    } catch (error) {
      console.error('Error toggling promo code status:', error);
      toast({
        title: "Error",
        description: "Failed to update promo code status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (promo) => {
    const now = new Date();
    const expiresAt = promo.expires_at ? new Date(promo.expires_at) : null;
    
    if (!promo.is_active) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Inactive</Badge>;
    }
    
    if (expiresAt && expiresAt < now) {
      return <Badge variant="secondary" className="bg-red-100 text-red-700">Expired</Badge>;
    }
    
    return <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>;
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
        <h2 className="text-2xl font-semibold">Promo Codes Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? 'Edit Promo Code' : 'Create New Promo Code'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Promo Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="SAVE20"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount_type">Discount Type *</Label>
                  <Select 
                    value={formData.discount_type} 
                    onValueChange={(value) => setFormData({...formData, discount_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="20% off on all products"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_value">Discount Value *</Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                    placeholder={formData.discount_type === 'percentage' ? '20' : '100'}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minimum_order_amount">Minimum Order Amount</Label>
                  <Input
                    id="minimum_order_amount"
                    type="number"
                    step="0.01"
                    value={formData.minimum_order_amount}
                    onChange={(e) => setFormData({...formData, minimum_order_amount: e.target.value})}
                    placeholder="1000"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usage_limit">Usage Limit</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                    placeholder="100"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="starts_at">Start Date</Label>
                  <Input
                    id="starts_at"
                    type="datetime-local"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({...formData, starts_at: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="expires_at">Expiry Date</Label>
                  <Input
                    id="expires_at"
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPromo ? 'Update' : 'Create'} Promo Code
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {promoCodes.map((promo) => (
          <Card key={promo.id} className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-mono">{promo.code}</CardTitle>
                    {getStatusBadge(promo)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {promo.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(promo)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActiveStatus(promo.id, promo.is_active)}
                  >
                    {promo.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(promo.id, promo.code)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {promo.discount_type === 'percentage' 
                      ? `${promo.discount_value}%` 
                      : `PKR ${promo.discount_value}`
                    }
                  </span>
                </div>
                
                {promo.minimum_order_amount && (
                  <div className="text-muted-foreground">
                    Min Order: PKR {promo.minimum_order_amount}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Used: {promo.used_count || 0}
                    {promo.usage_limit && ` / ${promo.usage_limit}`}
                  </span>
                </div>
                
                {promo.expires_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Expires: {new Date(promo.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {promoCodes.length === 0 && (
        <div className="text-center py-12">
          <Percent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No promo codes found. Create your first promo code to get started.</p>
        </div>
      )}
    </div>
  );
};

export default PromoCodesManager;