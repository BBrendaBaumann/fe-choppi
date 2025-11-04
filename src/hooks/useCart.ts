import { useState } from 'react';
import { CartItem, quoteCart } from '../lib/axios/services/cart'; 

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  async function quote() {
    return quoteCart(items);
  }

  function add(item: CartItem) {
    setItems((s) => {
      const found = s.find((x) => x.storeProductId === item.storeProductId);
      if (found) return s.map((x) => (x.storeProductId === item.storeProductId ? { ...x, quantity: x.quantity + item.quantity } : x));
      return [...s, item];
    });
  }

  function clear() { setItems([]); }

  return { items, add, clear, quote };
}
