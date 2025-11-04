'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Button } from 'antd';
import { Store, Package, ShoppingBag, ShoppingCart } from 'lucide-react'; 

export default function AdminHome() {
  const { user, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
    if (!user) router.replace('/login');
    else if (!user.isAdmin) router.replace('/stores');
  }, [user, initialized, router]);

  if (!initialized) return <div className="p-10 text-center">Cargando...</div>;
  if (!user?.isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
      <h1 className="text-4xl text-amber-900 font-semibold mb-8 text-center">
        Panel de Administración
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button
          type="default"
          size="large"
          icon={<Store size={20} />}
          className="btn-amber"
          onClick={() => router.push('/admin/stores')}
        >
          Gestionar Tiendas
        </Button>

        <Button
          type="default"
          size="large"
          icon={<Package size={20} />}
          className="btn-amber"
          onClick={() => router.push('/admin/products')}
        >
          Gestionar Productos
        </Button>

        <Button
          type="default"
          size="large"
          icon={<ShoppingCart size={20} />}
          className="btn-amber"
          onClick={() => router.push('/admin/store-products')}
        >
          Productos por Tienda
        </Button>

        <Button
          type="default"
          size="large"
          icon={<ShoppingBag size={20} />}
          className="btn-amber"
          onClick={() => router.push('/stores')}
        >
          Ver catálogo público
        </Button>
      </div>
    </div>
  );
}
