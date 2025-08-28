import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Heart, ShoppingBag, Truck } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'

const ProductCard = ({ product, className = "", style = {} }) => {
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    })
  }

  const handleWishlistToggle = (e) => {
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
    <>
      <div className={`product-card position-relative bg-white rounded ${className}`} style={style}>
        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
          <div className="product-image rounded position-relative overflow-hidden shadow-sm">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-100 h-100 object-fit-cover product-img"
              style={{ height: '300px' }}
            />
            
            {/* Enhanced Overlay */}
            <div className="product-overlay position-absolute top-0 start-0 w-100 h-100"></div>
            
            {/* Badges */}
            <div className="position-absolute top-0 start-0 d-flex flex-column m-3" style={{ gap: '0.5rem' }}>
              {/* 40% OFF Badge - Always visible */}
              <div className="position-relative">
                <span className="badge bg-danger text-white shadow fw-bold px-2 py-1">
                  40% OFF
                </span>
              </div>
              
              {product.isNew && (
                <span className="badge bg-primary text-white shadow">NEW</span>
              )}
              {product.isSale && (
                <span className="badge bg-warning text-dark shadow">SALE</span>
              )}
              <span className="badge text-success border border-success shadow" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <Truck style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                Free Delivery
              </span>
            </div>

            {/* Professional Quick Actions */}
            <div className="product-actions position-absolute top-0 end-0 m-3">
              <Button 
                size="icon" 
                variant="secondary" 
                className={`rounded-circle shadow btn-wishlist ${inWishlist ? 'active' : ''}`}
                onClick={handleWishlistToggle}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  border: 'none',
                  width: '2.5rem',
                  height: '2.5rem'
                }}
              >
                <Heart 
                  style={{ 
                    width: '1rem', 
                    height: '1rem',
                    fill: inWishlist ? 'currentColor' : 'none'
                  }} 
                  className={inWishlist ? 'text-danger' : ''} 
                />
              </Button>
            </div>
          </div>

          <div className="pt-3" style={{ gap: '0.75rem' }}>
            <p className="text-muted text-uppercase fw-medium product-category" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              {product.category}
            </p>
            <h3 className="font-serif fw-medium product-title" style={{ fontSize: '1.125rem', lineHeight: '1.4', marginBottom: '0.75rem', color: 'inherit' }}>
              {product.name}
            </h3>
            <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
              <p className="font-serif fw-semibold product-price mb-0" style={{ fontSize: '1.25rem', color: 'inherit' }}>
                RS {product.price}
              </p>
              {product.originalPrice && (
                <p className="text-muted text-decoration-line-through mb-0" style={{ fontSize: '0.875rem', opacity: '0.6' }}>
                  RS {product.originalPrice}
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>

      <style jsx>{`
        .product-card {
          transition: all 0.5s ease;
          cursor: pointer;
        }
        
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        }
        
        .product-img {
          transition: all 0.7s ease;
        }
        
        .product-card:hover .product-img {
          transform: scale(1.1);
          filter: brightness(1.1);
        }
        
        .product-overlay {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent);
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .product-card:hover .product-overlay {
          opacity: 1;
        }
        
        .product-actions {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .product-card:hover .product-actions {
          opacity: 1;
        }
        
        .btn-wishlist:hover {
          background-color: white !important;
          color: #dc3545 !important;
        }
        
        .btn-wishlist.active {
          color: #dc3545 !important;
          background-color: rgba(220, 53, 69, 0.1) !important;
        }
        
        .product-category {
          transition: color 0.3s ease;
        }
        
        .product-card:hover .product-category {
          color: var(--color-primary) !important;
        }
        
        .product-title {
          transition: color 0.3s ease;
        }
        
        .product-card:hover .product-title {
          color: var(--color-primary) !important;
        }
        
        .product-price {
          transition: color 0.3s ease;
        }
        
        .product-card:hover .product-price {
          color: var(--color-primary) !important;
        }
        
        .product-card .pt-3 > * {
          transition: transform 0.3s ease;
        }
        
        .product-card:hover .pt-3 > * {
          transform: translateY(0);
        }
      `}</style>
    </>
  )
}

export default ProductCard