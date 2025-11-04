'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loadAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    if (!user) router.push('/login');
    else if (!user.isAdmin) router.push('/stores');
  }, [user, router]);

  return <main className="min-h-screen bg-amber-50">{children}</main>;
}
