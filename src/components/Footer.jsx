import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container mx-auto px-container">
        <div className="row g-4 mb-5">
          {/* Brand */}
          <div className="col-md-6">
            <h3 className="font-serif fw-semibold mb-3" style={{ fontSize: '2rem', letterSpacing: '-0.025em' }}>
              ZARVEAN
            </h3>
            <p className="text-white mb-4" style={{ opacity: '0.8', maxWidth: '28rem' }}>
              Crafting timeless pieces that celebrate individuality and sophisticated style. 
              Each item is thoughtfully designed to enhance your wardrobe.
            </p>
            <div className="d-flex" style={{ gap: '1rem' }}>
              <a href="#" className="text-white text-decoration-none" style={{ opacity: '0.8', transition: 'opacity 0.3s ease' }}>
                <Instagram style={{ width: '1.25rem', height: '1.25rem' }} />
              </a>
              <a href="#" className="text-white text-decoration-none" style={{ opacity: '0.8', transition: 'opacity 0.3s ease' }}>
                <Facebook style={{ width: '1.25rem', height: '1.25rem' }} />
              </a>
              <a href="#" className="text-white text-decoration-none" style={{ opacity: '0.8', transition: 'opacity 0.3s ease' }}>
                <Twitter style={{ width: '1.25rem', height: '1.25rem' }} />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div className="col-md-3">
            <h4 className="fw-medium mb-3 text-uppercase" style={{ fontSize: '0.875rem', letterSpacing: '0.05em', color: 'var(--color-accent)' }}>
              Customer Service
            </h4>
            <ul className="list-unstyled" style={{ gap: '0.75rem' }}>
              <li className="mb-2">
                <a href="/contact" className="footer-link">
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/shipping" className="footer-link">
                  Shipping Info
                </a>
              </li>
              <li className="mb-2">
                <a href="/returns" className="footer-link">
                  Returns
                </a>
              </li>
              <li className="mb-2">
                <a href="/size-guide" className="footer-link">
                  Size Guide
                </a>
              </li>
              <li className="mb-2">
                <a href="/faq" className="footer-link">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-md-3">
            <h4 className="fw-medium mb-3 text-uppercase" style={{ fontSize: '0.875rem', letterSpacing: '0.05em', color: 'var(--color-accent)' }}>
              Company
            </h4>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/about" className="footer-link">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/careers" className="footer-link">
                  Careers
                </a>
              </li>
              <li className="mb-2">
                <a href="/privacy" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="/terms" className="footer-link">
                  Terms of Service
                </a>
              </li>
              <li className="mb-2">
                <a href="/press" className="footer-link">
                  Press
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-top border-secondary pt-4 mb-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="mb-2" style={{ color: 'var(--color-accent)' }}>Stay Updated</h5>
              <p className="mb-0 text-white" style={{ opacity: '0.8' }}>
                Subscribe to receive updates on new arrivals and exclusive offers.
              </p>
            </div>
            <div className="col-md-6">
              <div className="d-flex mt-3 mt-md-0">
                <input 
                  type="email" 
                  className="form-control me-2" 
                  placeholder="Enter your email"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    borderRadius: '8px'
                  }}
                />
                <button 
                  className="btn text-white fw-semibold px-4"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-secondary)',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-top border-secondary pt-4 text-center">
          <p className="mb-0 text-white" style={{ opacity: '0.6' }}>
            © 2024 ZARVEAN. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        .footer-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .footer-link:hover {
          color: var(--color-accent);
        }
        
        .d-flex a:hover {
          opacity: 1 !important;
        }
        
        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .form-control:focus {
          background-color: transparent;
          border-color: var(--color-accent);
          color: white;
          box-shadow: 0 0 0 0.2rem rgba(212, 185, 150, 0.25);
        }
      `}</style>
    </footer>
  );
};

export default Footer;