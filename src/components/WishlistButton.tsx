import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  product, 
  variant = 'ghost', 
  size = 'sm' 
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleClick = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={inWishlist ? 'text-red-500' : ''}
    >
      <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
    </Button>
  );
};

export default WishlistButton;