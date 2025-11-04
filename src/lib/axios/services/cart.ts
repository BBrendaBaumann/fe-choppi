import api from "../../axios";

export interface CartItem {
  storeProductId: number;
  quantity: number;
}

export async function quoteCart(items: CartItem[]) {
  const res = await api.post('/cart/quote', items);
  return res.data;
}
