'use client';

import Link from 'next/link';
import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

const SCORE_COLORS: Record<string, string> = {
  layout: 'from-green-400 to-emerald-500',
  typography: 'from-blue-400 to-cyan-500',
  color: 'from-purple-400 to-pink-500',
  navigation: 'from-orange-400 to-red-500',
  cta: 'from-yellow-400 to-orange-500',
  accessibility: 'from-teal-400 to-green-500',
};

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-200" />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        className="transition-all duration-1000"
      />
    </svg>
  );
}

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [triggeringAi, setTriggeringAi] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const loadWebsite = useCallback(async () => {
    try {
      const data = await api.getWebsite(id);
      setWebsite(data);
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadWebsite();

    // Auto-polling jika AI sedang proses
    let interval: NodeJS.Timeout;
    if (website?.aiReview?.status === 'PROCESSING') {
      interval = setInterval(() => {
        loadWebsite();
      }, 3000); // Poll setiap 3 detik
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, id, website?.aiReview?.status, loadWebsite]);

  const handleTriggerAi = async () => {
    setTriggeringAi(true);
    try {
      await api.triggerAiReview(id);
      setTimeout(loadWebsite, 2000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setTriggeringAi(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.publishToFeed(id);
      loadWebsite();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPublishing(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!website) return null;

  const review = website.aiReview;
  const scores = review ? [
    { key: 'layout', label: 'Layout', score: review.layoutScore },
    { key: 'typography', label: 'Typography', score: review.typographyScore },
    { key: 'color', label: 'Color', score: review.colorScore },
    { key: 'navigation', label: 'Navigation', score: review.navigationScore },
    { key: 'cta', label: 'CTA', score: review.ctaScore },
    { key: 'accessibility', label: 'Accessibility', score: review.accessibilityScore },
  ] : [];

  const reasoning = review?.reasoning as Record<string, any> | null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-surface-0/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">{website.title}</h1>
            <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline text-sm">
              {website.url} ↗
            </a>
            <div className="flex items-center gap-3 mt-3">
              <span className="px-3 py-1 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-medium">
                {website.category?.name}
              </span>
              {website.description && (
                <span className="text-sm text-text-tertiary">{website.description}</span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {!review && (
              <button
                onClick={handleTriggerAi}
                disabled={triggeringAi}
                className="px-4 py-2 rounded-xl bg-linear-to-r from-brand-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {triggeringAi ? 'Processing...' : '🤖 AI Review'}
              </button>
            )}
            {!website.communityPost && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="px-4 py-2 rounded-xl border border-accent-500 text-accent-500 text-sm font-medium hover:bg-accent-500/10 transition-all disabled:opacity-50"
              >
                {publishing ? 'Publishing...' : '👥 Publish ke Komunitas'}
              </button>
            )}
          </div>
        </div>

        {/* AI Review Results */}
        {review && review.status === 'COMPLETED' && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="glass-card p-8 flex flex-col sm:flex-row items-center gap-8">
              <div className="relative">
                <ScoreRing score={review.overallScore ?? 0} size={120} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-text-primary">{review.overallScore}</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-1">Overall Score</h2>
                <p className="text-text-secondary text-sm">
                  {review.overallScore >= 80 ? 'Desain website Anda sudah sangat baik! 🎉' :
                   review.overallScore >= 60 ? 'Cukup baik, ada beberapa area yang bisa ditingkatkan.' :
                   'Masih ada banyak ruang untuk perbaikan.'}
                </p>
                <p className="text-xs text-text-tertiary mt-2">Model: {review.modelUsed}</p>
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {scores.map((item) => (
                <div key={item.key} className="glass-card p-5 hover:border-brand-500/20 transition-all duration-300">
                  <div className="text-xs text-text-tertiary mb-2 uppercase tracking-wider">{item.label}</div>
                  <div className="text-3xl font-bold text-text-primary mb-3">{item.score ?? '-'}</div>
                  <div className="w-full h-2 rounded-full bg-surface-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-linear-to-r ${SCORE_COLORS[item.key]} transition-all duration-1000`}
                      style={{ width: `${item.score ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Reasoning */}
            {reasoning && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-primary">Detail Evaluasi</h3>
                {Object.entries(reasoning).map(([key, value]) => {
                  if (key === 'overall_recommendation') return null;
                  const data = value as AiCategoryResult;
                  if (!data?.reasoning) return null;

                  return (
                    <div key={key} className="glass-card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-text-primary capitalize">{key}</h4>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                          (data.score ?? 0) >= 80 ? 'bg-green-500/10 text-green-400' :
                          (data.score ?? 0) >= 60 ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {data.score}/100
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed mb-3">{data.reasoning}</p>
                      {data.recommendations && data.recommendations.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-text-tertiary mb-1.5">Rekomendasi:</div>
                          <ul className="space-y-1">
                            {data.recommendations.map((rec: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                <span className="text-brand-400 mt-0.5">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Overall Recommendation */}
            {review.recommendation && (
              <div className="glass-card p-5 border-brand-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">💡</span>
                  <h4 className="font-semibold text-text-primary">Rekomendasi Utama</h4>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{review.recommendation}</p>
              </div>
            )}
          </div>
        )}

        {/* Processing State */}
        {review && review.status === 'PROCESSING' && (
          <div className="glass-card p-12 text-center">
            <div className="w-12 h-12 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">AI sedang menganalisis...</h2>
            <p className="text-text-secondary">Mohon tunggu beberapa saat. Halaman akan otomatis diperbarui.</p>
            <button onClick={loadWebsite} className="mt-4 text-sm text-brand-400 hover:underline">
              Refresh
            </button>
          </div>
        )}

        {/* No Review */}
        {!review && (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">🤖</div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Belum ada AI Review</h2>
            <p className="text-text-secondary mb-6">Klik tombol AI Review di atas untuk memulai evaluasi</p>
          </div>
        )}

        {/* Community Post Link */}
        {website.communityPost?.status === 'PUBLISHED' && (
          <div className="mt-6 glass-card p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">👥</span>
              <div>
                <div className="font-medium text-text-primary">Community Post</div>
                <div className="text-sm text-text-secondary">
                  {website.communityPost._count?.comments ?? 0} komentar
                </div>
              </div>
            </div>
            <Link
              href={`/community/${website.communityPost.id}`}
              className="px-4 py-2 rounded-xl border border-border text-sm text-text-secondary hover:text-brand-400 hover:border-brand-500/30 transition-all"
            >
              Lihat Diskusi →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

interface AiCategoryResult {
  score: number;
  reasoning: string;
  recommendations: string[];
}
