'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginRequest } from '@/src/lib/auth/auth.service';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginRequest({ email, password });

      const token = res.accessToken || res.access_token;
      if (!token) throw new Error('Token no recibido del servidor');

      setAuth(token, res.user);

      toast.success('¡Inicio de sesión exitoso!');

      if (res.user?.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/stores');
      }

    } catch (err) {
      toast.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 space-y-4"
    >
      <h1 className="text-2xl font-semibold text-center text-(--color-primary)">
        Iniciar Sesión
      </h1>

      <div>
        <label className="block text-(--color-primary) mb-2">Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          placeholder="usuario@correo.com"
          required
        />
      </div>

      <div>
        <label className="block text-(--color-primary) mb-2">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          placeholder="********"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-(--color-primary) text-white py-2 rounded-md hover:bg-(--color-primary-hover) transition disabled:opacity-70"
      >
        {loading ? 'Cargando...' : 'Entrar'}
      </button>
    </form>
  );
}
