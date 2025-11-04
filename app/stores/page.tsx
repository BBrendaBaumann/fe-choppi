'use client';
import { useEffect, useState } from 'react';
import { getStores } from '@/src/lib/axios/services/stores'; 
import { Store } from '@/src/lib/types'; 
import SearchBar from '@/src/components/searchBar/searchBar';
import StoreCard from '@/src/components/stores/storeCard';
import Pagination from '@/src/components/pagination/pagination';
import { useAuthStore } from '@/src/store/useAuthStore';
import AdminNavbar from '@/src/components/layouts/adminNavBar';

export default function StoresPage() {
  const { user } = useAuthStore();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [stores, setStores] = useState<Store[]>([]);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getStores(page, limit, q || undefined);
        if (cancelled) return;
        setStores(res.items);
        setTotal(res.total);
        setLastPage(res.lastPage);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => { cancelled = true; };
  }, [page, q]);

  return (
    <>
      <AdminNavbar />
    <div className="container mx-auto p-6 pt-24">
      {user?.isAdmin && (
        <p className="text-sm text-amber-800 mb-2">
          Estás navegando como <strong>administrador</strong>
        </p>
      )}
      <h1 className="h4 mb-4">Tiendas</h1>

      <div className="mb-6">
        <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stores.map((s) => <StoreCard key={s.id} store={s} />)}
      </div>

      <Pagination page={page} lastPage={lastPage} onPageChange={setPage} />
    </div>
    </>
  );
}
