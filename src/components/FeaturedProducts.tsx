
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useProducts } from "@/contexts/ProductsContext";
import ProductCard from "./ProductCard";
import { useRef, useEffect } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProducts = () => {
  const { products, loading } = useProducts();
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

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          
          <div className="flex gap-8 mb-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72 space-y-3">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Skeleton className="h-12 w-48 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4 tracking-tight">
            Featured Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked premium men's wear that showcase traditional artistry and modern comfort.
          </p>
        </div>

        {/* Infinite Auto-Scroll Carousel */}
        <div className="overflow-hidden mb-16" ref={emblaRef}>
          <div className="flex gap-8">
            {[...products, ...products, ...products].map((product, index) => (
              <div 
                key={`${product.id}-${index}`} 
                className="slide-up flex-shrink-0 w-72"
                style={{ animationDelay: `${(index % 4) * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button - Fixed visibility */}
        <div className="text-center">
          <Link to="/shop">
            <Button 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-8 py-4 text-sm font-medium tracking-wide uppercase"
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
