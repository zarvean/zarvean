import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* 404 Hero Section */}
      <div className="flex-grow flex items-center justify-center section-padding">
        <div className="max-w-2xl text-center space-y-8">
          {/* Large 404 Number */}
          <div className="relative">
            <h1 className="hero-title text-8xl md:text-9xl font-serif text-muted-foreground/30 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-primary rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 md:w-12 md:h-12 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-primary">
              Oops! Page not found
            </h2>
            <p className="hero-subtitle max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back to exploring our collection.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/')}
              className="btn-hero group"
            >
              <Home className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
              Return to Home
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="btn-outline group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Popular destinations:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/shop')}
                className="hover:text-primary transition-colors"
              >
                Shop Collection
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/account')}
                className="hover:text-primary transition-colors"
              >
                My Account
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/cart')}
                className="hover:text-primary transition-colors"
              >
                Shopping Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-32 h-32 border border-muted-foreground/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-24 h-24 border border-muted-foreground/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/4 w-16 h-16 border border-muted-foreground/10 rounded-full animate-pulse delay-500"></div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
