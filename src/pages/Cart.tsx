
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Minus, ShoppingBag, Tag, Settings } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { usePromoCodes } from '@/contexts/PromoCodesContext'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { toast } from '@/hooks/use-toast'
import PromoCodesManager from '@/components/PromoCodesManager'

const Cart = () => {
  const { items, total, updateQuantity, removeItem, itemCount, discount, appliedPromoCode, applyDiscount, removeDiscount, finalTotal } = useCart()
  const { validatePromoCode } = usePromoCodes()
  const { user } = useAuth()
  const [promoInput, setPromoInput] = useState('')
  const [showPromoManager, setShowPromoManager] = useState(false)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-container py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-2xl font-serif font-semibold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Discover our beautiful collection and find pieces that speak to you.
            </p>
            <Link to="/shop">
              <Button className="btn-hero">Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-8 text-center">
            Shopping Cart
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 border rounded-lg">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-muted flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="text-center sm:text-left">
                        <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                        <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                          {item.size && <p>Size: {item.size}</p>}
                          {item.color && <p>Color: {item.color}</p>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="text-muted-foreground hover:text-destructive self-center sm:self-start"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="font-serif text-base sm:text-lg">RS {(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-muted/50 p-6 rounded-lg h-fit space-y-6">
              <h2 className="text-xl font-serif font-semibold">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>RS {total}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromoCode})</span>
                    <span>-RS {discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free to Pakistan</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>RS {finalTotal}</span>
                </div>
              </div>

              <div className="space-y-3">
                {!appliedPromoCode ? (
                  <>
                    <Input 
                      placeholder="Enter promo code" 
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={async () => {
                          const result = await validatePromoCode(promoInput, total);
                          if (result.valid) {
                            applyDiscount(result.discount, promoInput);
                            setPromoInput('');
                            toast({ title: "Success", description: result.message });
                          } else {
                            toast({ title: "Error", description: result.message, variant: "destructive" });
                          }
                        }}
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Apply Code
                      </Button>
                      {user && (
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => setShowPromoManager(true)}
                          title="Manage Promo Codes"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={removeDiscount}
                    >
                      Remove Promo Code
                    </Button>
                    {user && (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => setShowPromoManager(true)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Promo Codes
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Link to="/checkout">
                  <Button className="btn-hero w-full">Proceed to Checkout</Button>
                </Link>
                <Link to="/shop">
                  <Button variant="outline" className="w-full">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showPromoManager && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-semibold">Manage Promo Codes</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowPromoManager(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>
              <PromoCodesManager />
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}

export default Cart
