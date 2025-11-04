'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  lastPage: number;
  onPageChange: (p: number) => void;
}

export default function Pagination({ page, lastPage, onPageChange }: Props) {
  const handlePrev = () => onPageChange(Math.max(1, page - 1));
  const handleNext = () => onPageChange(Math.min(lastPage, page + 1));
  return (
    <div className="flex items-center justify-center gap-3 mt-6 select-none">
      <button
        onClick={handlePrev}
        disabled={page <= 1}
        className="flex items-center gap-1 rounded-full border border-amber-900 bg-amber-900/20 px-3 py-2 text-sm font-medium text-amber-900 shadow-sm transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      <span className="rounded-full bg-amber-900/20 px-4 py-2 text-sm font-semibold text-amber-900 shadow-inner">
        Página {page} de {lastPage}
      </span>

      <button
        onClick={handleNext}
        disabled={page >= lastPage}
        className="flex items-center gap-1 rounded-full border border-amber-900 bg-amber-900/20 px-3 py-2 text-sm font-medium text-amber-900 shadow-sm transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
