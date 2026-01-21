import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book) => {
    if (cartItems.find(item => item.bookId === book.bookId)) {
      return false; // Already in cart
    }
    setCartItems(prev => [...prev, book]);
    return true;
  };

  const removeFromCart = (bookId) => {
    setCartItems(prev => prev.filter(item => item.bookId !== bookId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (bookId) => {
    return cartItems.some(item => item.bookId === bookId);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      isInCart,
      cartCount: cartItems.length 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
