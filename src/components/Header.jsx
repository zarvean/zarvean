import { ShoppingBag, Menu, User, LogOut, Settings, Home, Store, History, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import SearchPopup from "@/components/SearchPopup";

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
      
      <header className="sticky-top bg-light border-bottom" style={{ zIndex: '50', backdropFilter: 'blur(4px)' }}>
        <div className="container-fluid px-3">
          <div className="d-flex align-items-center justify-content-between" style={{ height: '4rem' }}>

            {/* Mobile Menu - Only visible on small screens */}
            <div className="d-flex d-md-none">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                  <nav className="d-flex flex-column mt-4" style={{ gap: '1rem' }}>
                    <Link to="/" className="d-flex align-items-center px-3 py-2 rounded text-decoration-none hover-effect" style={{ gap: '0.75rem' }}>
                      <Home style={{ height: '1.25rem', width: '1.25rem' }} />
                      <span>Home</span>
                    </Link>
                    <Link to="/shop" className="d-flex align-items-center px-3 py-2 rounded text-decoration-none hover-effect" style={{ gap: '0.75rem' }}>
                      <Store style={{ height: '1.25rem', width: '1.25rem' }} />
                      <span>Shop</span>
                    </Link>
                    <Link to="/cart" className="d-flex align-items-center px-3 py-2 rounded text-decoration-none hover-effect" style={{ gap: '0.75rem' }}>
                      <ShoppingBag style={{ height: '1.25rem', width: '1.25rem' }} />
                      <span>Cart</span>
                      {itemCount > 0 && (
                        <span className="ms-auto badge bg-primary text-white rounded-pill d-flex align-items-center justify-content-center" style={{ height: '1.25rem', width: '1.25rem', fontSize: '0.75rem' }}>
                          {itemCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/orders" className="d-flex align-items-center px-3 py-2 rounded text-decoration-none hover-effect" style={{ gap: '0.75rem' }}>
                      <History style={{ height: '1.25rem', width: '1.25rem' }} />
                      <span>Order History</span>
                    </Link>
                  </nav>
                  
                  {/* Social Media Links */}
                  <div className="mt-auto pt-4 border-top">
                    <h6 className="text-muted mb-3" style={{ fontSize: '0.875rem', fontWeight: '600' }}>Follow Us</h6>
                    <div className="d-flex" style={{ gap: '1rem' }}>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded hover-effect text-decoration-none"
                      >
                        <Instagram style={{ height: '1.25rem', width: '1.25rem' }} />
                      </a>
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded hover-effect text-decoration-none"
                      >
                        <Facebook style={{ height: '1.25rem', width: '1.25rem' }} />
                      </a>
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded hover-effect text-decoration-none"
                      >
                        <Twitter style={{ height: '1.25rem', width: '1.25rem' }} />
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <div className="flex-fill d-md-flex-none">
              <Link to="/" className="text-decoration-none">
                <h1 className="mb-0 text-center text-md-start" style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display, serif', fontWeight: '600', letterSpacing: '-0.025em' }}>
                  ZARVEAN
                </h1>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
              {/* Search */}
              <SearchPopup />
              
              {isAdmin ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings style={{ height: '1.25rem', width: '1.25rem' }} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin Panel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User style={{ height: '1.25rem', width: '1.25rem' }} />
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
                      <LogOut style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleAuthClick}>
                  <User style={{ height: '1.25rem', width: '1.25rem' }} />
                </Button>
              )}
              
              <Link to="/cart" className="text-decoration-none">
                <Button variant="ghost" size="sm" className="position-relative">
                  <ShoppingBag style={{ height: '1.25rem', width: '1.25rem' }} />
                  {itemCount > 0 && (
                    <span className="position-absolute badge bg-primary text-white rounded-pill d-flex align-items-center justify-content-center" style={{ top: '-0.25rem', right: '-0.25rem', height: '1rem', width: '1rem', fontSize: '0.75rem' }}>
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;