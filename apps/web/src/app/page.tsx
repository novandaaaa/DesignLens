'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import ThreeBackground from '@/components/ThreeBackground';
//import HyperspeedBackground from '@/components/HyperspeedBackground';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
  setMounted(true);

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobile();

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', checkMobile);

  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', checkMobile);
  };
}, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Lapisan background */}
      {/* <HyperspeedBackground /> */}
      {!isMobile && <ThreeBackground />}
      <div className="fixed inset-0 -z-10 bg-linear-to-b from-[#0F172A]/40 via-transparent to-[#0F172A]/60" />

      {/* ✨ FLOATING NAVBAR - Konsep Baru */}
      <nav 
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          scrolled 
            ? 'w-[95%] max-w-6xl opacity-100' 
            : 'w-[98%] max-w-7xl opacity-90'
        }`}
      >
        <div className={`
          mx-auto px-6 py-3.5 rounded-2xl 
          backdrop-blur-2xl 
          border border-white/10
          bg-[#0F172A]/60
          shadow-2xl shadow-black/50
          transition-all duration-500
          ${scrolled ? 'bg-[#0F172A]/80 border-brand-500/20' : ''}
        `}>
          <div className="flex items-center justify-between gap-6">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-all duration-300 group-hover:scale-110">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-lg font-bold text-white hidden sm:block">
                Design<span className="text-transparent bg-clip-text bg-linear-to-r from-brand-400 to-purple-400">Lens</span>
              </span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {[
                { href: '#features', label: 'Fitur' },
                { href: '#how-it-works', label: 'Cara Kerja' },
                { href: '/community', label: 'Komunitas' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-brand-500 to-purple-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-xl bg-linear-to-r from-brand-500 to-purple-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 border border-white/10"
                  >
                    Gratis
                  </Link>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {mobileMenuOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`
          md:hidden mt-2 px-6 py-4 rounded-2xl 
          backdrop-blur-2xl bg-[#0F172A]/90 
          border border-white/10
          transition-all duration-300
          ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}>
          <div className="flex flex-col gap-2">
            {[
              { href: '#features', label: 'Fitur' },
              { href: '#how-it-works', label: 'Cara Kerja' },
              { href: '/community', label: 'Komunitas' },
              { href: '/login', label: 'Masuk' },
              { href: '/register', label: 'Daftar Gratis', primary: true },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                  ${item.primary 
                    ? 'bg-linear-to-r from-brand-500 to-purple-500 text-white text-center' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-[26rem] md:pt-40 md:pb-[32rem] px-6">
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-sm mb-6 backdrop-blur-sm">
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
              className="px-8 py-3.5 rounded-2xl border border-border text-text-secondary font-medium hover:border-brand-500/50 hover:text-brand-400 transition-all duration-300 backdrop-blur-sm bg-white/5"
            >
              Lihat Cara Kerja →
            </a>
          </div>
        </div>

        {/* Floating score badges — sama seperti sebelumnya */}
        <div className={`hidden lg:block absolute top-[14%] left-[3%] transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
            <div>
              <div className="text-xs text-text-tertiary">Color</div>
              <div className="text-lg font-bold text-text-primary">78</div>
            </div>
          </div>
        </div>

        <div className={`hidden lg:block absolute top-[30%] left-[6%] transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <div>
              <div className="text-xs text-text-tertiary">Layout</div>
              <div className="text-lg font-bold text-text-primary">92</div>
            </div>
          </div>
        </div>

        <div className={`hidden lg:block absolute top-[55%] left-[10%] transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-pink-400" />
            <div>
              <div className="text-xs text-text-tertiary">Accessibility</div>
              <div className="text-lg font-bold text-text-primary">88</div>
            </div>
          </div>
        </div>

        <div className={`hidden lg:block absolute top-[16%] right-[3%] transition-all duration-1000 delay-450 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <div>
              <div className="text-xs text-text-tertiary">CTA</div>
              <div className="text-lg font-bold text-text-primary">71</div>
            </div>
          </div>
        </div>

        <div className={`hidden lg:block absolute top-[35%] right-[6%] transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <div>
              <div className="text-xs text-text-tertiary">Typography</div>
              <div className="text-lg font-bold text-text-primary">85</div>
            </div>
          </div>
        </div>

        <div className={`hidden lg:block absolute top-[60%] right-[10%] transition-all duration-1000 delay-800 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="glass-card px-4 py-3 flex items-center gap-3 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <div>
              <div className="text-xs text-text-tertiary">Navigation</div>
              <div className="text-lg font-bold text-text-primary">88</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Score Cards */}
      <div className="lg:hidden px-6 -mt-8 mb-16">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Color", value: 78, color: "bg-fuchsia-400" },
            { label: "Layout", value: 92, color: "bg-indigo-400" },
            { label: "CTA", value: 71, color: "bg-yellow-400" },
            { label: "Typography", value: 85, color: "bg-teal-400" },
            { label: "Accessibility", value: 88, color: "bg-pink-400" },
            { label: "Navigation", value: 88, color: "bg-purple-400" },
          ].map((item) => (
            <div
              key={item.label}
              className="glass-card px-4 py-3 flex items-center gap-3"
            >
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <div>
                <div className="text-xs text-text-tertiary">
                  {item.label}
                </div>
                <div className="text-lg font-bold text-text-primary">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Features Section - tetap sama */}
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
                icon: '💬',
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