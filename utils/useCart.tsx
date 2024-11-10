import React, { createContext, useContext, useState, useEffect } from 'react';
import { setCookie, getCookie, removeCookie } from '../utils/cookies';
//import { order } from '@/types';
//import mongoose from 'mongoose';
import { itemOrder } from '../types/types';


interface CartContextType {
  cart: itemOrder[];
  addToCart: (item: itemOrder) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;
  itemExists: (sku: string) => boolean;
  getItemFromCart: (sku: string) => itemOrder | undefined;
  increaseCartItem: (sku: string) => void;
  decreaseCartItem: (sku: string) => void;
  updateItemQuantity: (sku: string, additionalQty: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<itemOrder[]>([]);

  useEffect(() => {
    const storedCart = getCookie('cart');
    if (storedCart) {
      try {
        setCart(storedCart);
      } catch (error) {
        console.error('Error parsing cart from cookies:', error);
        setCart([]);
      }
    }
  }, []);

  const addToCart = (item: itemOrder) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart, item];
      setCookie('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateItemQuantity = (sku: string, additionalQty: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.sku === sku) {
          const updatedQuantity = item.quantity + additionalQty;
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      });
      setCookie('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const increaseCartItem = (sku: string) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.sku === sku) {
          const updatedQuantity = item.quantity + 1;
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      });
      setCookie('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const decreaseCartItem = (sku: string) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.sku === sku &&  item.quantity > 1) {
          const updatedQuantity = item.quantity - 1;
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      });
      setCookie('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const itemExists = (sku: string) => {
    return cart.some(item => sku === item.sku);
  };

  const removeFromCart = (sku: string) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => sku !== item.sku);
      setCookie('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const getItemFromCart = (sku: string) => {
    return cart.find(item => sku === item.sku);
  };

  const clearCart = () => {
    setCart([]);
    removeCookie('cart');
  };


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, itemExists, 
                                  getItemFromCart, increaseCartItem, decreaseCartItem, updateItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
