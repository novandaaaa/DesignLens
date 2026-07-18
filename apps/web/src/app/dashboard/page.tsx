'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, isAuthenticated } = useAuth();
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadWebsites();
    }
  }, [isAuthenticated]);

  const loadWebsites = async () => {
    try {
      const data = await api.getMyWebsites();
      setWebsites(data);
    } catch (error) {
      console.error('Failed to load websites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <nav className="border-b border-border bg-surface-0/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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

          <div className="flex items-center gap-6">
            <Link href="/community" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Komunitas
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="text-sm text-text-primary font-medium hidden sm:block">{user?.name}</span>
              <button
                onClick={logout}
                className="text-xs text-text-tertiary hover:text-red-400 transition-colors ml-2"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-text-secondary mt-1">Kelola website dan lihat review Anda</p>
          </div>
          <Link
            href="/upload"
            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-brand-500 to-purple-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Upload Website
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Website', value: websites.length, icon: '🌐' },
            { label: 'AI Reviews', value: websites.filter((w) => w.aiReview).length, icon: '🤖' },
            { label: 'Community Posts', value: websites.filter((w) => w.communityPost?.status === 'PUBLISHED').length, icon: '👥' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center text-2xl">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Websites List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : websites.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Belum ada website</h2>
            <p className="text-text-secondary mb-6">Upload website pertama Anda untuk mulai mendapatkan feedback</p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 rounded-xl bg-linear-to-r from-brand-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-300"
            >
              Upload Website
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {websites.map((website) => (
              <Link
                key={website.id}
                href={`/review/${website.id}`}
                className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-brand-500/30 transition-all duration-300 group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary group-hover:text-brand-400 transition-colors truncate">
                    {website.title}
                  </h3>
                  <p className="text-sm text-text-tertiary truncate mt-0.5">{website.url}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 text-xs font-medium">
                      {website.category?.name}
                    </span>
                    <span className="text-xs text-text-tertiary">
                      {new Date(website.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {website.aiReview && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 border border-border">
                      <span className="text-sm">🤖</span>
                      <span className={`text-sm font-bold ${
                        website.aiReview.status === 'COMPLETED' ? 'text-accent-500' :
                        website.aiReview.status === 'PROCESSING' ? 'text-yellow-400' : 'text-text-tertiary'
                      }`}>
                        {website.aiReview.status === 'COMPLETED' ? website.aiReview.overallScore : website.aiReview.status}
                      </span>
                    </div>
                  )}
                  {website.communityPost?.status === 'PUBLISHED' && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 border border-border">
                      <span className="text-sm">💬</span>
                      <span className="text-sm font-bold text-text-primary">
                        {website.communityPost._count?.comments ?? 0}
                      </span>
                    </div>
                  )}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary group-hover:text-brand-400 transition-colors">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
