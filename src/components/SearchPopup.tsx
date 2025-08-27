import { useState, useEffect } from "react";
import { Search, X, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { useProducts, LocalProduct } from "@/contexts/ProductsContext";
import { Badge } from "@/components/ui/badge";

const SearchPopup = () => {
  const { products } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocalProduct[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.colors.some(color => color.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setIsOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleViewAll = () => {
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Search className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="end">
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
              autoFocus
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs truncate">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">RS {product.price}</p>
                  </div>
                </div>
              ))}
              
              {searchQuery && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full" 
                  onClick={handleViewAll}
                >
                  View All ({products.filter(p => 
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length})
                </Button>
              )}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No products found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchPopup;