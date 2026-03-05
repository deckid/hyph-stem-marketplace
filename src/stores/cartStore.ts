import { create } from 'zustand';

interface CartItem {
  stemId: string;
  title: string;
  creator: string;
  instrument: string;
  price: number;
}

interface BundleTier {
  name: string;
  discount: number;
  perStem: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (stemId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setOpen: (open: boolean) => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getTier: () => BundleTier;
}

const BUNDLE_TIERS: { minCount: number; name: string; discount: number; perStem: string }[] = [
  { minCount: 20, name: '20+ Bundle', discount: 0.67, perStem: '$0.33' },
  { minCount: 10, name: '10+ Bundle', discount: 0.50, perStem: '$0.50' },
  { minCount: 5, name: '5+ Bundle', discount: 0.40, perStem: '$0.60' },
  { minCount: 3, name: '3+ Bundle', discount: 0.25, perStem: '$0.75' },
  { minCount: 1, name: 'Single', discount: 0, perStem: '$1.00' },
];

function getTierForCount(count: number): BundleTier {
  const tier = BUNDLE_TIERS.find((t) => count >= t.minCount);
  if (!tier) {
    return { name: 'Single', discount: 0, perStem: '$1.00' };
  }
  return { name: tier.name, discount: tier.discount, perStem: tier.perStem };
}

const BASE_PRICE = 1.0;

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item: CartItem) => {
    set((state) => {
      const exists = state.items.some((i) => i.stemId === item.stemId);
      if (exists) return state;
      return { items: [...state.items, item] };
    });
  },

  removeItem: (stemId: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.stemId !== stemId),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  setOpen: (open: boolean) => {
    set({ isOpen: open });
  },

  getItemCount: () => {
    return get().items.length;
  },

  getSubtotal: () => {
    const count = get().items.length;
    return count * BASE_PRICE;
  },

  getDiscount: () => {
    const count = get().items.length;
    if (count === 0) return 0;
    const tier = getTierForCount(count);
    const subtotal = count * BASE_PRICE;
    return subtotal * tier.discount;
  },

  getTotal: () => {
    const count = get().items.length;
    if (count === 0) return 0;
    const tier = getTierForCount(count);
    const subtotal = count * BASE_PRICE;
    return subtotal - subtotal * tier.discount;
  },

  getTier: () => {
    const count = get().items.length;
    return getTierForCount(count);
  },
}));
