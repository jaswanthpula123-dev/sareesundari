import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('sundari_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync wishlist from user profile when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.wishlist) {
      setWishlist(user.wishlist);
      localStorage.setItem('sundari_wishlist', JSON.stringify(user.wishlist));
    }
  }, [isAuthenticated, user]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    const strId = typeof productId === 'object' ? productId._id : productId;
    return wishlist.some(item => (item._id || item).toString() === strId.toString());
  };

  const toggleWishlist = async (product) => {
    if (!product) return;
    const prodId = product._id;
    const exists = isInWishlist(prodId);

    if (isAuthenticated) {
      try {
        const res = await authAPI.toggleWishlist(prodId);
        if (res.success) {
          setWishlist(res.wishlist || []);
          localStorage.setItem('sundari_wishlist', JSON.stringify(res.wishlist || []));
          addToast(res.message);
        }
      } catch (error) {
        addToast(error.message, 'error');
      }
    } else {
      let updated;
      if (exists) {
        updated = wishlist.filter(item => (item._id || item).toString() !== prodId.toString());
        addToast('Removed from favorites');
      } else {
        updated = [...wishlist, product];
        addToast(`Saved "${product.name}" to favorites ❤️`);
      }
      setWishlist(updated);
      localStorage.setItem('sundari_wishlist', JSON.stringify(updated));
    }
  };

  const removeFromWishlist = async (productId) => {
    const product = wishlist.find(p => (p._id || p).toString() === productId.toString());
    if (product) {
      await toggleWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
