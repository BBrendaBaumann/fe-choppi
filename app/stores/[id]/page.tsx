'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getStore } from '@/src/lib/axios/services/stores';
import { getStoreProducts } from '@/src/lib/axios/services/storeProducts';
import { quoteCart, CartItem } from '@/src/lib/axios/services/cart';
import ProductCard from '@/src/components/products/productCard';
import Pagination from '@/src/components/pagination/pagination';
import SearchBar from '@/src/components/searchBar/searchBar';
import CartSidebar from '@/src/components/cart/cartSideBar';
import { StoreProduct } from '@/src/lib/types';
import { useCartStore } from '@/src/store/cartStore';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/src/components/layouts/adminNavBar';

export default function StoreDetailPage() {
    const router = useRouter();
    const params = useParams();
    const storeId = Number(params?.id);
    const [storeName, setStoreName] = useState('');
    const [q, setQ] = useState('');
    const [inStock, setInStock] = useState(false);
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<StoreProduct[]>([]);
    const [lastPage, setLastPage] = useState(1);
    const limit = 20;

    const addToCartGlobal = useCartStore(state => state.addProd);

    useEffect(() => {
        if (!storeId || Number.isNaN(storeId)) return;
        (async () => {
            const s = await getStore(storeId);
            setStoreName(s.name);
        })();
    }, [storeId]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await getStoreProducts(storeId, page, limit, q || undefined, inStock || undefined);
                if (cancelled) return;
                setItems(res.items);
                setLastPage(res.lastPage);
            } catch (err) {
                console.error(err);
            }
        })();
        return () => { cancelled = true; };
    }, [storeId, page, q, inStock]);


    async function handleAddToCart(sp: StoreProduct) {
        const payload: CartItem[] = [{ storeProductId: sp.id, quantity: 1 }];
        try {
            await quoteCart(payload);
            toast.success(`${sp.product?.name} agregado al carrito 🛒`);
            addToCartGlobal({
                id: sp.id,
                name: sp.product?.name || '',
                price: Number(sp.price),
                stock_order: 1,
                imgs: [sp.product?.image || '/productsimg.jpg'],
            });
        } catch (err) {
            console.error(err);
            toast.error('Error al agregar al carrito');
        }
    }

    return (
        <>
      <AdminNavbar />
        <div className="container mx-auto p-6 pt-24">
            <Toaster position="top-right" />
            <button
        onClick={() => router.push("/stores")}
        className="text-amber-700 hover:underline cursor-pointer"
      >
        ← Volver
      </button>
            <h1 className="h4 mb-4">{storeName || `Tienda ${storeId}`}</h1>


            <div className="flex gap-4 items-center mb-4">
                <div className="flex-1">
                    <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} />
                </div>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={inStock} onChange={(e) => { setInStock(e.target.checked); setPage(1); }} />
                    <span className="text-sm">Sólo en stock</span>
                </label>
            </div>

            {items.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((sp) => (
                            <ProductCard
                                key={sp.id}
                                name={sp.product?.name ?? `Producto ${sp.productId}`}
                                price={Number(sp.price)}
                                stock={sp.stock}
                                image={sp.product?.image ?? '/productsimg.jpg'}
                                onAdd={() => handleAddToCart(sp)}
                            />
                        ))}
                    </div>

                    <div className="mt-8">
                        <Pagination page={page} lastPage={lastPage} onPageChange={setPage} />
                    </div>
                </>
            ) : (
                <p className="text-gray-600 text-center mt-10">No se encontraron productos.</p>
            )}

            <CartSidebar />
        </div>
        </>
    );
}
