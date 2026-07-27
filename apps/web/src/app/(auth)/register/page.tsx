'use client';

import Link from 'next/link';
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
        <div className="absolute top-[10%] right-[20%] w-500px h-500px rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[20%] w-400px h-400px rounded-full bg-brand-600/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-500 to-brand-400 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </div>
          <span className="text-xl font-bold text-text-primary">
            Design<span className="gradient-text">Lens</span>
          </span>
        </Link>

        {/* Card */}
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-text-primary text-center mb-2">Buat Akun</h1>
          <p className="text-text-secondary text-center mb-8">Mulai evaluasi desain website Anda</p>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
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
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border focus::border-brand:500 placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
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
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border focus::border-brand:500 placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
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
                className="w-full px-4 py-3 rounded-xl bg-surface-100 border focus::border-brand:500 placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                placeholder="Minimal 6 karakter"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-linear-to-r from-brand-500 to-brand-400 text-white font-semibold hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
