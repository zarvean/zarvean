
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard, Truck, Shield, Banknote, Upload } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useOrders } from '@/contexts/OrdersContext'
import { toast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  paymentMethod: z.enum(['online', 'cod'], { message: 'Payment method is required' }),
  paymentProof: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === 'online') {
    return data.paymentProof;
  }
  return true;
}, {
  message: 'Payment proof is required for online payment',
  path: ['paymentProof']
})

type CheckoutForm = z.infer<typeof checkoutSchema>

const Checkout = () => {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const { addOrder } = useOrders()
  const navigate = useNavigate()
  const [paymentProof, setPaymentProof] = useState<string>('')
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      paymentMethod: 'online'
    }
  })

  const paymentMethod = watch('paymentMethod')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPaymentProof(result)
        setValue('paymentProof', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: CheckoutForm) => {
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create order
      const subtotal = total;
      const finalTotal = subtotal;
      
      const order = addOrder({
        items: [...items],
        total: finalTotal,
        subtotal: subtotal,
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        paymentMethod: data.paymentMethod,
      });
      
      clearCart()
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${order.id.slice(-8).toUpperCase()} has been placed. You will receive a confirmation email shortly.`
      })
      navigate('/order-success')
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-container py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-8 text-center">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div className="space-y-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        className={errors.firstName ? 'border-destructive' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        className={errors.lastName ? 'border-destructive' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...register('city')}
                        className={errors.city ? 'border-destructive' : ''}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        {...register('state')}
                        className={errors.state ? 'border-destructive' : ''}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        {...register('zipCode')}
                        className={errors.zipCode ? 'border-destructive' : ''}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Payment Information</h2>
                  
                  {/* Payment Method Selection */}
                  <div>
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <input
                          type="radio"
                          value="online"
                          id="online"
                          {...register('paymentMethod')}
                          className="sr-only"
                        />
                        <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer w-full">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-primary bg-primary' : 'border-border'}`}>
                            {paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                          </div>
                          <CreditCard className="h-4 w-4" />
                          Online Payment
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <input
                          type="radio"
                          value="cod"
                          id="cod"
                          {...register('paymentMethod')}
                          className="sr-only"
                        />
                        <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer w-full">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary bg-primary' : 'border-border'}`}>
                            {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                          </div>
                          <Banknote className="h-4 w-4" />
                          Cash on Delivery
                        </Label>
                      </div>
                    </div>
                    {errors.paymentMethod && (
                      <p className="text-sm text-destructive mt-1">{errors.paymentMethod.message}</p>
                    )}
                  </div>

                  {/* Online Payment Details - Only show when online payment is selected */}
                  {paymentMethod === 'online' && (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-medium">JazzCash Account Details</h3>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p><strong>Account Number:</strong> 03298892016</p>
                          <p><strong>Account Name:</strong> Azhar Ali</p>
                          <p><strong>Amount:</strong> RS {total.toFixed(0)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="paymentProof">Upload Payment Screenshot</Label>
                        <div className="space-y-2">
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                            <input
                              type="file"
                              id="paymentProof"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <Label 
                              htmlFor="paymentProof" 
                              className="cursor-pointer flex flex-col items-center gap-2"
                            >
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Click to upload payment screenshot
                              </span>
                            </Label>
                          </div>
                          {paymentProof && (
                            <div className="mt-2">
                              <img 
                                src={paymentProof} 
                                alt="Payment proof" 
                                className="max-w-full h-32 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                          {errors.paymentProof && (
                            <p className="text-sm text-destructive mt-1">{errors.paymentProof.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery Info */}
                  {paymentMethod === 'cod' && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Banknote className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">Cash on Delivery</h3>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>Pay with cash when your order is delivered. Our delivery partner will collect the payment at your doorstep.</p>
                        <p>You must pay 200 RS as advance for cash on delivery services (it would be adjusted from your order amount, no worries)</p>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="btn-hero w-full">
                  {paymentMethod === 'online' ? (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Complete Payment
                    </>
                  ) : (
                    <>
                      <Banknote className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `Color: ${item.color}`}
                          {(item.size || item.color) && ' • '}
                          Qty: {item.quantity}
                        </p>
                        <p className="font-serif">RS {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>RS {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free to Pakistan</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>RS {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">All over Pakistan on every order</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">Your payment info is safe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Checkout
