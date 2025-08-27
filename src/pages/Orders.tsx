import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, Calendar, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Orders = () => {
  const { user, loading } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();

  // Add debugging
  React.useEffect(() => {
    console.log('Orders page - User:', user);
    console.log('Orders page - Loading:', loading);
  }, [user, loading]);

  // Redirect to auth if not logged in (but wait for loading to complete)
  React.useEffect(() => {
    if (!loading && !user) {
      console.log('Orders page - Redirecting to auth because no user');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-container py-16">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold mb-4 text-gradient">
              Order History
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Track and manage all your orders in one place
            </p>
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-16 lg:py-24">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <Package className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-medium mb-4">No orders yet</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Start exploring our collection and place your first order
                </p>
                <Button 
                  onClick={() => navigate('/shop')} 
                  className="btn-hero text-lg px-8 py-6 h-auto"
                >
                  Start Shopping
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 lg:space-y-8">
              {orders.map((order) => (
                <Card 
                  key={order.id} 
                  className="overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10 border-b">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl lg:text-2xl mb-3 font-serif">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium">{formatDate(order.orderDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row lg:flex-col lg:text-right items-center lg:items-end gap-4 lg:gap-2">
                        <Badge className={`${getStatusColor(order.status)} border font-medium px-3 py-1`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <p className="text-2xl font-serif font-bold text-primary">
                          ₹{order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 lg:p-8">
                    <div className="space-y-6 lg:space-y-8">
                      {/* Order Items */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          Items Ordered
                        </h4>
                        <div className="grid gap-4">
                          {order.items.map((item, index) => (
                            <div 
                              key={index} 
                              className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden bg-background shadow-sm">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-lg mb-1 truncate">{item.name}</h5>
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                                  {item.size && (
                                    <span className="px-2 py-1 bg-background rounded">Size: {item.size}</span>
                                  )}
                                  {item.color && (
                                    <span className="px-2 py-1 bg-background rounded">Color: {item.color}</span>
                                  )}
                                  <span className="px-2 py-1 bg-background rounded">Qty: {item.quantity}</span>
                                </div>
                                <p className="font-serif text-lg font-medium text-primary">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping and Payment Information */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pt-6 border-t">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Shipping Address
                          </h4>
                          <div className="p-4 rounded-lg bg-muted/30">
                            <p className="font-medium text-base mb-1">
                              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                            </p>
                            <p className="text-muted-foreground">
                              {order.shippingAddress.address}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            <Truck className="h-5 w-5 text-primary" />
                            Delivery Details
                          </h4>
                          <div className="p-4 rounded-lg bg-muted/30">
                            <p className="text-base mb-2">
                              <span className="font-medium">Payment:</span> {order.paymentMethod === 'card' ? 'Prepaid' : 'Cash on Delivery'}
                            </p>
                            {order.estimatedDelivery && (
                              <p className="text-base">
                                <span className="font-medium">Est. Delivery:</span> {formatDate(order.estimatedDelivery)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="pt-6 border-t">
                        <div className="max-w-md ml-auto space-y-3">
                          <div className="flex justify-between text-base">
                            <span>Subtotal:</span>
                            <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-base">
                            <span>Shipping:</span>
                            <span className="text-emerald-600 font-medium">Free</span>
                          </div>
                          <div className="flex justify-between text-xl font-serif font-bold pt-2 border-t">
                            <span>Total:</span>
                            <span className="text-primary">₹{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;