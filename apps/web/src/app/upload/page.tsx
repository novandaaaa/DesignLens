'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
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
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-border bg-surface-0/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Upload Website</h1>
        <p className="text-text-secondary mb-8">Masukkan informasi website yang ingin Anda evaluasi</p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-text-secondary mb-1.5">
              URL Website <span className="text-text-tertiary font-normal">(Opsional jika mengunggah foto)</span>
            </label>
            <input
              id="url"
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-100 border focus:border-brand-500 placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
              placeholder="https://example.com"
            />
          </div>

          {/* Photos */}
          <div>
            <label htmlFor="photos" className="block text-sm font-medium text-text-secondary mb-1.5">
              Foto Website <span className="text-text-tertiary font-normal">(Opsional jika mengisi URL)</span>
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
              className="w-full px-4 py-3 rounded-xl bg-surface-100 border text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-500/10 file:text-brand-400 hover:file:bg-brand-500/20 focus:outline-none focus:border-brand-500 transition-all"
            />
            {files.length > 0 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {files.map((file, i) => (
                  <div key={i} className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-text-tertiary mt-2">
              Jika Anda tidak mengisi URL, AI akan mereview berdasarkan foto yang Anda unggah.
            </p>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1.5">
              Judul Website <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-surface-100 border focus::border-brand:500 placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
              placeholder="Nama website Anda"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1.5">
              Kategori <span className="text-red-400">*</span>
            </label>
            <select
              id="category"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-surface-100 border text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1.5">
              Deskripsi
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-surface-100 border placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all resize-none"
              placeholder="Jelaskan website Anda secara singkat"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label htmlFor="target" className="block text-sm font-medium text-text-secondary mb-1.5">
              Target Pengguna
            </label>
            <input
              id="target"
              type="text"
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-100 border placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
              placeholder="Contoh: Mahasiswa, UMKM, Developer"
            />
          </div>

          {/* Review Type */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Metode Review <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: 'ai', label: '🤖 AI Review', desc: 'Evaluasi privat' },
                { value: 'community', label: '👥 Community', desc: 'Feedback publik' },
                { value: 'both', label: '✨ Keduanya', desc: 'AI + Community' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm({ ...form, reviewType: option.value as any })}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                    form.reviewType === option.value
                      ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10'
                      : 'border-border bg-surface-100 hover:border-brand-500/30'
                  }`}
                >
                  <div className="text-lg mb-1">{option.label}</div>
                  <div className="text-xs text-text-tertiary">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-brand-500 to-brand-400 text-white font-semibold text-lg hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Upload & Mulai Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
