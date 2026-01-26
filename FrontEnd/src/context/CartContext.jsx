import { createContext, useContext, useState, useEffect } from "react";
import { getMyBorrowings } from "../services/borrowService";
import { isAuthenticated } from "../services/authService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch pending borrows count
  const fetchPendingCount = async () => {
    if (!isAuthenticated()) {
      setPendingCount(0);
      return;
    }
    
    try {
      const response = await getMyBorrowings("");
      const pending = (response.result || []).filter(
        b => b.status === "PENDING_PICKUP" || b.status === "ACTIVE" || b.status === "OVERDUE"
      );
      setPendingCount(pending.length);
    } catch (error) {
      console.error("Error fetching pending count:", error);
      setPendingCount(0);
    }
  };

  // Fetch on mount and when auth changes
  useEffect(() => {
    fetchPendingCount();
    
    // Poll every 30 seconds to update count
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const refreshPendingCount = () => {
    fetchPendingCount();
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      isInCart,
      cartCount: cartItems.length,
      pendingCount,
      refreshPendingCount
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
