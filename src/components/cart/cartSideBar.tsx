'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { CgShoppingCart } from 'react-icons/cg';
import { FaRegTrashAlt } from 'react-icons/fa';
import Image from 'next/image';
import { useCartStore } from '@/src/store/cartStore'; 
import toast, { Toaster } from 'react-hot-toast';

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { prods, clearProd, clearCart } = useCartStore();

  useEffect(() => setMounted(true), []);

  const sidebarContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="z-[999] fixed inset-0">
          <motion.div
            className="absolute inset-0 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          <motion.aside
            className="fixed top-0 right-0 z-50 flex flex-col bg-white shadow-xl w-[80%] md:w-96 h-full"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <header className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-lg text-chocolate">🛒 Carrito</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </header>

            <div className="flex flex-col flex-1 overflow-y-auto p-4 gap-3">
              {prods.length > 0 ? (
                prods.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-100 rounded-xl p-2"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.imgs[0] || '/productsimg.jpg'}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md"
                      />
                      <div>
                        <h6 className="font-medium text-sm">{item.name}</h6>
                        <p className="text-xs text-gray-600">
                          {item.stock_order} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <FaRegTrashAlt
                      onClick={() => clearProd(item)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Tu carrito está vacío.</p>
              )}
            </div>

            {prods.length > 0 && (
              <footer className="p-4 border-t flex flex-col gap-2">
                <button
                  onClick={() => {
                    toast.success('Pedido agregado correctamente');
                    clearCart();
                  }}
                  className="bg-chocolate text-white font-semibold w-full py-2 rounded-xl hover:bg-chocolate/80 transition"
                >
                  Ver subtotal
                </button>
                <button
                  onClick={clearCart}
                  className="bg-red-500 text-white font-semibold w-full py-2 rounded-xl hover:bg-red-600 transition"
                >
                  Vaciar carrito
                </button>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-amber-800/50 text-amber-900 p-3 rounded-full shadow-lg hover:bg-chocolate/80 transition mt-24"
      >
        <CgShoppingCart size={22} />
      </button>

      {mounted && createPortal(sidebarContent, document.body)}
    </>
  );
}
