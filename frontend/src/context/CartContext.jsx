import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const calculateWeightPrice = (basePrice, weight) => {
  return Number(basePrice) || 0;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('sundari_cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(() => {
    const savedCoupon = localStorage.getItem('sundari_coupon');
    return savedCoupon ? JSON.parse(savedCoupon) : null;
  });

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST on Handloom Silk
  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 150; // Free above ₹1,999
  
  let discountAmount = 0;
  if (coupon && subtotal > 0) {
    discountAmount = Math.round((subtotal * coupon.percentage) / 100);
  }
  const total = Math.max(0, subtotal + tax + shipping - discountAmount);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sundari_cart_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('sundari_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('sundari_coupon');
    }
  }, [coupon]);

  // Sync with backend if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      cartAPI.getCart()
        .then((res) => {
          if (res.success && res.cart?.items) {
            setItems(res.cart.items);
          }
        })
        .catch((err) => console.log('Cart fetch sync:', err.message));
    }
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1, weight = 'Standard (6.3m with Blouse)') => {
    if (!product) return;
    const qty = Math.max(1, Number(quantity));
    const prodId = product._id || product.productId;
    const basePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
    const weightPrice = calculateWeightPrice(basePrice, weight);

    if (isAuthenticated) {
      try {
        const res = await cartAPI.addToCart(prodId, qty, weight);
        if (res.success && res.cart?.items) {
          setItems(res.cart.items);
          addToast(`Added ${quantity}x "${product.name}" to your bag ✨`);
        }
      } catch (error) {
        addToast(error.message, 'error');
      }
    } else {
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => (item.productId || item._id).toString() === prodId.toString() && item.weight === weight
        );

        if (existingIndex > -1) {
          const newQty = prevItems[existingIndex].quantity + qty;
          if (product.stock && newQty > product.stock) {
            addToast(`Only ${product.stock} pieces available on loom`, 'error');
            return prevItems;
          }
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            price: weightPrice
          };
          addToast(`Updated quantity of "${product.name}" in bag`);
          return updated;
        } else {
          if (product.stock && qty > product.stock) {
            addToast(`Only ${product.stock} pieces available on loom`, 'error');
            return prevItems;
          }
          addToast(`Added "${product.name}" to your bag ✨`);
          return [
            ...prevItems,
            {
              _id: `${prodId}_${weight}`,
              productId: prodId,
              name: product.name,
              slug: product.slug,
              image: product.images?.[0] || '/sarees/kanjivaram-1.jpg',
              price: weightPrice,
              originalPrice: product.price,
              weight: weight,
              quantity: qty,
              category: product.category,
              stock: product.stock
            }
          ];
        }
      });
    }
  };

  const updateQuantity = async (productId, newQuantity, weight) => {
    const qty = Number(newQuantity);
    if (qty <= 0) {
      removeFromCart(productId, weight);
      return;
    }

    if (isAuthenticated) {
      try {
        const res = await cartAPI.updateQuantity(productId, qty, weight);
        if (res.success && res.cart?.items) {
          setItems(res.cart.items);
        }
      } catch (error) {
        addToast(error.message, 'error');
      }
    } else {
      setItems((prev) =>
        prev.map((item) => {
          const matchId = (item.productId || item._id).toString() === productId.toString();
          const matchWeight = !weight || item.weight === weight;
          if (matchId && matchWeight) {
            return { ...item, quantity: qty };
          }
          return item;
        })
      );
    }
  };

  const updateWeight = (productId, oldWeight, newWeight) => {
    setItems((prev) =>
      prev.map((item) => {
        const matchId = (item.productId || item._id).toString() === productId.toString();
        if (matchId && item.weight === oldWeight) {
          return {
            ...item,
            weight: newWeight
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = async (productId, weight) => {
    if (isAuthenticated) {
      try {
        const res = await cartAPI.removeItem(productId, weight);
        if (res.success && res.cart?.items) {
          setItems(res.cart.items);
          addToast('Saree removed from bag');
        }
      } catch (error) {
        addToast(error.message, 'error');
      }
    } else {
      setItems((prev) => prev.filter(item => {
        const matchId = (item.productId || item._id).toString() === productId.toString();
        const matchWeight = !weight || item.weight === weight;
        return !(matchId && matchWeight);
      }));
      addToast('Saree removed from bag');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
      } catch (error) {
        console.error(error);
      }
    }
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    if (!code) return { success: false, message: 'Please enter a coupon code' };
    const clean = code.trim().toUpperCase();

    if (clean === 'SUNDARI20' || clean === 'MAGIC20') {
      const c = { code: 'SUNDARI20', percentage: 20, desc: 'Festive Heritage 20% Off' };
      setCoupon(c);
      addToast('Coupon "SUNDARI20" applied! Saved 20% 🎉');
      return { success: true };
    } else if (clean === 'HERITAGE15' || clean === 'FESTIVE15') {
      const c = { code: 'HERITAGE15', percentage: 15, desc: 'Heritage Vault 15% Off' };
      setCoupon(c);
      addToast('Coupon "HERITAGE15" applied! Saved 15% 🎉');
      return { success: true };
    } else if (clean === 'ROYAL10' || clean === 'WELCOME10') {
      const c = { code: 'ROYAL10', percentage: 10, desc: 'Royal Welcome 10% Off' };
      setCoupon(c);
      addToast('Coupon "ROYAL10" applied! Saved 10% 🎉');
      return { success: true };
    } else {
      addToast('Invalid coupon code. Try SUNDARI20 or HERITAGE15', 'error');
      return { success: false, message: 'Invalid or expired code. Try SUNDARI20 or HERITAGE15' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast('Coupon removed');
  };

  const value = {
    items,
    cartCount,
    subtotal,
    tax,
    shipping,
    discountAmount,
    total,
    coupon,
    addToCart,
    updateQuantity,
    updateWeight,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
