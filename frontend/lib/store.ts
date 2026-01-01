import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
        // Sync with localStorage (Zustand persist handles this, but we ensure consistency)
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem('token', token);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
        }
      },
      
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
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
        // Clear all auth-related storage completely
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          // Don't clear the entire morpankh-store, just clear auth parts
          // Cart and wishlist should persist across logout (for guest users)
          const storeData = localStorage.getItem('morpankh-store');
          if (storeData) {
            try {
              const parsed = JSON.parse(storeData);
              parsed.state = {
                ...parsed.state,
                user: null,
                token: null,
              };
              localStorage.setItem('morpankh-store', JSON.stringify(parsed));
            } catch (e) {
              // If parsing fails, clear everything
              localStorage.removeItem('morpankh-store');
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
            const tokenFromStorage = localStorage.getItem('token');
            
            // If we have a token in localStorage but no user in store, token might be stale
            // Clear it to prevent security issues
            if (tokenFromStorage && !state.user) {
              console.warn('Token found but no user - clearing stale token');
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              state.token = null;
            }
            
            // If we have a user but no token, clear user (inconsistent state)
            if (state.user && !tokenFromStorage) {
              console.warn('User found but no token - clearing user');
              state.user = null;
            }
            
            // Validate user object structure
            if (state.user && (!state.user.id || !state.user.role)) {
              console.warn('Invalid user structure after hydration - clearing user');
              state.user = null;
              state.token = null;
              if (tokenFromStorage) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
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

