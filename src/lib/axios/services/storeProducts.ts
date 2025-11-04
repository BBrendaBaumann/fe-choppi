import api from "../../axios";
import { StoreProduct, Paged } from "../../types";

export async function getStoreProducts(storeId: number, page = 1, limit = 20, q?: string, inStock?: boolean) : Promise<Paged<StoreProduct>>{
  const res = await api.get(`/stores/${storeId}/products`, {
    params: { page, limit, q, inStock },
  });
  return res.data;
}

export async function deleteStoreProduct(
  storeId: number, 
  storeProductId: number
): Promise<{ success: boolean }> {
  const res = await api.delete(`/stores/${storeId}/products/${storeProductId}`);
  return res.data;
}

export async function updateStoreProduct(
  storeId: number,
  storeProductId: number,
  data: { price?: number; stock?: number }
): Promise<StoreProduct> {
  const res = await api.put(`/stores/${storeId}/products/${storeProductId}`, data);
  return res.data;
}