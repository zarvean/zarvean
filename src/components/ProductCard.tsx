
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingBag, Truck } from 'lucide-react'
import { LocalProduct } from '@/contexts/ProductsContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: LocalProduct
  className?: string
  style?: React.CSSProperties
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className, style }) => {
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    })
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    }
    
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(wishlistItem)
    }
  }

  return (
    <div className={cn("group relative", className)} style={style}>
      <Link to={`/product/${product.id}`}>
        {/* Bootstrap-inspired Card */}
        <div className="bg-card border border-border rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-1 hover:border-primary/20">
          
          {/* Image Container */}
          <div className="relative overflow-hidden aspect-[4/5] bg-muted">
            <img
              src={product.images[0] || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 space-y-2">
              {product.isSale && (
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border-0 font-semibold text-xs px-2.5 py-1">
                  {product.originalPrice ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF` : 'SALE'}
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg border-0 font-semibold text-xs px-2.5 py-1">
                  NEW
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Button 
                size="icon" 
                variant="secondary" 
                className={cn(
                  "w-9 h-9 rounded-full shadow-lg bg-white/90 hover:bg-white border-0 backdrop-blur-sm transition-all duration-300",
                  inWishlist && "text-red-500 bg-red-50/90 hover:bg-red-50"
                )}
                onClick={handleWishlistToggle}
              >
                <Heart className={cn("h-4 w-4 transition-all duration-300", inWishlist && "fill-current scale-110")} />
              </Button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3">
            {/* Category and Free Shipping - Mobile responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <Badge variant="outline" className="text-xs font-medium text-muted-foreground border-muted-foreground/30 w-fit">
                {product.category}
              </Badge>
              <Badge variant="outline" className="text-xs font-medium text-emerald-600 border-emerald-200 bg-emerald-50/50 w-fit">
                <Truck className="h-3 w-3 mr-1" />
                Free Shipping
              </Badge>
            </div>
            
            {/* Product Name */}
            <h3 className="font-serif text-lg font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
            
            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.inStock ? (
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Colors Preview */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Colors:</span>
                <div className="flex gap-1">
                  {product.colors.slice(0, 3).map((color, index) => (
                    <div 
                      key={index}
                      className="w-4 h-4 rounded-full border border-border shadow-sm"
                      style={{ backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : color.toLowerCase() === 'black' ? '#000000' : color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{product.colors.length - 3}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
