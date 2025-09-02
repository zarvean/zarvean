import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

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
  addPromoCode: (promoCode: Omit<PromoCode, 'id'>) => Promise<void>;
  updatePromoCode: (id: string, promoCode: Partial<PromoCode>) => Promise<void>;
  deletePromoCode: (id: string) => Promise<void>;
  validatePromoCode: (code: string, orderAmount: number) => Promise<{ valid: boolean; discount: number; message: string }>;
  fetchPromoCodes: () => Promise<void>;
}

const PromoCodesContext = createContext<PromoCodesContextType | undefined>(undefined);

export const usePromoCodes = () => {
  const context = useContext(PromoCodesContext);
  if (!context) {
    throw new Error('usePromoCodes must be used within a PromoCodesProvider');
  }
  return context;
};

export const PromoCodesProvider = ({ children }: { children: ReactNode }) => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const { user } = useAuth();

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching promo codes:', error);
        return;
      }

      const mappedPromoCodes = data?.map(code => ({
        id: code.id,
        code: code.code,
        discount: Number(code.discount_value),
        isActive: code.is_active,
        description: code.description || '',
        minOrderAmount: code.minimum_order_amount ? Number(code.minimum_order_amount) : undefined,
        expiryDate: code.expires_at || undefined
      })) || [];

      setPromoCodes(mappedPromoCodes);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPromoCodes();
    }
  }, [user]);

  const addPromoCode = async (promoCode: Omit<PromoCode, 'id'>) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .insert({
          code: promoCode.code,
          discount_type: 'percentage',
          discount_value: promoCode.discount,
          is_active: promoCode.isActive,
          description: promoCode.description,
          minimum_order_amount: promoCode.minOrderAmount,
          expires_at: promoCode.expiryDate
        });

      if (error) {
        console.error('Error adding promo code:', error);
        throw error;
      }

      await fetchPromoCodes();
    } catch (error) {
      console.error('Error adding promo code:', error);
      throw error;
    }
  };

  const updatePromoCode = async (id: string, promoCodeUpdates: Partial<PromoCode>) => {
    try {
      const updateData: any = {};
      if (promoCodeUpdates.code) updateData.code = promoCodeUpdates.code;
      if (promoCodeUpdates.discount !== undefined) updateData.discount_value = promoCodeUpdates.discount;
      if (promoCodeUpdates.isActive !== undefined) updateData.is_active = promoCodeUpdates.isActive;
      if (promoCodeUpdates.description !== undefined) updateData.description = promoCodeUpdates.description;
      if (promoCodeUpdates.minOrderAmount !== undefined) updateData.minimum_order_amount = promoCodeUpdates.minOrderAmount;
      if (promoCodeUpdates.expiryDate !== undefined) updateData.expires_at = promoCodeUpdates.expiryDate;

      const { error } = await supabase
        .from('promo_codes')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating promo code:', error);
        throw error;
      }

      await fetchPromoCodes();
    } catch (error) {
      console.error('Error updating promo code:', error);
      throw error;
    }
  };

  const deletePromoCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting promo code:', error);
        throw error;
      }

      await fetchPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
      throw error;
    }
  };

  const validatePromoCode = async (code: string, orderAmount: number) => {
    try {
      const { data, error } = await supabase
        .rpc('validate_promo_code_public', {
          code_text: code,
          order_amount: orderAmount
        });

      if (error) {
        console.error('Error validating promo code:', error);
        return { valid: false, discount: 0, message: "Error validating promo code" };
      }

      const result = data?.[0];
      if (!result) {
        return { valid: false, discount: 0, message: "Invalid promo code" };
      }

      return {
        valid: result.is_valid,
        discount: Number(result.discount_amount || 0),
        message: result.message || "Promo code applied!"
      };
    } catch (error) {
      console.error('Error validating promo code:', error);
      return { valid: false, discount: 0, message: "Error validating promo code" };
    }
  };

  return (
    <PromoCodesContext.Provider value={{
      promoCodes,
      addPromoCode,
      updatePromoCode,
      deletePromoCode,
      validatePromoCode,
      fetchPromoCodes
    }}>
      {children}
    </PromoCodesContext.Provider>
  );
};