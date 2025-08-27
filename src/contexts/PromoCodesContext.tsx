import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface PromoCode {
  id: string;
  code: string;
  discount: number; // percentage discount
  isActive: boolean;
  expiryDate?: string;
  description: string;
  minOrderAmount?: number;
}

interface PromoCodesContextType {
  promoCodes: PromoCode[];
  addPromoCode: (promoCode: Omit<PromoCode, 'id'>) => void;
  updatePromoCode: (id: string, promoCode: Partial<PromoCode>) => void;
  deletePromoCode: (id: string) => void;
  validatePromoCode: (code: string, orderAmount: number) => { valid: boolean; discount: number; message: string };
}

const PromoCodesContext = createContext<PromoCodesContextType | undefined>(undefined);

export const usePromoCodes = () => {
  const context = useContext(PromoCodesContext);
  if (!context) {
    throw new Error('usePromoCodes must be used within a PromoCodesProvider');
  }
  return context;
};

const initialPromoCodes: PromoCode[] = [
  {
    id: "1",
    code: "WELCOME10",
    discount: 10,
    isActive: true,
    description: "10% off for new customers",
    minOrderAmount: 1000
  },
  {
    id: "2", 
    code: "SAVE20",
    discount: 20,
    isActive: true,
    description: "20% off on orders above RS 3000",
    minOrderAmount: 3000
  }
];

export const PromoCodesProvider = ({ children }: { children: ReactNode }) => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem('promoCodes');
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('promoCodes', JSON.stringify(initialPromoCodes));
    return initialPromoCodes;
  });

  const addPromoCode = (promoCode: Omit<PromoCode, 'id'>) => {
    const newPromoCode = {
      ...promoCode,
      id: Date.now().toString()
    };
    setPromoCodes(prev => {
      const updated = [...prev, newPromoCode];
      localStorage.setItem('promoCodes', JSON.stringify(updated));
      return updated;
    });
  };

  const updatePromoCode = (id: string, promoCodeUpdates: Partial<PromoCode>) => {
    setPromoCodes(prev => {
      const updated = prev.map(p => 
        p.id === id ? { ...p, ...promoCodeUpdates } : p
      );
      localStorage.setItem('promoCodes', JSON.stringify(updated));
      return updated;
    });
  };

  const deletePromoCode = (id: string) => {
    setPromoCodes(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('promoCodes', JSON.stringify(updated));
      return updated;
    });
  };

  const validatePromoCode = (code: string, orderAmount: number) => {
    const promoCode = promoCodes.find(p => p.code.toLowerCase() === code.toLowerCase() && p.isActive);
    
    if (!promoCode) {
      return { valid: false, discount: 0, message: "Invalid promo code" };
    }

    if (promoCode.expiryDate && new Date(promoCode.expiryDate) < new Date()) {
      return { valid: false, discount: 0, message: "Promo code has expired" };
    }

    if (promoCode.minOrderAmount && orderAmount < promoCode.minOrderAmount) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Minimum order amount is RS ${promoCode.minOrderAmount}` 
      };
    }

    const discountAmount = Math.round((orderAmount * promoCode.discount) / 100);
    return { 
      valid: true, 
      discount: discountAmount, 
      message: `${promoCode.discount}% discount applied!` 
    };
  };

  return (
    <PromoCodesContext.Provider value={{
      promoCodes,
      addPromoCode,
      updatePromoCode,
      deletePromoCode,
      validatePromoCode
    }}>
      {children}
    </PromoCodesContext.Provider>
  );
};