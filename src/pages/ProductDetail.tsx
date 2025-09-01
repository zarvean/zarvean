
import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Heart, Share2, ShoppingBag, ArrowLeft, Star, Ruler, Package, Truck, RotateCcw } from 'lucide-react'
import { useProducts } from '@/contexts/ProductsContext'
import { useCart } from '@/contexts/CartContext'
import { toast } from '@/hooks/use-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ProductDetail = () => {
  const { id } = useParams()
  const { products } = useProducts()
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showSizeChart, setShowSizeChart] = useState(false)

  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Product not found</h1>
          <Link to="/shop">
            <Button variant="outline">Back to Shop</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive"
      })
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity
    })
  }

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this amazing ${product.name} at Zarvean!`,
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied!",
          description: "Product link has been copied to clipboard.",
        })
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast({
        title: "Share Failed",
        description: "Unable to share this product.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-container py-8">
        {/* Back Button */}
        <Link to="/shop" className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-sm overflow-hidden bg-muted cursor-pointer">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedImageIndex(selectedImageIndex)}
              />
            </div>
            {/* Thumbnail images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`aspect-square rounded-sm overflow-hidden bg-muted cursor-pointer border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                {product.isNew && <Badge>NEW</Badge>}
                {product.isSale && <Badge variant="destructive">SALE</Badge>}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-serif">RS {product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      RS {product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(24 reviews)</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 1 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium">Size</label>
                  {product.sizeChart && (
                    <Dialog open={showSizeChart} onOpenChange={setShowSizeChart}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Ruler className="h-3 w-3 mr-1" />
                          Size Chart
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Size Chart</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-2">Size</th>
                                  <th className="text-left p-2">Chest</th>
                                  <th className="text-left p-2">Waist</th>
                                  <th className="text-left p-2">Length</th>
                                  <th className="text-left p-2">Shoulder</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(product.sizeChart).map(([size, measurements]: [string, any]) => (
                                  <tr key={size} className="border-b">
                                    <td className="p-2 font-medium">{size}</td>
                                    <td className="p-2">{measurements.chest}</td>
                                    <td className="p-2">{measurements.waist}</td>
                                    <td className="p-2">{measurements.length}</td>
                                    <td className="p-2">{measurements.shoulder}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            All measurements are in inches. For best fit, measure yourself and compare with the chart.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className="aspect-square"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Color</label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => setSelectedColor(color)}
                    size="sm"
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={handleAddToCart} className="btn-hero flex-1">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Product Information Accordion */}
            <Accordion type="single" collapsible className="w-full border-t pt-8">
              <AccordionItem value="returns" className="border-b">
                <AccordionTrigger className="flex items-center gap-3 py-4 text-left hover:no-underline">
                  <RotateCcw className="h-4 w-4" />
                  Returns & Warranty
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground">
                  <div className="space-y-2">
                    <p>• 30-day return policy for unworn items</p>
                    <p>• Items must be in original condition with tags</p>
                    <p>• Free returns on orders over RS 5000</p>
                    <p>• 1-year warranty on manufacturing defects</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping" className="border-b">
                <AccordionTrigger className="flex items-center gap-3 py-4 text-left hover:no-underline">
                  <Truck className="h-4 w-4" />
                  Shipping
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground">
                  <div className="space-y-2">
                    <p className="font-medium">Free shipping order over 1500rs</p>
                    <p>We offer regular 3-5 days or express 1-2 days shipping to most addresses countrywide.</p>
                    <div className="mt-3 space-y-1">
                      <p>• Standard delivery: 3-5 business days</p>
                      <p>• Express delivery: 1-2 business days</p>
                      <p>• Same day delivery available in major cities</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="share" className="border-b-0">
                <AccordionTrigger className="flex items-center gap-3 py-4 text-left hover:no-underline">
                  <Share2 className="h-4 w-4" />
                  Share
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleShare}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-3 w-3" />
                      Share Product
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-2xl font-serif font-semibold mb-8 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products
              .filter(p => p.id !== product.id && p.category === product.category)
              .slice(0, 4)
              .map((relatedProduct) => (
                <div key={relatedProduct.id} className="product-card group">
                  <Link to={`/product/${relatedProduct.id}`}>
                    <div className="product-image rounded-sm">
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="pt-4 space-y-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {relatedProduct.category}
                      </p>
                      <h3 className="font-medium">{relatedProduct.name}</h3>
                      <p className="font-serif text-lg">RS {relatedProduct.price}</p>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProductDetail
