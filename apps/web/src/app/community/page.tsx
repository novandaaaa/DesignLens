'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

import ScrollFloat from '@/components/ScrollFloat';

export default function CommunityPage() {
  const { user, isAuthenticated } = useAuth();
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
    <div className="min-h-screen relative z-10 flex flex-col">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-transparent sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" data-cursor-target="true" className="cursor-target flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#8A2BE1] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">
              Design<span className="text-[#8A2BE1]">Lens</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard" data-cursor-target="true" className="cursor-target text-sm text-white/60 hover:text-white transition-colors">
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 cyber-cut bg-[#8A2BE1] text-white text-sm font-medium"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Transparent Hero Area (shows Dither) */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex justify-center">
          <ScrollFloat textClassName="text-white" stagger={0.03} animationDuration={1}>Community Feed</ScrollFloat>
        </h1>
        <p className="text-white/60 text-lg">Berikan feedback untuk desain website yang dipublikasikan</p>
      </div>

      {/* Solid Background Content Area (like Footer/HowItWorks) */}
      <div className="flex-1 bg-[#0A0A0A] border-t border-white/5 pt-12 pb-24 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto px-6">

        {/* Mobile App Style Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white tracking-wide">{user?.name || 'Community'}</h2>
          <div className="flex items-center gap-5 text-white">
            <button data-cursor-target="true" className="cursor-target hover:text-white/70 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button data-cursor-target="true" className="cursor-target hover:text-white/70 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="19" cy="12" r="1" fill="currentColor" />
                <circle cx="5" cy="12" r="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#8A2BE1] border-t-transparent cyber-cut-sm animate-spin" />
          </div>
        ) : feed.data.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">👥</div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Belum ada postingan</h2>
            <p className="text-text-secondary">Jadilah yang pertama mempublikasikan website untuk mendapatkan feedback!</p>
          </div>
        ) : (
          <div className="flex flex-col rounded-3xl border border-border overflow-hidden bg-surface-100/20 backdrop-blur-md">
            {feed.data.map((post: any, index: number) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                data-cursor-target="true"
                className={`cursor-target p-6 hover:bg-white/5 transition-colors group ${
                  index !== feed.data.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 cyber-cut-sm bg-[#8A2BE1] flex items-center justify-center text-white font-bold shrink-0 shadow-lg">
                        {post.website?.user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-text-primary">{post.website?.user?.name}</span>
                        <span className="text-xs text-text-tertiary ml-2">
                          {new Date(post.publishedAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-text-primary group-hover:text-[#C5ABF2] transition-colors mb-1">
                      {post.website?.title}
                    </h3>
                    <span className="text-sm text-[#C5ABF2] truncate block">{post.website?.url}</span>

                    {post.website?.description && (
                      <p className="text-sm text-text-secondary mt-3 line-clamp-3 leading-relaxed">{post.website.description}</p>
                    )}

                    <div className="flex items-center gap-4 mt-4">
                      <span className="px-3 py-1 cyber-cut-sm bg-[#8A2BE1]/10 text-[#C5ABF2] text-xs font-semibold">
                        {post.website?.category?.name}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-text-tertiary font-medium">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        {post._count?.comments ?? 0}
                      </span>
                    </div>
                  </div>
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
              className="px-4 py-2 cyber-cut border border-border text-sm text-text-secondary hover:text-text-primary disabled:opacity-30 transition-all"
            >
              ← Sebelumnya
            </button>
            <span className="text-sm text-text-tertiary">
              {page} / {feed.meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(feed.meta.totalPages, p + 1))}
              disabled={page === feed.meta.totalPages}
              className="px-4 py-2 cyber-cut border border-border text-sm text-text-secondary hover:text-text-primary disabled:opacity-30 transition-all"
            >
              Selanjutnya →
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
