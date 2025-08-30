import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand */}
          <div className="col-12 col-md-6">
            <h3 className="mb-3" style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display, serif', fontWeight: '600', letterSpacing: '-0.025em' }}>
              ZARVEAN
            </h3>
            <p className="mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '28rem' }}>
              Crafting timeless pieces that celebrate individuality and sophisticated style. 
              Each item is thoughtfully designed to enhance your wardrobe.
            </p>
            <div className="d-flex" style={{ gap: '1rem' }}>
              <a href="#" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <Instagram style={{ height: '1.25rem', width: '1.25rem' }} />
              </a>
              <a href="#" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <Facebook style={{ height: '1.25rem', width: '1.25rem' }} />
              </a>
              <a href="#" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <Twitter style={{ height: '1.25rem', width: '1.25rem' }} />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div className="col-12 col-md-3">
            <h4 className="mb-3" style={{ fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.875rem' }}>
              Customer Service
            </h4>
            <ul className="list-unstyled space-y-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li className="mb-2">
                <a href="/contact" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/shipping" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Shipping Info
                </a>
              </li>
              <li className="mb-2">
                <a href="/returns" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Returns
                </a>
              </li>
              <li className="mb-2">
                <a href="/size-guide" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-md-3">
            <h4 className="mb-3" style={{ fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.875rem' }}>
              Quick Links
            </h4>
            <ul className="list-unstyled" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li className="mb-2">
                <a href="/" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/shop" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Shop
                </a>
              </li>
              <li className="mb-2">
                <a href="/cart" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Cart
                </a>
              </li>
              <li className="mb-2">
                <a href="/orders" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Order History
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-top pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <p className="mb-3 mb-md-0" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
            © 2024 Zarvean. All rights reserved.
          </p>
          <div className="d-flex" style={{ gap: '1.5rem' }}>
            <a href="/privacy" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
              Privacy Policy
            </a>
            <a href="/terms" className="text-decoration-none hover-effect" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;