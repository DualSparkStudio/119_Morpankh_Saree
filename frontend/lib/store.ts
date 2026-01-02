import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  role: string;
}

interface CartItem {
  id: string;
  productId: string;
  productSlug?: string; // Optional for backward compatibility, will be fetched if missing
  variantId?: string;
  colorId?: string;
  selectedColor?: string; // Color name for display
  quantity: number;
  price: number;
  productName?: string;
  productImage?: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  cart: CartItem[];
  wishlist: string[];
  _hasHydrated?: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  addToCart: (item: CartItem) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      cart: [],
      wishlist: [],
      _hasHydrated: false,
      
      setUser: (user) => {
        // Validate user object before setting
        if (user && (!user.id || !user.role)) {
          console.warn('Invalid user object provided:', user);
          set({ user: null });
          return;
        }
        set({ user });
      },
      setToken: (token) => {
        set({ token });
        // Sync with sessionStorage for tab isolation (Zustand persist handles this, but we ensure consistency)
        if (typeof window !== 'undefined') {
          if (token) {
            sessionStorage.setItem('token', token);
          } else {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refreshToken');
          }
        }
      },
      
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (i) => i.productId === item.productId && 
                   i.variantId === item.variantId && 
                   i.colorId === item.colorId
          );
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.id === existingItem.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),
      
      updateCartItem: (id, quantity) =>
        set((state) => ({
          cart: quantity <= 0
            ? state.cart.filter((item) => item.id !== id)
            : state.cart.map((item) =>
                item.id === id ? { ...item, quantity } : item
              ),
        })),
      
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      
      clearCart: () => set({ cart: [] }),
      
      addToWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist
            : [...state.wishlist, productId],
        })),
      
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        })),
      
      logout: () => {
        // Clear all auth-related storage completely (tab-specific with sessionStorage)
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('refreshToken');
          // Don't clear the entire morpankh-store, just clear auth parts
          // Cart and wishlist should persist across logout (for guest users)
          const storeData = sessionStorage.getItem('morpankh-store');
          if (storeData) {
            try {
              const parsed = JSON.parse(storeData);
              parsed.state = {
                ...parsed.state,
                user: null,
                token: null,
              };
              sessionStorage.setItem('morpankh-store', JSON.stringify(parsed));
            } catch (e) {
              // If parsing fails, clear everything
              sessionStorage.removeItem('morpankh-store');
            }
          }
        }
        set({
          user: null,
          token: null,
          // Keep cart and wishlist on logout (user might want to checkout as guest)
          // cart: [],
          // wishlist: [],
        });
      },
    }),
    {
      name: 'morpankh-store',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for tab isolation
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        cart: state.cart,
        wishlist: state.wishlist,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
          
          // Validate user state after hydration
          // If token exists but user is missing, clear token (security)
          // If user exists but no token, clear user (security)
          if (typeof window !== 'undefined') {
            // Check sessionStorage for token (tab-specific)
            const tokenFromStorage = sessionStorage.getItem('token');
            
            // Migrate from localStorage to sessionStorage on first load (one-time migration)
            if (!tokenFromStorage) {
              const oldToken = localStorage.getItem('token');
              if (oldToken) {
                // Migrate to sessionStorage for tab isolation
                sessionStorage.setItem('token', oldToken);
                const oldRefreshToken = localStorage.getItem('refreshToken');
                if (oldRefreshToken) {
                  sessionStorage.setItem('refreshToken', oldRefreshToken);
                }
              }
            }
            
            // Use migrated token if available
            const activeToken = sessionStorage.getItem('token');
            
            // If we have a token in sessionStorage but no user in store, token might be stale
            // Clear it to prevent security issues
            if (activeToken && !state.user) {
              console.warn('Token found but no user - clearing stale token');
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('refreshToken');
              state.token = null;
            }
            
            // If we have a user but no token, clear user (inconsistent state)
            if (state.user && !activeToken) {
              console.warn('User found but no token - clearing user');
              state.user = null;
            }
            
            // Validate user object structure
            if (state.user && (!state.user.id || !state.user.role)) {
              console.warn('Invalid user structure after hydration - clearing user');
              state.user = null;
              state.token = null;
              if (activeToken) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('refreshToken');
              }
            }
          }
        }
      },
    }
  )
);

// Helper hook to check if store has hydrated
export const useHasHydrated = () => {
  const store = useStore();
  return store._hasHydrated !== undefined ? store._hasHydrated : false;
};

