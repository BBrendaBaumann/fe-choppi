import { create } from 'zustand';

export interface IProdCart {
  id: number;
  name: string;
  price: number;
  stock_order: number;
  imgs: string[];
}

interface CartState {
  prods: IProdCart[];
  addProd: (prod: IProdCart) => void;
  clearProd: (prod: IProdCart) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  prods: [],
  addProd: (prod) => set((state) => {
    const exists = state.prods.find(p => p.id === prod.id);
    if (exists) {
      return {
        prods: state.prods.map((p) =>
          p.id === prod.id
            ? { ...p, stock_order: p.stock_order + 1 }
            : p
        ),
      };
    }
    return { prods: [...state.prods, prod] };
  }),
  clearProd: (prod) => set((state) => ({
    prods: state.prods.filter(p => p.id !== prod.id)
  })),
  clearCart: () => set({ prods: [] }),
  increaseProd: (id: number) =>
    set((state) => ({
      prods: state.prods.map(p =>
        p.id === id ? { ...p, stock_order: p.stock_order + 1 } : p
      ),
    })),
  decreaseProd: (id: number) =>
    set((state) => ({
      prods: state.prods
        .map(p =>
          p.id === id ? { ...p, stock_order: Math.max(p.stock_order - 1, 1) } : p
        )
        .filter(p => p.stock_order > 0),
    })),

}));
