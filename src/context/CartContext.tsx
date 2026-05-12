"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  colorName?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, size: string, color: string, delta: number) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('gemina-cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('gemina-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, quantity: number, size?: string, color?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.size === size && item.color === color)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      let image = "https://images.unsplash.com/photo-1618333448491-188381b2cc1e?auto=format&fit=crop&q=80&w=800";
      if (product.images) {
        try {
          const imgs = JSON.parse(product.images);
          if (imgs.length > 0) image = imgs[0];
        } catch (e) {}
      }

      let colorName = "N/A";
      if (color && product.colors) {
        try {
          const productColors = JSON.parse(product.colors);
          const found = productColors.find((c: any) => (typeof c === 'string' ? c : c.hex) === color);
          if (found) {
            colorName = typeof found === 'string' ? "Personalizado" : found.name;
          }
        } catch (e) {}
      }

      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity, 
        image,
        size,
        color,
        colorName
      }];
    });
  };

  const removeFromCart = (id: string, size?: string, color?: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size && item.color === color)));
  };

  const updateQuantity = (id: string, size: string, color: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id && item.size === size && item.color === color) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
