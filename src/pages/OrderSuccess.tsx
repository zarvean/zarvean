
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Mail } from 'lucide-react'

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Order Number</span>
                <span className="font-mono">#ZAR-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Estimated Delivery</span>
                <span>3-5 business days</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <Mail className="h-8 w-8 text-muted-foreground" />
              <div className="text-left">
                <h3 className="font-medium">Confirmation Email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent you an email with order details
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <Package className="h-8 w-8 text-muted-foreground" />
              <div className="text-left">
                <h3 className="font-medium">Order Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track your package once it ships
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button className="btn-hero">Continue Shopping</Button>
            </Link>
            <Link to="/orders">
              <Button variant="outline">View Order History</Button>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-secondary/50 rounded-lg">
            <h2 className="text-xl font-serif font-semibold mb-4">What's Next?</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• You'll receive a shipping confirmation with tracking information</p>
              <p>• Your items will be carefully packaged and shipped within 1-2 business days</p>
              <p>• If you have any questions, feel free to contact our customer service team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
