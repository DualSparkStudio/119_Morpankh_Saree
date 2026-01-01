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
      
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        if (token && typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        } else if (!token && typeof window !== 'undefined') {
          localStorage.removeItem('token');
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
        // Clear localStorage on logout to prevent stale auth state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('morpankh-store');
        }
        set({
          user: null,
          token: null,
          cart: [],
          wishlist: [],
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

