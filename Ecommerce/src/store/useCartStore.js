import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  
  addItem: (product) => {
    const { items } = get();
    const existingItem = items.find(item => item.id === product.id);
    
    if (existingItem) {
      set(state => ({
        items: state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    } else {
      set(state => ({
        items: [...state.items, { ...product, quantity: 1 }]
      }));
    }
    
    get().calculateTotals();
  },
  
  removeItem: (productId) => {
    set(state => ({
      items: state.items.filter(item => item.id !== productId)
    }));
    get().calculateTotals();
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    set(state => ({
      items: state.items.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    }));
    get().calculateTotals();
  },
  
  clearCart: () => {
    set({ items: [], totalItems: 0, totalPrice: 0 });
  },
  
  calculateTotals: () => {
    const { items } = get();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    set({ totalItems, totalPrice });
  },
  
  applyCoupon: (couponCode, discountPercentage) => {
    const { totalPrice } = get();
    const discountAmount = totalPrice * (discountPercentage / 100);
    const newTotal = totalPrice - discountAmount;
    
    set({ 
      totalPrice: newTotal,
      appliedCoupon: { code: couponCode, discount: discountPercentage }
    });
  }
}));

export default useCartStore;
