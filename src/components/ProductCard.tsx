
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
    <div className={cn("product-card group relative bg-white dark:bg-card rounded-lg", className)} style={style}>
      <Link to={`/product/${product.id}`}>
        <div className="product-image rounded-lg relative overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* 40% OFF Badge - Always visible */}
            <div className="relative">
              <Badge className="bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md border-0 px-3 py-1 font-bold text-sm">
                40% OFF
              </Badge>
            </div>
            
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground shadow-md">NEW</Badge>
            )}
            {product.isSale && (
              <Badge variant="destructive" className="shadow-md">SALE</Badge>
            )}
            <Badge variant="secondary" className="bg-white/95 text-emerald-700 border-emerald-200 shadow-md">
              <Truck className="h-3 w-3 mr-1" />
              Free Delivery
            </Badge>
          </div>

          {/* Professional Quick Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button 
              size="icon" 
              variant="secondary" 
              className={cn("rounded-full shadow-md bg-white/90 hover:bg-white border-0 backdrop-blur-sm", inWishlist && "text-red-500 bg-red-50")}
              onClick={handleWishlistToggle}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </Button>
          </div>

        </div>

        <div className="pt-4 space-y-3 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors duration-300 font-medium">
            {product.category}
          </p>
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-300 font-serif text-lg leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <p className="font-serif text-xl font-semibold group-hover:text-primary transition-colors duration-300">
              RS {product.price}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-muted-foreground line-through opacity-60">
                RS {product.originalPrice}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
