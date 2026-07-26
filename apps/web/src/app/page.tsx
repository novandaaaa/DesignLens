'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import ThreeBackground from '@/components/ThreeBackground';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 3D Ambient Background — monitor mockup + partikel + flying objects */}
      <ThreeBackground />

      {/* Wash gradient tipis di atas 3D agar teks tetap kontras & mudah dibaca */}
      <div className="fixed inset-0 -z-10 bg-linear-to-b from-[#0F172A]/40 via-transparent to-[#0F172A]/60" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A] border-b border-white/10">
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

          <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">Fitur</a>
            <a href="#how-it-works" className="hover:text-text-primary transition-colors">Cara Kerja</a>
            <Link href="/community" className="hover:text-text-primary transition-colors">Komunitas</Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-5 py-2 rounded-xl bg-linear-to-r from-brand-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-xl bg-linear-to-r from-brand-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section — teks dikompakkan & dikasih ruang kosong di bawah
          supaya monitor 3D di background kelihatan penuh tanpa ketutupan */}
      <section className="relative pt-20 pb-[26rem] md:pb-[32rem] px-6">
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            Powered by AI + Community Review
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-5">
            <span className="text-text-primary">Evaluasi Desain</span>
            <br />
            <span className="gradient-text">Website Anda</span>
            <br />
            <span className="text-text-primary">dalam Hitungan Detik</span>
          </h1>

          <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed">
            Dapatkan feedback UI/UX dari <strong className="text-text-primary">AI</strong> secara instan
            dan masukan autentik dari <strong className="text-text-primary">komunitas developer</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group relative px-8 py-3.5 rounded-2xl bg-linear-to-r from-brand-500 to-purple-500 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-500 hover:-translate-y-1"
            >
              Mulai Evaluasi — Gratis
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-brand-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-2xl border border-border text-text-secondary font-medium hover:border-brand-500/50 hover:text-brand-400 transition-all duration-300"
            >
              Lihat Cara Kerja →
            </a>
          </div>
        </div>

        {/* Floating score badges — melayang di kiri-kanan mengiringi monitor
            3D di belakangnya, warnanya senada dengan flying objects di scene */}
        <div
          className={`hidden lg:block absolute top-[14%] left-[3%] transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
            <div>
              <div className="text-xs text-text-tertiary">Color</div>
              <div className="text-lg font-bold text-text-primary">78</div>
            </div>
          </div>
        </div>

        <div
          className={`hidden lg:block absolute top-[30%] left-[6%] transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <div>
              <div className="text-xs text-text-tertiary">Layout</div>
              <div className="text-lg font-bold text-text-primary">92</div>
            </div>
          </div>
        </div>

        <div
          className={`hidden lg:block absolute top-[55%] left-[10%] transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-pink-400" />
            <div>
              <div className="text-xs text-text-tertiary">Accessibility</div>
              <div className="text-lg font-bold text-text-primary">88</div>
            </div>
          </div>
        </div>

        <div
          className={`hidden lg:block absolute top-[16%] right-[3%] transition-all duration-1000 delay-450 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <div>
              <div className="text-xs text-text-tertiary">CTA</div>
              <div className="text-lg font-bold text-text-primary">71</div>
            </div>
          </div>
        </div>

        <div
          className={`hidden lg:block absolute top-[35%] right-[6%] transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <div>
              <div className="text-xs text-text-tertiary">Typography</div>
              <div className="text-lg font-bold text-text-primary">85</div>
            </div>
          </div>
        </div>

        <div
          className={`hidden lg:block absolute top-[60%] right-[10%] transition-all duration-1000 delay-800 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <div>
              <div className="text-xs text-text-tertiary">Navigation</div>
              <div className="text-lg font-bold text-text-primary">88</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
              Dua Pendekatan, <span className="gradient-text">Satu Tujuan</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Kombinasi kecerdasan AI dan wisdom of the crowd untuk evaluasi UI/UX yang komprehensif
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* AI Review Card */}
            <div className="glass-card p-8 hover:border-brand-500/30 transition-all duration-500 hover:-translate-y-2 group">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-500 to-purple-500 flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-brand-500/25 transition-all duration-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">🤖 AI Review</h3>
              <p className="text-text-secondary leading-relaxed mb-6">
                AI menganalisis website Anda berdasarkan 6 kategori UI/UX: Layout, Typography, Color, Navigation, CTA, dan Accessibility. Hasil bersifat <strong className="text-text-primary">privat</strong> — hanya Anda yang bisa melihat.
              </p>
              <ul className="space-y-3">
                {['Evaluasi instan dalam detik', 'Skor 0-100 per kategori', 'Rekomendasi perbaikan spesifik', 'Hasil privat & rahasia'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="w-5 h-5 rounded-full bg-accent-500/10 flex items-center justify-center shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-500">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Review Card */}
            <div className="glass-card p-8 hover:border-accent-500/30 transition-all duration-500 hover:-translate-y-2 group">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-accent-500 to-teal-500 flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-accent-500/25 transition-all duration-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">👥 Community Review</h3>
              <p className="text-text-secondary leading-relaxed mb-6">
                Publikasikan website ke halaman komunitas. Dapatkan feedback <strong className="text-text-primary">independen</strong> dari developer dan desainer lain — tanpa pengaruh hasil AI.
              </p>
              <ul className="space-y-3">
                {['Komentar & diskusi berjenjang', 'Feedback dari praktisi nyata', 'Perspektif user yang beragam', 'Tidak terpengaruh hasil AI'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="w-5 h-5 rounded-full bg-accent-500/10 flex items-center justify-center shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-500">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
              Cara <span className="gradient-text">Kerja</span>
            </h2>
            <p className="text-text-secondary text-lg">Tiga langkah sederhana menuju desain yang lebih baik</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Website',
                desc: 'Masukkan URL website Anda atau upload screenshot. Tambahkan deskripsi dan pilih kategori.',
                icon: '🌐',
              },
              {
                step: '02',
                title: 'Pilih Review',
                desc: 'Pilih AI Review untuk evaluasi instan, Community Review untuk feedback publik, atau keduanya.',
                icon: '🎯',
              },
              {
                step: '03',
                title: 'Dapatkan Feedback',
                desc: 'Lihat skor AI per kategori dan diskusi komunitas. Gunakan insight untuk perbaikan desain.',
                icon: '📊',
              },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center group">
                <div className="w-20 h-20 rounded-3xl bg-surface-100 border border-border mx-auto mb-6 flex items-center justify-center text-4xl group-hover:border-brand-500/30 group-hover:-translate-y-2 transition-all duration-500">
                  {item.icon}
                </div>
                <div className="text-xs font-mono text-brand-400 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 right-[-20%] text-text-tertiary">
                    <svg width="40" height="12" viewBox="0 0 40 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M0 6h36M32 1l5 5-5 5" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-brand-500 via-purple-500 to-pink-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Siap Meningkatkan Kualitas Desain?
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
              Mulai evaluasi website Anda sekarang — gratis, cepat, dan akurat.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 rounded-2xl bg-linear-to-r from-brand-500 to-purple-500 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-500 hover:-translate-y-1"
            >
              Daftar Gratis Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-brand-500 to-purple-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <span className="font-semibold text-text-primary">DesignLens AI</span>
          </div>
          <p className="text-sm text-text-tertiary">
            © 2025 DesignLens AI. Platform Evaluasi UI/UX Website.
          </p>
        </div>
      </footer>
    </div>
  );
}
