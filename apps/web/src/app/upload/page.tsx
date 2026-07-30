'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

export default function UploadPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const [form, setForm] = useState({
    title: '',
    url: '',
    categoryId: '',
    description: '',
    targetAudience: '',
    feedbackFocus: '',
    reviewType: 'both' as 'ai' | 'community' | 'both',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.url && files.length === 0) {
      setError('Harap masukkan URL atau unggah minimal satu foto website.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('categoryId', form.categoryId);
      if (form.url) formData.append('url', form.url);
      if (form.description) formData.append('description', form.description);
      if (form.targetAudience) formData.append('targetAudience', form.targetAudience);
      if (form.feedbackFocus) formData.append('feedbackFocus', form.feedbackFocus);
      
      files.forEach((file) => {
        formData.append('files', file);
      });

      const website = await api.createWebsite(formData);

      // Trigger AI review if selected
      if (form.reviewType === 'ai' || form.reviewType === 'both') {
        await api.triggerAiReview(website.id).catch(console.error);
      }

      // Publish to community if selected
      if (form.reviewType === 'community' || form.reviewType === 'both') {
        await api.publishToFeed(website.id).catch(console.error);
      }

      router.push(`/review/${website.id}`);
    } catch (err: any) {
      setError(err.message || 'Gagal upload website');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-linear-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/60" />

      {/* Navbar matching Dashboard */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-500">
        <div className="mx-auto px-6 py-3.5 rounded-2xl backdrop-blur-2xl border border-[#F9F9FD]/10 bg-[#0A0A0A]/60 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" data-cursor-target="true" className="cursor-target flex items-center gap-3 group shrink-0">
              <Image 
                src="/logo_DesignLens.png" 
                alt="DesignLens Logo"
                width={40}
                height={40}
                className="object-contain transition-transform duration-300 group-hover:scale-110 shrink-0 mix-blend-screen"
                priority
              />
              <span className="text-2xl font-bold text-[#8A2BE1] hidden sm:block">DesignLens</span>
            </Link>

            <div className="flex items-center gap-4 shrink-0">
              <Link href="/dashboard" data-cursor-target="true" className="cursor-target text-sm text-[#F9F9FD]/70 hover:text-[#F9F9FD] transition-colors hidden sm:block">
                Dashboard
              </Link>
              <div className="h-6 w-px bg-[#F9F9FD]/10 hidden sm:block" />
              <div className="flex items-center gap-3">
                <Link href={`/profile/${user?.id}`} className="cursor-target flex items-center gap-3 group/profile">
                  <div className="w-9 h-9 rounded-xl bg-[#8A2BE1]/20 border border-[#8A2BE1]/40 flex items-center justify-center text-[#8A2BE1] text-sm font-bold shadow-lg shadow-[#8A2BE1]/10 group-hover/profile:border-[#8A2BE1] transition-all">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm text-[#F9F9FD] font-medium hidden sm:block group-hover/profile:text-white transition-colors">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="cursor-target text-xs text-[#F9F9FD]/50 hover:text-red-400 transition-colors ml-2"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-[#F9F9FD] mb-4">Upload Website</h1>
          <p className="text-[#F9F9FD]/60 text-lg">Masukkan informasi website yang ingin Anda evaluasi</p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl">
            <div className="space-y-6">
              {/* URL */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-[#F9F9FD]/80 mb-2">
                  URL Website <span className="text-[#F9F9FD]/40 font-normal">(Opsional jika mengunggah foto)</span>
                </label>
                <input
                  id="url"
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#8A2BE1] placeholder:text-[#F9F9FD]/30 text-[#F9F9FD] focus:outline-none focus:ring-2 focus:ring-[#8A2BE1]/50 transition-all"
                  placeholder="https://example.com"
                />
              </div>

              {/* Photos */}
              <div>
                <label htmlFor="photos" className="block text-sm font-medium text-[#F9F9FD]/80 mb-2">
                  Foto Website <span className="text-[#F9F9FD]/40 font-normal">(Opsional jika mengisi URL)</span>
                </label>
                <input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFiles(Array.from(e.target.files));
                    }
                  }}
                  className="w-full px-5 py-3.5 rounded-xl bg-black/40 border border-white/10 text-sm text-[#F9F9FD]/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8A2BE1]/20 file:text-[#C5ABF2] hover:file:bg-[#8A2BE1]/30 focus:outline-none focus:border-[#8A2BE1] focus:ring-2 focus:ring-[#8A2BE1]/50 transition-all cursor-pointer"
                />
                {files.length > 0 && (
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {files.map((file, i) => (
                      <div key={i} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-[#F9F9FD]/50 mt-3">
                  Jika Anda tidak mengisi URL, AI akan mereview berdasarkan foto yang Anda unggah.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[#F9F9FD]/80 mb-2">
                  Judul Website <span className="text-red-400">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-5 py-3.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#8A2BE1] placeholder:text-[#F9F9FD]/30 text-[#F9F9FD] focus:outline-none focus:ring-2 focus:ring-[#8A2BE1]/50 transition-all"
                  placeholder="Nama website Anda"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[#F9F9FD]/80 mb-2">
                  Kategori <span className="text-red-400">*</span>
                </label>
                <select
                  id="category"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  required
                  className="w-full px-5 py-3.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#8A2BE1] text-[#F9F9FD] focus:outline-none focus:ring-2 focus:ring-[#8A2BE1]/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#1A1A1A]">Pilih kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#1A1A1A]">{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#F9F9FD]/80 mb-2">
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-5 py-3.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#8A2BE1] placeholder:text-[#F9F9FD]/30 text-[#F9F9FD] focus:outline-none focus:ring-2 focus:ring-[#8A2BE1]/50 transition-all resize-none"
                  placeholder="Jelaskan website Anda secara singkat"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label htmlFor="target" className="block text-sm font-medium text-[#F9F9FD]/80 mb-2">
                  Target Pengguna
                </label>
                <input
                  id="target"
                  type="text"
                  value={form.targetAudience}
                  onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#8A2BE1] placeholder:text-[#F9F9FD]/30 text-[#F9F9FD] focus:outline-none focus:ring-2 focus:ring-[#8A2BE1]/50 transition-all"
                  placeholder="Contoh: Mahasiswa, UMKM, Developer"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl">
            {/* Review Type */}
            <div>
              <label className="block text-sm font-medium text-[#F9F9FD]/80 mb-4">
                Metode Review <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: 'ai', label: '🤖 AI Review', desc: 'Evaluasi privat' },
                  { value: 'community', label: '👥 Community', desc: 'Feedback publik' },
                  { value: 'both', label: '✨ Keduanya', desc: 'AI + Community' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, reviewType: option.value as any })}
                    className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                      form.reviewType === option.value
                        ? 'border-[#8A2BE1] bg-[#8A2BE1]/20 shadow-[0_0_20px_rgba(138,43,225,0.15)] -translate-y-1'
                        : 'border-white/10 bg-black/20 hover:border-[#8A2BE1]/50 hover:bg-white/5'
                    }`}
                  >
                    <div className={`text-lg font-bold mb-1 ${form.reviewType === option.value ? 'text-white' : 'text-[#F9F9FD]'}`}>{option.label}</div>
                    <div className="text-sm text-[#F9F9FD]/50">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#8A2BE1] text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(138,43,225,0.4)] transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? 'Memproses...' : 'Upload & Mulai Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
