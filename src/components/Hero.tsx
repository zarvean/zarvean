
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "/lovable-uploads/def6c3e3-c1be-44a6-b8b1-f983cbf28fd2.png";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fashion collection hero"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-container">
        <div className="fade-in">
          <h1 className="hero-title mb-6 text-white">
            ZARVEAN
            <br />
            Premium Men's Collection
          </h1>
          <p className="hero-subtitle mb-8 text-white/90 max-w-2xl mx-auto">
            Discover our exquisite collection of traditional men's wear that combines 
            authentic craftsmanship with contemporary styling for the modern gentleman.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/shop" className="group">
              <Button className="btn-hero-animated bg-white text-black hover:bg-primary hover:text-white transform hover:scale-105 hover:shadow-lg transition-all duration-700 relative overflow-hidden">
                <span className="relative z-10">Shop Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              </Button>
            </Link>
            <Link to="/shop?category=Formal" className="group">
              <Button variant="outline" className="btn-collection-animated border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary transform hover:scale-105 hover:shadow-lg transition-all duration-700 relative overflow-hidden">
                <span className="relative z-10">View Collection</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right"></div>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
