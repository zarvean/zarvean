import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, Order } from '@/contexts/OrdersContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Truck, Calendar, MapPin, DollarSign, ShoppingBag, Clock, CheckCircle, Edit } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AdminOrders = () => {
  const { user, loading } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const navigate = useNavigate();
  
  // States for filters and editing
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'yearly' | 'lifetime'>('lifetime');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  
  // Editable metrics state
  const [editableMetrics, setEditableMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalEarned: 0
  });

  // Check if user is admin (matching the main admin panel authentication)
  const isAdmin = user?.email === 'hehe@me.pk';

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && user && !isAdmin) {
      navigate('/orders'); // Redirect non-admin users to regular orders page
    }
  }, [user, loading, navigate, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-container py-16">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  // Filter orders based on time and status
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Time filter
    if (timeFilter !== 'lifetime') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeFilter) {
        case 'weekly':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'monthly':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'yearly':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    return filtered;
  }, [orders, timeFilter, statusFilter]);

  // Calculate metrics from filtered orders
  const metrics = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;
    const completedOrders = filteredOrders.filter(order => order.status === 'delivered').length;
    const totalEarned = filteredOrders.reduce((sum, order) => sum + order.total, 0);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalEarned
    };
  }, [filteredOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'shipped': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
  };

  const updateMetric = (metric: keyof typeof editableMetrics, value: number) => {
    setEditableMetrics(prev => ({
      ...prev,
      [metric]: value
    }));
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    editable = false, 
    onEdit 
  }: { 
    title: string; 
    value: number; 
    icon: any; 
    editable?: boolean; 
    onEdit?: (value: number) => void;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            {title.includes("Amount") ? `RS ${value.toFixed(2)}` : value}
          </div>
          {editable && onEdit && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit {title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    type="number"
                    defaultValue={value}
                    onChange={(e) => onEdit(Number(e.target.value))}
                    placeholder={`Enter ${title.toLowerCase()}`}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-container py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-8 text-center">
            Admin - Order Management
          </h1>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="text-sm font-medium mb-2 block">Time Period</label>
              <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Order Status</label>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Orders"
              value={editableMetrics.totalOrders || metrics.totalOrders}
              icon={ShoppingBag}
              editable={true}
              onEdit={(value) => updateMetric('totalOrders', value)}
            />
            <MetricCard
              title="Pending Orders"
              value={editableMetrics.pendingOrders || metrics.pendingOrders}
              icon={Clock}
              editable={true}
              onEdit={(value) => updateMetric('pendingOrders', value)}
            />
            <MetricCard
              title="Completed Orders"
              value={editableMetrics.completedOrders || metrics.completedOrders}
              icon={CheckCircle}
              editable={true}
              onEdit={(value) => updateMetric('completedOrders', value)}
            />
            <MetricCard
              title="Total Amount Earned"
              value={editableMetrics.totalEarned || metrics.totalEarned}
              icon={DollarSign}
              editable={true}
              onEdit={(value) => updateMetric('totalEarned', value)}
            />
          </div>

          {/* Orders List */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Orders ({filteredOrders.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({filteredOrders.filter(o => o.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({filteredOrders.filter(o => o.status === 'processing').length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({filteredOrders.filter(o => o.status === 'delivered').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6 mt-6">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders found for the selected filters.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg mb-2">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(order.orderDate)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {order.shippingAddress.city}, {order.shippingAddress.state}
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                              <Select
                                value={order.status}
                                onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <p className="text-lg font-semibold">RS {order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {/* Order Items */}
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex gap-3">
                                <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">
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

                          {/* Customer & Order Info */}
                          <div className="pt-4 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Customer</h4>
                                <p className="text-sm text-muted-foreground">
                                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                                  {order.shippingAddress.email}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Shipping Address</h4>
                                <p className="text-sm text-muted-foreground">
                                  {order.shippingAddress.address}<br />
                                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Payment & Delivery</h4>
                                <p className="text-sm text-muted-foreground">
                                  Payment: {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
                                </p>
                                {order.estimatedDelivery && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                    <Truck className="h-4 w-4" />
                                    Est. Delivery: {formatDate(order.estimatedDelivery)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Other tab contents would filter orders by status */}
            {['pending', 'processing', 'completed'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-6 mt-6">
                {filteredOrders.filter(order => 
                  status === 'completed' ? order.status === 'delivered' : order.status === status
                ).map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    {/* Same order card content as above */}
                    <CardHeader className="bg-muted/50">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <Select
                            value={order.status}
                            onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminOrders;
