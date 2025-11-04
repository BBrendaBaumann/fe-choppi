'use client';

import { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import { ArrowLeft, Package } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/axios';
import toast from 'react-hot-toast';
import AdminNavbar from '@/src/components/layouts/adminNavBar';

interface Store {
  id: number;
  name: string;
  description: string;
}

export default function StoreProductsListPage() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) router.push('/login');
    else if (!user.isAdmin) router.push('/stores');
  }, [user, router]);

  useEffect(() => {
    if (token) fetchStores();
  }, [token]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stores');
      setStores(res.data.items || []);
    } catch (error) {
      toast.error('Error al cargar tiendas');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Descripción', dataIndex: 'description' },
    {
      title: 'Acción',
      render: (store: Store) => (
        <Button
          icon={<Package size={16} />}
          className='custom-amber-btn'
          onClick={() => router.push(`/admin/stores/${store.id}/products`)}
        >
          Ver Productos
        </Button>
      ),
    },
  ];

  return (
    <>
      <AdminNavbar />
      <div className="p-8 pt-24">
        <div className="flex items-center gap-2 mb-6">
          <Button
            icon={<ArrowLeft size={16} />}
            className='custom-amber-btn'
            onClick={() => router.push('/admin')}
          >
            Volver al panel
          </Button>
          <h1 className="text-2xl text-amber-800 font-semibold ml-2">
            Productos por Tienda
          </h1>
        </div>

        <Table
          dataSource={stores}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="shadow rounded-lg"
        />
      </div>
    </>
  );
}