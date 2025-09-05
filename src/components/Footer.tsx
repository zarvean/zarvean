import { Instagram, Facebook, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif font-semibold mb-4 tracking-tight">
              ZARVEAN
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Crafting timeless pieces that celebrate individuality and sophisticated style. 
              Each item is thoughtfully designed to enhance your wardrobe.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/zarveancom" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61577800661630" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://wa.me/923298892016" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-medium mb-4 tracking-wide uppercase text-sm">
              Customer Service
            </h4>
            <ul className="space-y-3 text-primary-foreground/80">
              <li>
                <a href="/contact" className="hover:text-primary-foreground transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/shipping" className="hover:text-primary-foreground transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-primary-foreground transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="/size-guide" className="hover:text-primary-foreground transition-colors">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4 tracking-wide uppercase text-sm">
              Quick Links
            </h4>
            <ul className="space-y-3 text-primary-foreground/80">
              <li>
                <a href="/" className="hover:text-primary-foreground transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-primary-foreground transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:text-primary-foreground transition-colors">
                  Cart
                </a>
              </li>
              <li>
                <a href="/orders" className="hover:text-primary-foreground transition-colors">
                  Order History
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 Zarvean. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;