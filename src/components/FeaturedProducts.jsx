import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useProducts } from "@/contexts/ProductsContext";
import ProductCard from "./ProductCard";
import { useRef, useEffect } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

const FeaturedProducts = () => {
  const { products } = useProducts();
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      containScroll: 'trimSnaps',
      dragFree: true
    },
    [AutoScroll({ 
      speed: 0.5,
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })]
  );

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-5 fade-in">
          <h2 className="mb-3" style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display, serif', fontWeight: '600', letterSpacing: '-0.025em' }}>
            Featured Collection
          </h2>
          <p className="text-muted mx-auto" style={{ fontSize: '1.125rem', maxWidth: '32rem' }}>
            Handpicked premium shalwar kameez that showcase traditional artistry and modern comfort.
          </p>
        </div>

        {/* Infinite Auto-Scroll Carousel */}
        <div className="overflow-hidden mb-5" ref={emblaRef}>
          <div className="d-flex" style={{ gap: '2rem' }}>
            {[...products, ...products, ...products].map((product, index) => (
              <div 
                key={`${product.id}-${index}`} 
                className="slide-up flex-shrink-0"
                style={{ 
                  animationDelay: `${(index % 4) * 100}ms`,
                  width: '18rem',
                  flexShrink: 0 
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button - Fixed visibility */}
        <div className="text-center">
          <Link to="/shop" className="text-decoration-none">
            <Button 
              variant="outline" 
              className="btn-outline-enhanced px-4 py-3"
              style={{ 
                border: '2px solid var(--primary)',
                color: 'var(--primary)',
                fontSize: '0.875rem',
                fontWeight: '500',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease'
              }}
            >
              View Collection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;