export interface Store {
  id: number;
  name: string;
  description?: string;
  image?: string;
  active?: boolean;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  image?: string | null;
  barcode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreProduct {
  id: number;
  storeId: number;
  productId: number;
  product?: Product;
  price: number;
  stock: number;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  limit?: number;
  lastPage: number;
}
