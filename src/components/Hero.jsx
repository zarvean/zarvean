import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "/lovable-uploads/def6c3e3-c1be-44a6-b8b1-f983cbf28fd2.png";

const Hero = () => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fashion collection hero"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
      </div>

      {/* Content */}
      <div className="relative text-center text-white max-w-4xl mx-auto px-4 z-10">
        <div className="fade-in">
          <h1 className="hero-title mb-4 text-white">
            ZARVEAN
            <br />
            Premium Men's Collection
          </h1>
          <p className="hero-subtitle mb-8 mx-auto max-w-2xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Discover our exquisite collection of traditional men's wear that combines 
            authentic craftsmanship with contemporary styling for the modern gentleman.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/shop" className="text-decoration-none">
              <button className="btn-hero relative overflow-hidden">
                <span className="relative z-10">Shop Now</span>
              </button>
            </Link>
            <Link to="/shop?category=Formal" className="text-decoration-none">
              <button className="btn-outline-enhanced">
                <span className="relative z-10">View Collection</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" style={{ animation: 'bounce 2s infinite' }}>
        <div className="border-2 border-white border-opacity-50 rounded-full w-6 h-10 flex justify-center">
          <div className="bg-white bg-opacity-50 rounded-full w-1 h-3 mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;