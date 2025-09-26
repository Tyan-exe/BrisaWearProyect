import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
  
  clearAuth: () => set({ 
    user: null, 
    isAuthenticated: false, 
    isLoading: false 
  })
}));

export default useAuthStore;
