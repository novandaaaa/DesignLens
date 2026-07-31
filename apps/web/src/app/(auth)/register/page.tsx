'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[10%] right-[20%] w-500px h-500px cyber-cut-sm bg-[#0a2615]/15 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[20%] w-400px h-400px cyber-cut-sm bg-[#0a2615]/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="cursor-target flex items-center gap-3 justify-center mb-8 group shrink-0">
          <Image 
            src="/logo_DesignLens.png" 
            alt="DesignLens Logo"
            width={40}
            height={40}
            className="object-contain transition-transform duration-300 group-hover:scale-110 shrink-0 mix-blend-screen"
            priority
          />
          <span className="text-2xl font-bold text-[#8A2BE1]">DesignLens</span>
        </Link>

        {/* Card */}
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-text-primary text-center mb-2">Buat Akun</h1>
          <p className="text-text-secondary text-center mb-8">Mulai evaluasi desain website Anda</p>

          {error && (
            <div className="mb-6 p-3 cyber-cut bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className="w-full px-4 py-3 cyber-cut bg-surface-100 border border-border focus:outline-none focus:ring-2 focus:ring-[#8A2BE1]/50 focus:border-[#8A2BE1] placeholder:text-text-tertiary transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 cyber-cut bg-surface-100 border border-border focus:outline-none focus:ring-2 focus:ring-[#8A2BE1]/50 focus:border-[#8A2BE1] placeholder:text-text-tertiary transition-all"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 cyber-cut bg-surface-100 border border-border focus:outline-none focus:ring-2 focus:ring-[#8A2BE1]/50 focus:border-[#8A2BE1] placeholder:text-text-tertiary transition-all"
                placeholder="Minimal 6 karakter"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 cyber-cut bg-[#8A2BE1] text-[#F9F9FD] font-semibold hover:shadow-lg hover:shadow-[#8A2BE1]/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#8A2BE1] hover:text-[#8A2BE1]/80 font-medium transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
