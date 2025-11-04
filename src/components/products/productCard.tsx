'use client';

import React from 'react';
import { Card, Button } from 'antd';
import type { ProductCardProps } from './interface/prod.interface';

const ProductCard: React.FC<ProductCardProps> = ({
    name,
    price,
    stock,
    image,
    onAdd,
}) => {
    const defaultImage = '/productsimg.jpg'; 
    const imageSrc = image && image.trim() !== '' ? image : defaultImage;

    return (
        <Card
            hoverable
            cover={
                <img
                    src={imageSrc}
                    alt={name}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            }
            className="shadow-md hover:shadow-2xl rounded-lg transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-lg text-(--color-primary) truncate">
                    {name}
                </h3>

                <p className="text-gray-700 font-medium">Precio: ${price}</p>

                <p
                    className={`text-sm ${stock > 0 ? 'text-gray-500' : 'text-red-500 font-semibold'
                        }`}
                >
                    {stock > 0 ? `${stock} en stock` : 'Sin stock'}
                </p>

                <Button
  type="primary"
  onClick={onAdd}
  disabled={stock <= 0}
  className="mt-2 w-full text-white border-none disabled:opacity-70"
  style={{
    backgroundColor: 'var(--color-primary)',
    border: 'none',
  }}
  onMouseEnter={(e) =>
    ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
      'var(--color-primary-hover)')
  }
  onMouseLeave={(e) =>
    ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
      'var(--color-primary)')
  }
>
  {stock > 0 ? 'Agregar al carrito' : 'Agotado'}
</Button>

            </div>
        </Card>
    );
}

export default ProductCard;
