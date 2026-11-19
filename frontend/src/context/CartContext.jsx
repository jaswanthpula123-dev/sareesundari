import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const calculateWeightPrice = (basePrice, option) => {
  const p = Number(basePrice) || 0;
  if (!option || typeof option !== 'string') return p;
  if (option === '250g') return p;
  if (option === '1kg') return Math.round(p * 3.75);
  if (option === '500g') return Math.round(p * 1.95);
  // Saree Draping & Blouse Options
  if (option.includes('Custom Stitched Blouse')) return p + 1200;
  if (option.includes('Fall & Pico')) return p + 350;
  // Standard or Unstitched Blouse
  return p;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('sweetmagic_cart_items') || localStorage.getItem('sundari_cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(() => {
    const savedCoupon = localStorage.getItem('sweetmagic_coupon') || localStorage.getItem('sundari_coupon');
    return savedCoupon ? JSON.parse(savedCoupon) : null;
  });

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST on sweets
  const shipping = subtotal >= 499 || subtotal === 0 ? 0 : 49; // Free above ₹499
  
  let discountAmount = 0;
  if (coupon && subtotal > 0) {
    discountAmount = Math.round((subtotal * coupon.percentage) / 100);
  }
  const total = Math.max(0, subtotal + tax + shipping - discountAmount);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sweetmagic_cart_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('sweetmagic_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('sweetmagic_coupon');
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

  const addToCart = async (product, quantity = 1, weight = '500g') => {
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
          addToast(`Added ${quantity}x "${product.name}" (${weight}) to your cart 🍬`);
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
            addToast(`Only ${product.stock} boxes available in stock`, 'error');
            return prevItems;
          }
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            price: weightPrice
          };
          addToast(`Updated quantity of "${product.name}" (${weight}) in cart`);
          return updated;
        } else {
          if (product.stock && qty > product.stock) {
            addToast(`Only ${product.stock} boxes available in stock`, 'error');
            return prevItems;
          }
          addToast(`Added "${product.name}" (${weight}) to your cart 🍬`);
          return [
            ...prevItems,
            {
              _id: `${prodId}_${weight}`,
              productId: prodId,
              name: product.name,
              slug: product.slug,
              image: product.images?.[0] || '/sarees/kanjivaram-1.jpg',
              weight: weight || '500g',
              basePrice: basePrice,
              price: weightPrice,
              originalPrice: product.price,
              stock: product.stock || 20,
              quantity: qty,
              category: product.category
            }
          ];
        }
      });
    }
  };

  const updateQuantity = async (productId, quantity, weight = '500g') => {
    const qty = Number(quantity);
    if (isAuthenticated) {
      try {
        const res = await cartAPI.updateQuantity(productId, qty, weight, weight);
        if (res.success && res.cart?.items) {
          setItems(res.cart.items);
        }
      } catch (error) {
        addToast(error.message, 'error');
      }
    } else {
      setItems((prevItems) => {
        if (qty <= 0) {
          return prevItems.filter(item => 
            !((item.productId || item._id).toString() === productId.toString() && item.weight === weight)
          );
        }
        return prevItems.map(item => {
          if ((item.productId || item._id).toString() === productId.toString() && item.weight === weight) {
            return { ...item, quantity: qty };
          }
          return item;
        });
      });
    }
  };

  const updateWeight = async (productId, oldWeight, newWeight) => {
    if (oldWeight === newWeight) return;

    if (isAuthenticated) {
      try {
        const res = await cartAPI.updateQuantity(productId, undefined, newWeight, oldWeight);
        if (res.success && res.cart?.items) {
          setItems(res.cart.items);
          addToast(`Updated weight to ${newWeight} ✨`);
        }
      } catch (error) {
        addToast(error.message, 'error');
      }
    } else {
      setItems((prev) => {
        return prev.map(item => {
          if ((item.productId || item._id).toString() === productId.toString() && item.weight === oldWeight) {
            const newPrice = calculateWeightPrice(item.basePrice || item.price, newWeight);
            return {
              ...item,
              weight: newWeight,
              price: newPrice,
              _id: `${item.productId}_${newWeight}`
            };
          }
          return item;
        });
      });
      addToast(`Updated weight to ${newWeight} ✨`);
    }
  };

  const removeFromCart = async (productId, weight) => {
    if (isAuthenticated) {
      try {
        const res = await cartAPI.removeItem(productId, weight);
        if (res.success && res.cart?.items) {
          setItems(res.cart.items);
          addToast('Sweet removed from cart');
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
      addToast('Sweet removed from cart');
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

    if (clean === 'SWEET10' || clean === 'WELCOME10') {
      const c = { code: clean, percentage: 10, desc: 'Sweet Welcome 10% Off' };
      setCoupon(c);
      addToast(`Coupon "${clean}" applied! Saved 10% 🎉`);
      return { success: true };
    } else if (clean === 'MAGIC20') {
      const c = { code: 'MAGIC20', percentage: 20, desc: 'Sweet Magic Festival 20% Off' };
      setCoupon(c);
      addToast('Coupon "MAGIC20" applied! Saved 20% 🎉');
      return { success: true };
    } else if (clean === 'FESTIVE15') {
      const c = { code: 'FESTIVE15', percentage: 15, desc: 'Festive Season 15% Off' };
      setCoupon(c);
      addToast('Coupon "FESTIVE15" applied! Saved 15% 🎉');
      return { success: true };
    } else {
      addToast('Invalid coupon code. Try SWEET10 or MAGIC20', 'error');
      return { success: false, message: 'Invalid or expired code. Try SWEET10 or MAGIC20' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast('Coupon removed');
  };

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
