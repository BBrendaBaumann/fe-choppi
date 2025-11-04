'use client';

import { useEffect, useState } from 'react';
import { Button, Modal, Input, Table, Space, message } from 'antd';
import { ArrowLeft, Edit, Plus, Trash, Package } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/axios';
import toast from 'react-hot-toast';
import { deleteStore } from '@/src/lib/axios/services/stores';
import AdminNavbar from '@/src/components/layouts/adminNavBar';

interface Store {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
}


export default function AdminStoresPage() {
  const { user, token } = useAuthStore();
  const router = useRouter();

  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Store | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    if (!user) router.push('/login');
    else if (!user.isAdmin) router.push('/stores');
  }, [user, router]);

  useEffect(() => {
    console.log('🟠🟠🟠Token actual:', token);
    if (token) fetchStores();
  }, [token]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stores', {
        headers: {
          'Cache-Control': 'no-cache',
        },
        params: {
          t: Date.now(),
        },
      });
      setStores(res.data.items || []);
    } catch (error) {
      console.error('Error al cargar tiendas:', error);
      toast.error('Error al cargar tiendas');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (store?: Store) => {
    if (store) {
      setEditing(store);
      setForm({ name: store.name, description: store.description });
    } else {
      setEditing(null);
      setForm({ name: '', description: '' });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { name: form.name.trim(), description: form.description.trim() };
      if (!payload.name) return message.warning('El nombre es obligatorio');
      if (editing) {
        await api.put(`/stores/${editing.id}`, payload);
        message.success('Tienda actualizada');
      } else {
        console.log('Token actual:', token);

        await api.post('/stores', payload);
        message.success('Tienda creada');
      }
      setModalOpen(false);
      fetchStores();
    } catch {
      message.error('Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
  Modal.confirm({
    title: '¿Eliminar tienda?',
    content: 'Esta acción no se puede deshacer.',
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    async onOk() {
      try {
        const res = await deleteStore(id);
        console.log('🟢 DELETE response:', res);

        toast.success('🧹 Tienda eliminada con éxito', {
          duration: 2500,
          position: 'top-right',
          style: {
            background: '#fef3c7',
            color: '#92400e',
            border: '1px solid #f59e0b',
          },
        });

        await fetchStores(); 
      } catch (err: any) {
        console.error('Error al eliminar tienda:', err.response?.data || err.message);
        toast.error('❌ No se pudo eliminar la tienda');
      }
    },
  });
};

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Descripción', dataIndex: 'description' },
    {
      title: 'Acciones',
      render: (store: Store) => (
        <Space>
          <Button
            icon={<Package size={16} />}
            className='custom-amber-btn'
            onClick={() => router.push(`/admin/stores/${store.id}/products`)}
            type="link"
            title="Ver productos de esta tienda"
          >
            Productos        
          </Button>
          <Button
            icon={<Edit size={16} />}
            className='custom-amber-btn'
            onClick={() => openModal(store)}
            type="link"
          />          
        </Space>
      ),
    },
  ];

  return (
    <>
    <AdminNavbar />
    <div className="p-8 pt-24">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button
            icon={<ArrowLeft size={16} />}
            className='custom-amber-btn'
            onClick={() => router.push('/admin')}
          >
            Volver al panel
          </Button>
          <h1 className="text-2xl text-amber-800 font-semibold ml-2">Administrar Tiendas</h1>
        </div>
        <Button
          type="default"
          icon={<Plus size={18} />}
          className='custom-amber-btn'
          onClick={() => openModal()}
        >
          Nueva Tienda
        </Button>
      </div>

      <Table
        dataSource={stores}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        className="shadow rounded-lg"
      />

      <Modal
        title={editing ? 'Editar Tienda' : 'Nueva Tienda'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText={editing ? 'Guardar cambios' : 'Crear'}
      >
        <div className="space-y-3">
          <Input
            placeholder="Nombre de la tienda"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input.TextArea
            placeholder="Descripción"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </Modal>
    </div>
    </>
  );
}
