import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import heroImage from "/lovable-uploads/def6c3e3-c1be-44a6-b8b1-f983cbf28fd2.png";

const Hero = () => {
  return (
    <section className="hero-section position-relative d-flex align-items-center justify-content-center overflow-hidden" style={{ height: '100vh' }}>
      {/* Background Image */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
        <img
          src={heroImage}
          alt="Fashion collection hero"
          className="w-100 h-100 object-fit-cover"
          style={{ objectPosition: 'center' }}
        />
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
      </div>

      {/* Content */}
      <div className="position-relative text-center text-white mx-auto px-container" style={{ zIndex: 10, maxWidth: '64rem' }}>
        <div className="fade-in">
          <h1 className="hero-title mb-4 text-white font-serif">
            ZARVEAN
            <br />
            Premium Men's Collection
          </h1>
          <p className="hero-subtitle mb-5 mx-auto" style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '32rem', fontSize: '1.25rem' }}>
            Discover our exquisite collection of traditional men's wear that combines 
            authentic craftsmanship with contemporary styling for the modern gentleman.
          </p>
          <div className="d-flex flex-column flex-sm-row justify-content-center" style={{ gap: '1.5rem' }}>
            <Link to="/shop" className="text-decoration-none group">
              <Button className="btn-hero position-relative overflow-hidden" style={{ 
                backgroundColor: 'white', 
                color: 'black', 
                border: 'none',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '500',
                borderRadius: '8px',
                transition: 'all 0.7s ease',
                transform: 'scale(1)'
              }}>
                <span className="position-relative" style={{ zIndex: 10 }}>Shop Now</span>
              </Button>
            </Link>
            <Link to="/shop?category=Formal" className="text-decoration-none group">
              <Button className="btn btn-outline-light position-relative overflow-hidden" style={{ 
                borderWidth: '2px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '500',
                borderRadius: '8px',
                transition: 'all 0.7s ease',
                transform: 'scale(1)',
                backgroundColor: 'transparent'
              }}>
                <span className="position-relative" style={{ zIndex: 10 }}>View Collection</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x" style={{ bottom: '2rem', animation: 'bounce 2s infinite' }}>
        <div className="border border-2 rounded-pill d-flex justify-content-center" style={{ 
          width: '1.5rem', 
          height: '2.5rem', 
          borderColor: 'rgba(255, 255, 255, 0.5)' 
        }}>
          <div className="bg-white rounded-pill" style={{ 
            width: '0.25rem', 
            height: '0.5rem', 
            marginTop: '0.5rem',
            animation: 'scrollIndicator 2s ease-in-out infinite'
          }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40%, 43% {
            transform: translateX(-50%) translateY(-30px);
          }
          70% {
            transform: translateX(-50%) translateY(-15px);
          }
          90% {
            transform: translateX(-50%) translateY(-4px);
          }
        }
        
        @keyframes scrollIndicator {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(8px);
          }
        }
        
        .hero-title {
          font-size: 4rem;
          font-weight: 700;
          line-height: 1.2;
        }
        
        .group:hover .btn-hero {
          background-color: var(--color-primary) !important;
          color: white !important;
          transform: scale(1.05) !important;
          box-shadow: var(--shadow-lg) !important;
        }
        
        .group:hover .btn-outline-light {
          background-color: white !important;
          color: var(--color-primary) !important;
          transform: scale(1.05) !important;
          box-shadow: var(--shadow-lg) !important;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;