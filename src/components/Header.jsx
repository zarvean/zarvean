import { ShoppingBag, Menu, User, LogOut, Settings, Home, Store, History, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import SearchPopup from "./SearchPopup";

const Header = () => {
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.email === 'hehe@me.pk';

  const handleAuthClick = () => {
    if (user) {
      navigate('/account');
    } else {
      navigate('/auth');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-dark text-white text-center py-2" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
        SAVE 200 RS ON ALL PREPAID ORDERS
      </div>
      
      <header className="sticky-top bg-white border-bottom" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255, 255, 255, 0.95)', zIndex: 50 }}>
        <div className="container-fluid px-container">
          <div className="d-flex align-items-center justify-content-between" style={{ height: '4rem' }}>

            {/* Mobile Menu - Only visible on small screens */}
            <div className="d-flex d-md-none">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" style={{ width: '1.25rem', height: '1.25rem' }} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="mobile-menu" style={{ width: '280px' }}>
                  <nav className="d-flex flex-column mt-4" style={{ gap: '1rem' }}>
                    <Link to="/" className="d-flex align-items-center text-decoration-none px-3 py-2 rounded hover-bg-light" style={{ gap: '0.75rem', transition: 'background-color 0.2s' }}>
                      <Home style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span>Home</span>
                    </Link>
                    <Link to="/shop" className="d-flex align-items-center text-decoration-none px-3 py-2 rounded hover-bg-light" style={{ gap: '0.75rem', transition: 'background-color 0.2s' }}>
                      <Store style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span>Shop</span>
                    </Link>
                    <Link to="/cart" className="d-flex align-items-center text-decoration-none px-3 py-2 rounded hover-bg-light" style={{ gap: '0.75rem', transition: 'background-color 0.2s' }}>
                      <ShoppingBag style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span>Cart</span>
                      {itemCount > 0 && (
                        <span className="ms-auto badge bg-primary rounded-pill d-flex align-items-center justify-content-center" style={{ fontSize: '0.75rem', width: '1.25rem', height: '1.25rem' }}>
                          {itemCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/orders" className="d-flex align-items-center text-decoration-none px-3 py-2 rounded hover-bg-light" style={{ gap: '0.75rem', transition: 'background-color 0.2s' }}>
                      <History style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span>Order History</span>
                    </Link>
                  </nav>
                  
                  {/* Social Media Links */}
                  <div className="mt-auto pt-4 border-top">
                    <h3 className="text-muted mb-3" style={{ fontSize: '0.875rem', fontWeight: '600' }}>Follow Us</h3>
                    <div className="d-flex" style={{ gap: '1rem' }}>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded text-decoration-none hover-bg-light"
                        style={{ transition: 'background-color 0.2s' }}
                      >
                        <Instagram style={{ width: '1.25rem', height: '1.25rem' }} />
                      </a>
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded text-decoration-none hover-bg-light"
                        style={{ transition: 'background-color 0.2s' }}
                      >
                        <Facebook style={{ width: '1.25rem', height: '1.25rem' }} />
                      </a>
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded text-decoration-none hover-bg-light"
                        style={{ transition: 'background-color 0.2s' }}
                      >
                        <Twitter style={{ width: '1.25rem', height: '1.25rem' }} />
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <div className="flex-grow-1 flex-md-grow-0">
              <Link to="/" className="text-decoration-none">
                <h1 className="navbar-brand mb-0 text-center text-md-start" style={{ fontSize: '1.5rem', fontWeight: '600', letterSpacing: '-0.025em' }}>
                  ZARVEAN
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="d-none d-md-flex navbar-nav flex-row mx-auto" style={{ gap: '2rem' }}>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/shop" className="nav-link">Shop</Link>
            </nav>

            {/* Right Actions */}
            <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
              {/* Search */}
              <SearchPopup />
              
              {isAdmin ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings style={{ width: '1.25rem', height: '1.25rem' }} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin Panel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User style={{ width: '1.25rem', height: '1.25rem' }} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/account')}>
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      Order History
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleAuthClick}>
                  <User style={{ width: '1.25rem', height: '1.25rem' }} />
                </Button>
              )}
              
              <Link to="/cart" className="text-decoration-none">
                <Button variant="ghost" size="sm" className="position-relative">
                  <ShoppingBag style={{ width: '1.25rem', height: '1.25rem' }} />
                  {itemCount > 0 && (
                    <span className="position-absolute badge bg-primary rounded-pill d-flex align-items-center justify-content-center" style={{ top: '-0.25rem', right: '-0.25rem', width: '1rem', height: '1rem', fontSize: '0.75rem' }}>
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        .hover-bg-light:hover {
          background-color: var(--color-muted-light) !important;
        }
        
        @media (min-width: 768px) {
          .container-fluid .d-flex {
            height: 5rem !important;
          }
        }
        
        .mobile-menu {
          width: 280px;
        }
        
        @media (min-width: 576px) {
          .mobile-menu {
            width: 350px;
          }
        }
      `}</style>
    </>
  );
};

export default Header;