'use client';

import { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { PlusCircle, Edit, ArrowLeft, Trash } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/axios';

interface Product {
    id: number;
    name: string;
    description: string;
    image?: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [form] = Form.useForm();
    const { token, user } = useAuthStore();
    const router = useRouter();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products', {
                params: { page: 1, limit: 20, sort: 'DESC' },
            }
            );
            setProducts(res.data.items);
        } catch {
            message.error('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSave = async (values: any) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (editing) {
                await api.put(`/products/${editing.id}`, values, config);
                message.success('Producto actualizado');
            } else {
                await api.post('/products', values, config);
                message.success('Producto creado');
            }
            setModalOpen(false);
            form.resetFields();
            setEditing(null);
            fetchProducts();
        } catch {
            message.error('Error al guardar producto');
        }
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: '¿Eliminar producto?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            async onOk() {
                try {
                    await api.delete(`/products/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    message.success('Producto eliminado');
                    fetchProducts();
                } catch {
                    message.error('Error al eliminar producto');
                }
            },
        });
    };

    if (!user?.isAdmin) {
        return (
            <div className="text-center p-10 text-gray-500">
                No tenés permisos para acceder a esta página.
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-2">
                    <Button
                        icon={<ArrowLeft size={16} />}
                        className='custom-amber-btn'
                        onClick={() => router.push('/admin')}
                    >
                        Volver al panel
                    </Button>

                    <h1 className="text-2xl font-semibold text-amber-800">🛒 Productos</h1>
                </div>
                <Button
                    type="default"
                    icon={<PlusCircle size={18} />}
                    className='custom-amber-btn'
                    onClick={() => {
                        setEditing(null);
                        form.resetFields();
                        setModalOpen(true);
                    }}
                >
                    Nuevo producto
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="border rounded-lg shadow-sm p-4 hover:shadow-md transition"
                    >
                        <h2 className="font-semibold text-lg">{p.name}</h2>
                        <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                        <div className="flex justify-end mt-3">
                            <div className='pr-2'>
                            <Button
                                icon={<Edit size={16} />}
                                className='custom-amber-btn'
                                onClick={() => {
                                    setEditing(p);
                                    form.setFieldsValue(p);
                                    setModalOpen(true);
                                }}
                            >
                                Editar
                            </Button> </div>
                            <Button
                                icon={<Trash size={16} />}
                                danger
                                className="custom-amber-btn"
                                onClick={() => handleDelete(p.id)}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                title={editing ? 'Editar producto' : 'Nuevo producto'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => form.submit()}
                okText="Guardar"
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item
                        label="Nombre"
                        name="name"
                        rules={[{ required: true, message: 'El nombre es obligatorio' }]}
                    >
                        <Input placeholder="Ej. Café 250g" />
                    </Form.Item>
                    <Form.Item label="Descripción" name="description">
                        <Input.TextArea rows={3} placeholder="Descripción breve" />
                    </Form.Item>
                    <Form.Item label="Imagen (URL)" name="image">
                        <Input placeholder="https://..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
