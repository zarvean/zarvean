
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from '@/hooks/use-toast'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
}

interface CartState {
  items: CartItem[]
  total: number
  discount: number
  appliedPromoCode?: string
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string; size?: string; color?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; size?: string; color?: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'APPLY_DISCOUNT'; payload: { discount: number; promoCode?: string } }
  | { type: 'REMOVE_DISCOUNT' }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        item.size === action.payload.size && 
        item.color === action.payload.color
      )
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id && 
          item.size === action.payload.size && 
          item.color === action.payload.color
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => 
        !(item.id === action.payload.id && 
          item.size === action.payload.size && 
          item.color === action.payload.color)
      )
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id && 
        item.size === action.payload.size && 
        item.color === action.payload.color
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)
      
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, discount: 0 }
      
    case 'LOAD_CART':
      return {
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        discount: 0
      }
      
    case 'APPLY_DISCOUNT':
      return {
        ...state,
        discount: action.payload.discount,
        appliedPromoCode: action.payload.promoCode
      }
      
    case 'REMOVE_DISCOUNT':
      return {
        ...state,
        discount: 0,
        appliedPromoCode: undefined
      }
      
    default:
      return state
  }
}

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string, size?: string, color?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  itemCount: number
  applyDiscount: (discount: number, promoCode?: string) => void
  removeDiscount: () => void
  finalTotal: number
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, discount: 0 })

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartData })
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`
    })
  }

  const removeItem = (id: string, size?: string, color?: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, size, color } })
    toast({
      title: "Removed from Cart", 
      description: "Item has been removed from your cart."
    })
  }

  const updateQuantity = (id: string, quantity: number, size?: string, color?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, size, color } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const applyDiscount = (discount: number, promoCode?: string) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: { discount, promoCode } })
  }

  const removeDiscount = () => {
    dispatch({ type: 'REMOVE_DISCOUNT' })
  }

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const finalTotal = Math.max(0, state.total - state.discount)

  return (
    <CartContext.Provider value={{
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      applyDiscount,
      removeDiscount,
      finalTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}
