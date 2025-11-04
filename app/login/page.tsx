'use client';
import LoginForm from '@/src/components/auth/loginForm';
import LoginLayout from '@/src/components/layouts/loginLayout';

export default function LoginPage() {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}
