'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '@/src/lib/types';

export default function StoreCard({ store }: { store: Store }) {
  // si el store no tiene imagen, usamos una por defecto
  const imageSrc = store.image && store.image.trim() !== ''
    ? store.image
    : '/tienda.jpg';

  return (
    <Link href={`/stores/${store.id}`} className="block">
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden">
        <div className="relative w-full h-40">
          <Image
            src={imageSrc}
            alt={store.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-(--color-primary) text-lg truncate">
            {store.name}
          </h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {store.description || 'Sin descripción disponible'}
          </p>
        </div>
      </div>
    </Link>
  );
}
