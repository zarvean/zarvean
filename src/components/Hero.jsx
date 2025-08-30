import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "/lovable-uploads/def6c3e3-c1be-44a6-b8b1-f983cbf28fd2.png";

const Hero = () => {
  return (
    <section className="position-relative d-flex align-items-center justify-content-center overflow-hidden" style={{ height: '100vh' }}>
      {/* Background Image */}
      <div className="position-absolute inset-0" style={{ zIndex: '0' }}>
        <img
          src={heroImage}
          alt="Fashion collection hero"
          className="w-full h-full object-cover object-center"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div className="position-absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
      </div>

      {/* Content */}
      <div className="position-relative text-center text-white container" style={{ zIndex: '10', maxWidth: '64rem' }}>
        <div className="fade-in">
          <h1 className="hero-title mb-4 text-white">
            ZARVEAN
            <br />
            Premium Men's Collection
          </h1>
          <p className="hero-subtitle mb-5 mx-auto" style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '32rem' }}>
            Discover our exquisite collection of traditional men's wear that combines 
            authentic craftsmanship with contemporary styling for the modern gentleman.
          </p>
          <div className="d-flex flex-column flex-sm-row justify-content-center" style={{ gap: '1.5rem' }}>
            <Link to="/shop" className="text-decoration-none">
              <Button className="btn-hero position-relative overflow-hidden">
                <span className="position-relative" style={{ zIndex: '10' }}>Shop Now</span>
              </Button>
            </Link>
            <Link to="/shop?category=Formal" className="text-decoration-none">
              <Button variant="outline" className="btn-outline-enhanced">
                <span className="position-relative" style={{ zIndex: '10' }}>View Collection</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x" style={{ bottom: '2rem', animation: 'bounce 2s infinite' }}>
        <div className="border border-white rounded-pill d-flex justify-content-center" style={{ width: '1.5rem', height: '2.5rem', borderColor: 'rgba(255, 255, 255, 0.5)', borderWidth: '2px' }}>
          <div className="bg-white rounded-pill" style={{ width: '0.25rem', height: '0.75rem', marginTop: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;