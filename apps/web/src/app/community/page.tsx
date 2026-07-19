'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function CommunityPage() {
  const { isAuthenticated } = useAuth();
  const [feed, setFeed] = useState<any>({ data: [], meta: { total: 0, page: 1, totalPages: 1 } });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getCommunityFeed(page);
      setFeed(data);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFeed();
  }, [loadFeed]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-surface-0/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-500 to-purple-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <span className="text-lg font-bold text-text-primary">
              Design<span className="gradient-text">Lens</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-linear-to-r from-brand-500 to-purple-500 text-white text-sm font-medium"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Community Feed</h1>
          <p className="text-text-secondary">Berikan feedback untuk desain website yang dipublikasikan</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : feed.data.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">👥</div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Belum ada postingan</h2>
            <p className="text-text-secondary">Jadilah yang pertama mempublikasikan website untuk mendapatkan feedback!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {feed.data.map((post: any) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="glass-card p-6 hover:border-brand-500/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {post.website?.user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-text-primary">{post.website?.user?.name}</span>
                        <span className="text-xs text-text-tertiary ml-2">
                          {new Date(post.publishedAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-text-primary group-hover:text-brand-400 transition-colors mb-1">
                      {post.website?.title}
                    </h3>
                    <span className="text-sm text-brand-400 truncate block">{post.website?.url}</span>

                    {post.website?.description && (
                      <p className="text-sm text-text-secondary mt-2 line-clamp-2">{post.website.description}</p>
                    )}

                    <div className="flex items-center gap-4 mt-4">
                      <span className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 text-xs font-medium">
                        {post.website?.category?.name}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-text-tertiary">
                        💬 {post._count?.comments ?? 0} komentar
                      </span>
                    </div>
                  </div>

                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary group-hover:text-brand-400 transition-colors shrink-0 mt-2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {feed.meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-border text-sm text-text-secondary hover:text-text-primary disabled:opacity-30 transition-all"
            >
              ← Sebelumnya
            </button>
            <span className="text-sm text-text-tertiary">
              {page} / {feed.meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(feed.meta.totalPages, p + 1))}
              disabled={page === feed.meta.totalPages}
              className="px-4 py-2 rounded-xl border border-border text-sm text-text-secondary hover:text-text-primary disabled:opacity-30 transition-all"
            >
              Selanjutnya →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
