'use client';
import React from 'react';

interface Props {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value = '', onChange, placeholder = 'Buscar...' }: Props) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-(--color-primary)"
      />
    </div>
  );
}
