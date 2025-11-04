import api from '../../axios';
import { Store, Paged } from '../../types'; 

export async function getStores(page = 1, limit = 20, q?: string): Promise<Paged<Store>> {
  const res = await api.get('/stores', { params: { page, limit, q } });
  return res.data;
}

export async function getStore(id: number): Promise<Store> {
  const res = await api.get(`/stores/${id}`);
  return res.data;
}

export async function deleteStore(id: number) {
  const res = await api.delete(`/stores/${id}`); 
  return res.data;
}