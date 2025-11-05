'use client';

import { useEffect, useState } from 'react';
import { Button, Modal, Table, Space, InputNumber } from 'antd';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/src/store/useAuthStore';
import { getStoreProducts, deleteStoreProduct, updateStoreProduct } from '@/src/lib/axios/services/storeProducts';
import toast from 'react-hot-toast';
import AdminNavbar from '@/src/components/layouts/adminNavBar';
import type { StoreProduct } from '@/src/lib/types';

export default function StoreProductsPage() {
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();
  const params = useParams();
  const { token, user } = useAuthStore();
  const storeId = Number(params?.id);

  const [items, setItems] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreProduct | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  const fetchStoreProducts = async () => {
    try {
      setLoading(true);
      const data = await getStoreProducts(storeId, 1, 100);
      setItems(data.items || []);
    } catch (err) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) router.push('/login');
    else if (!user.isAdmin) router.push('/stores');
  }, [user, router]);

  useEffect(() => {
    if (token && storeId) fetchStoreProducts();
  }, [token, storeId]);

  const handleDelete = (spId: number) => {
    console.log('🧨 handleDelete fired for', spId);
    modal.confirm({
      title: '¿Eliminar producto de la tienda?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      async onOk() {
        try {
          console.log('✅ Confirm pressed for', spId);
          await deleteStoreProduct(storeId, spId);
          setItems((prev) => prev.filter((item) => item.id !== spId));
          toast.success('🧹 Producto eliminado');
          fetchStoreProducts();
        } catch (err: any) {
          console.error('Error al eliminar:', err.response?.data || err.message);
          toast.error('❌ Error al eliminar');
        }
      },
    });
  };

  const handleEdit = (item: StoreProduct) => {
    setEditingItem(item);
    setEditPrice(item.price);
    setEditStock(item.stock);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      await updateStoreProduct(storeId, editingItem.id, {
        price: Number(editPrice),
        stock: Number(editStock),
      });

      toast.success('✅ Producto actualizado');
      setEditingItem(null);
      fetchStoreProducts();
    } catch (err: any) {
      console.error('Error al actualizar:', err.response?.data || err.message);
      toast.error('❌ Error al actualizar');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    {
      title: 'Nombre',
      render: (item: StoreProduct) => item.product?.name ?? '—',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      render: (price: unknown) => {
        const numericPrice = Number(price);
        return isNaN(numericPrice) ? '—' : `$${numericPrice.toFixed(2)}`;
      },
    },

    {
      title: 'Stock',
      dataIndex: 'stock',
    },
    {
      title: 'Acciones',
      render: (item: StoreProduct) => (
        <Space>
          <Button
            icon={<Edit size={16} />}
            className="custom-amber-btn"
            onClick={() => handleEdit(item)}
            type="link"
          />
          <Button
            icon={<Trash size={16} />}
            danger
            className="custom-amber-btn"
            onClick={() => handleDelete(item.id)}
            type="primary"
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <AdminNavbar />
      {contextHolder}
      <div className="p-8 pt-24">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button
              icon={<ArrowLeft size={16} />}
              className="custom-amber-btn"
              onClick={() => router.push('/admin/stores')}
            >
              Volver a Tiendas
            </Button>
            <h1 className="text-2xl text-amber-800 font-semibold ml-2">
              Productos de la Tienda #{storeId}
            </h1>
          </div>
        </div>

        <Table
          dataSource={items}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 20 }}
          className="shadow rounded-lg"
        />

        {/* 🪶 Modal de edición */}
        <Modal
          title="Editar Producto"
          open={!!editingItem}
          onCancel={() => setEditingItem(null)}
          onOk={handleSaveEdit}
          okText="Guardar"
        >
          {editingItem && (
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-1">Producto:</p>
                <p>{editingItem.product?.name ?? '—'}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Precio:</p>
                <InputNumber
                  value={editPrice}
                  onChange={(val) => setEditPrice(val || 0)}
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="$"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Stock:</p>
                <InputNumber
                  value={editStock}
                  onChange={(val) => setEditStock(val || 0)}
                  min={0}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}