'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import Link from 'next/link';

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user?.isAdmin) return null;

  return (
    <nav className="fixed top-0 left-0 w-full bg-amber-800/40 border-b border-amber-500 text-white shadow-md z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/admin" className="font-semibold text-lg">
          🧭 Panel Admin
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-amber-800 transition"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col px-4 pb-4 gap-2 bg-amber-800">
          <button
            onClick={() => router.push('/admin/stores')}
            className="text-left py-2 hover:bg-amber-700 rounded px-2"
          >
            🏬 Administrar Tiendas
          </button>
          <button
            onClick={() => router.push('/admin/products')}
            className="text-left py-2 hover:bg-amber-700 rounded px-2"
          >
            📦 Administrar Productos
          </button>
          <button
            onClick={() => router.push('/stores')}
            className="text-left py-2 hover:bg-amber-700 rounded px-2"
          >
            🌐 Ver Catálogo Público
          </button>
        </div>
      )}
    </nav>
  );
}