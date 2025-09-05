
import { ShoppingBag, Menu, User, LogOut, Settings, Home, Store, History, Instagram, Facebook, MessageCircle } from "lucide-react";
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
      <div className="bg-black text-white text-center py-2 text-sm font-medium">
        SAVE 200 RS ON ALL PREPAID ORDERS
      </div>
      
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-container">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Mobile Menu - Only visible on small screens */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link to="/" className="flex items-center space-x-3 px-3 py-2 hover:bg-black/10 transition-colors duration-200">
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link to="/shop" className="flex items-center space-x-3 px-3 py-2 hover:bg-black/10 transition-colors duration-200">
                    <Store className="h-5 w-5" />
                    <span>Shop</span>
                  </Link>
                  <Link to="/cart" className="flex items-center space-x-3 px-3 py-2 hover:bg-black/10 transition-colors duration-200">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Cart</span>
                    {itemCount > 0 && (
                      <span className="ml-auto bg-black text-white text-xs h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/orders" className="flex items-center space-x-3 px-3 py-2 hover:bg-black/10 transition-colors duration-200">
                    <History className="h-5 w-5" />
                    <span>Order History</span>
                  </Link>
                </nav>
                
                {/* Social Media Links */}
                <div className="mt-auto pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.instagram.com/zarveancom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-black/10 transition-colors duration-200"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.facebook.com/profile.php?id=61577800661630"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-black/10 transition-colors duration-200"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href="https://wa.me/923298892016"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-black/10 transition-colors duration-200"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-none">
            <Link to="/">
              <h1 className="text-xl md:text-2xl font-serif font-semibold tracking-tight text-center md:text-left">
                ZARVEAN
              </h1>
            </Link>
          </div>


          {/* Right Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search */}
            <SearchPopup />
            
            {isAdmin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Admin Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5" />
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
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleAuthClick}>
                <User className="h-5 w-5" />
              </Button>
            )}
            
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
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
