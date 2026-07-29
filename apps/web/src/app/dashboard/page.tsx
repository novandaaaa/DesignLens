'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import ScrollFloat from '@/components/ScrollFloat';
import AnimatedCounter from '@/components/AnimatedCounter';

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

  const loadWebsites = useCallback(async () => {
    try {
      const data = await api.getMyWebsites();
      setWebsites(data || []);
    } catch (error) {
      console.error('Failed to load websites:', error);
      setWebsites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadWebsites();
    }
  }, [isAuthenticated, loadWebsites]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#8A2BE1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const safeWebsites = websites || [];
  const avgScore = safeWebsites.length > 0
    ? Math.round(
        websites.reduce((acc, curr) => acc + (curr.aiReview?.score || curr.aiReview?.overallScore || 0), 0) /
          safeWebsites.filter((w: any) => w.aiReview).length || 0
      )
    : 0;

  const stats = [
    {
      label: 'Total Website',
      value: safeWebsites.length,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      color: 'bg-linear-to-br from-[#8A2BE1] to-[#7120BC]',
      glow: 'group-hover:shadow-[#8A2BE1]/20 group-hover:border-[#8A2BE1]/40',
    },
    {
      label: 'AI Reviews',
      value: safeWebsites.filter((w: any) => w.aiReview).length,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16" />
          <line x1="16" y1="16" x2="16" y2="16" />
        </svg>
      ),
      color: 'bg-linear-to-br from-[#8A2BE1] to-[#571796]',
      glow: 'group-hover:shadow-[#8A2BE1]/20 group-hover:border-[#8A2BE1]/40',
    },
    {
      label: 'Avg. Score',
      value: avgScore,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
        </svg>
      ),
      color: 'bg-linear-to-br from-[#7120BC] to-[#3E0E70]',
      glow: 'group-hover:shadow-[#8A2BE1]/20 group-hover:border-[#8A2BE1]/40',
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background layers */}
      <div className="fixed inset-0 -z-10 bg-linear-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/60" />

      {/* Navbar matching Landing Page */}
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
              <Link href="/community" data-cursor-target="true" className="cursor-target text-sm text-[#F9F9FD]/70 hover:text-[#F9F9FD] transition-colors hidden sm:block">
                Komunitas
              </Link>
              <div className="h-6 w-px bg-[#F9F9FD]/10 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8A2BE1]/20 border border-[#8A2BE1]/40 flex items-center justify-center text-[#8A2BE1] text-sm font-bold shadow-lg shadow-[#8A2BE1]/10">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm text-[#F9F9FD] font-medium hidden sm:block">{user?.name}</span>
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8A2BE1]/30 bg-[#8A2BE1]/10 text-[#C5ABF2] text-xs font-medium mb-4 shadow-[0_0_15px_rgba(138,43,225,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE1] animate-pulse" />
              Selamat datang kembali, {user?.name?.split(' ')[0]}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#F9F9FD] flex tracking-tight">
              <ScrollFloat textClassName="text-[#F9F9FD]" stagger={0.03} animationDuration={1}>Dashboard</ScrollFloat>
            </h1>
            <p className="text-[#F9F9FD]/60 mt-3 text-lg">Kelola website dan lihat review Anda</p>
          </div>
          <Link
            href="/upload"
            data-cursor-target="true"
            className="cursor-target px-6 py-3 rounded-xl bg-[#8A2BE1] text-[#F9F9FD] font-semibold hover:shadow-lg hover:shadow-[#8A2BE1]/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Upload Website
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`glass-card p-6 rounded-2xl flex items-center gap-5 border border-white/5 transition-all duration-300 group ${stat.glow} bg-white/5 backdrop-blur-xl hover:-translate-y-1`}
            >
              <div
                className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                {stat.icon}
              </div>
              <div>
                <div className="text-3xl font-bold text-[#F9F9FD]">
                  <AnimatedCounter target={stat.value} />
                </div>
                <div className="text-sm font-medium text-[#F9F9FD]/60 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section divider label */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-sm font-bold text-[#F9F9FD]/50 uppercase tracking-widest">
            Website Anda
          </h2>
          <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
        </div>

        {/* Websites List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#8A2BE1] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : safeWebsites.length === 0 ? (
          <div className="glass-card p-16 rounded-3xl text-center relative overflow-hidden border border-white/5 bg-white/5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#8A2BE1] to-[#C5ABF2]" />
            <div className="absolute inset-0 bg-linear-to-b from-[#8A2BE1]/5 to-transparent pointer-events-none" />
            
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-[#8A2BE1]/10 border border-[#8A2BE1]/20 flex items-center justify-center text-white relative group">
              <div className="absolute inset-0 bg-[#8A2BE1]/20 blur-xl rounded-3xl group-hover:bg-[#8A2BE1]/30 transition-colors" />
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-[#C5ABF2]">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-[#F9F9FD] mb-3">Belum ada website</h2>
            <p className="text-[#F9F9FD]/60 mb-8 max-w-md mx-auto text-lg">Mulai perjalanan Anda dengan mengunggah website pertama dan dapatkan feedback desain secara instan.</p>
            <Link
              href="/upload"
              data-cursor-target="true"
              className="cursor-target inline-flex px-8 py-3.5 cyber-cut bg-[#8A2BE1] text-[#F9F9FD] font-semibold hover:shadow-[0_0_20px_rgba(138,43,225,0.4)] transition-all duration-300 hover:-translate-y-1"
            >
              Upload Website Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {safeWebsites.map((website) => (
              <Link
                key={website.id}
                href={`/review/${website.id}`}
                data-cursor-target="true"
                className="cursor-target glass-card p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-5 border border-white/5 bg-white/5 hover:border-[#8A2BE1]/40 hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(138,43,225,0.15)] hover:-translate-y-0.5 transition-all duration-300 group"
              >
                {/* Visual Icon */}
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#8A2BE1]/20 to-[#3E0E70]/50 border border-[#8A2BE1]/20 flex items-center justify-center shrink-0 text-[#C5ABF2] group-hover:scale-110 transition-transform duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-[#F9F9FD] group-hover:text-[#C5ABF2] transition-colors truncate">
                    {website.title}
                  </h3>
                  <p className="text-sm text-[#F9F9FD]/50 truncate mt-0.5 font-mono">{website.url}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="px-2.5 py-1 rounded-md bg-[#8A2BE1]/10 border border-[#8A2BE1]/20 text-[#C5ABF2] text-xs font-semibold uppercase tracking-wider">
                      {website.category?.name || 'Uncategorized'}
                    </span>
                    <span className="text-xs text-[#F9F9FD]/40">
                      {new Date(website.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 mt-4 sm:mt-0">
                  {website.aiReview && (
                    <div className="flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] uppercase text-[#F9F9FD]/50 font-bold tracking-wider mb-0.5">AI Score</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🤖</span>
                        <span className={`text-lg font-bold ${
                          website.aiReview.status === 'COMPLETED' ? 'text-transparent bg-clip-text bg-linear-to-r from-[#C5ABF2] to-[#8A2BE1]' :
                          website.aiReview.status === 'PROCESSING' ? 'text-yellow-400' : 'text-[#F9F9FD]/50'
                        }`}>
                          {website.aiReview.status === 'COMPLETED' ? website.aiReview.overallScore : 'Wait'}
                        </span>
                      </div>
                    </div>
                  )}
                  {website.communityPost?.status === 'PUBLISHED' && (
                    <div className="flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-black/40 border border-white/5">
                       <span className="text-[10px] uppercase text-[#F9F9FD]/50 font-bold tracking-wider mb-0.5">Comments</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">💬</span>
                        <span className="text-lg font-bold text-[#F9F9FD]">
                          {website.communityPost._count?.comments ?? 0}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#F9F9FD]/50 group-hover:bg-[#8A2BE1] group-hover:text-white transition-all">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="-translate-x-px group-hover:translate-x-px transition-transform">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
