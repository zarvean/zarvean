import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Percent, Tag } from 'lucide-react';
import { usePromoCodes, PromoCode } from '@/contexts/PromoCodesContext';
import { useAlert } from '@/contexts/AlertContext';
import { toast } from '@/hooks/use-toast';

const PromoCodesManager = () => {
  const { promoCodes, addPromoCode, updatePromoCode, deletePromoCode } = usePromoCodes();
  const { showDeleteConfirm } = useAlert();
  
  const [promoDialog, setPromoDialog] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [promoForm, setPromoForm] = useState({
    code: '',
    discount: 0,
    description: '',
    minOrderAmount: 0,
    isActive: true,
    expiryDate: ''
  });

  const openPromoDialog = (promo?: PromoCode) => {
    if (promo) {
      setEditingPromo(promo);
      setPromoForm({
        code: promo.code,
        discount: promo.discount,
        description: promo.description,
        minOrderAmount: promo.minOrderAmount || 0,
        isActive: promo.isActive,
        expiryDate: promo.expiryDate || ''
      });
    } else {
      setEditingPromo(null);
      setPromoForm({
        code: '',
        discount: 0,
        description: '',
        minOrderAmount: 0,
        isActive: true,
        expiryDate: ''
      });
    }
    setPromoDialog(true);
  };

  const handleSubmitPromo = () => {
    if (!promoForm.code.trim()) {
      toast({
        title: "Error",
        description: "Promo code is required",
        variant: "destructive"
      });
      return;
    }

    if (promoForm.discount <= 0 || promoForm.discount > 100) {
      toast({
        title: "Error",
        description: "Discount must be between 1 and 100",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate codes (excluding current editing)
    const isDuplicate = promoCodes.some(p => 
      p.code.toLowerCase() === promoForm.code.toLowerCase() && 
      p.id !== editingPromo?.id
    );

    if (isDuplicate) {
      toast({
        title: "Error",
        description: "This promo code already exists",
        variant: "destructive"
      });
      return;
    }

    if (editingPromo) {
      updatePromoCode(editingPromo.id, promoForm);
      toast({
        title: "Success",
        description: "Promo code updated successfully"
      });
    } else {
      addPromoCode(promoForm);
      toast({
        title: "Success",
        description: "Promo code created successfully"
      });
    }
    
    setPromoDialog(false);
  };

  const handleDeletePromo = (id: string, code: string) => {
    showDeleteConfirm({
      title: "Delete Promo Code",
      description: "Are you sure you want to delete this promo code? This action cannot be undone.",
      itemName: code,
      onConfirm: () => {
        deletePromoCode(id);
        toast({
          title: "Success",
          description: "Promo code deleted successfully"
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Promo Codes Management
          </CardTitle>
          <Dialog open={promoDialog} onOpenChange={setPromoDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => openPromoDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Promo Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPromo ? 'Edit Promo Code' : 'Create New Promo Code'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="promo-code">Promo Code</Label>
                  <Input
                    id="promo-code"
                    value={promoForm.code}
                    onChange={(e) => setPromoForm(prev => ({ 
                      ...prev, 
                      code: e.target.value.toUpperCase() 
                    }))}
                    placeholder="e.g., SAVE20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="discount">Discount Percentage</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="1"
                    max="100"
                    value={promoForm.discount}
                    onChange={(e) => setPromoForm(prev => ({ 
                      ...prev, 
                      discount: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={promoForm.description}
                    onChange={(e) => setPromoForm(prev => ({ 
                      ...prev, 
                      description: e.target.value 
                    }))}
                    placeholder="Brief description of the offer..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="min-order">Minimum Order Amount (RS)</Label>
                  <Input
                    id="min-order"
                    type="number"
                    min="0"
                    value={promoForm.minOrderAmount}
                    onChange={(e) => setPromoForm(prev => ({ 
                      ...prev, 
                      minOrderAmount: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
                  <Input
                    id="expiry-date"
                    type="date"
                    value={promoForm.expiryDate}
                    onChange={(e) => setPromoForm(prev => ({ 
                      ...prev, 
                      expiryDate: e.target.value 
                    }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-active"
                    checked={promoForm.isActive}
                    onCheckedChange={(checked) => setPromoForm(prev => ({ 
                      ...prev, 
                      isActive: checked 
                    }))}
                  />
                  <Label htmlFor="is-active">Active</Label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setPromoDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitPromo}>
                    {editingPromo ? 'Update' : 'Create'} Promo Code
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {promoCodes.map((promo) => (
            <Card key={promo.id} className="border">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-mono font-bold text-lg">{promo.code}</h4>
                      <Badge variant={promo.isActive ? "default" : "secondary"}>
                        {promo.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {promo.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openPromoDialog(promo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePromo(promo.id, promo.code)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      Discount
                    </span>
                    <p className="text-muted-foreground">{promo.discount}%</p>
                  </div>
                  <div>
                    <span className="font-medium">Min Order</span>
                    <p className="text-muted-foreground">
                      {promo.minOrderAmount ? `RS ${promo.minOrderAmount}` : 'No minimum'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Expires</span>
                    <p className="text-muted-foreground">
                      {promo.expiryDate ? new Date(promo.expiryDate).toLocaleDateString() : 'No expiry'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Status</span>
                    <p className={promo.isActive ? "text-green-600" : "text-red-600"}>
                      {promo.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {promoCodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No promo codes created yet. Click "Add Promo Code" to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromoCodesManager;