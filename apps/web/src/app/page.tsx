'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Dither from '@/components/Dither';
//import ThreeFloatingObjects from '@/components/ThreeFloatingObjects';
import ScrollFloat from '@/components/ScrollFloat';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';
import TargetCursor from '@/components/TargetCursor';
import SmoothScroll from '@/components/SmoothScroll';
import HowItWorks from '@/components/HowItWorks';

// --- KONSTANTA ---
const SCORE_BAR_COLORS = {
  layout: '#6366f1',
  typography: '#ec4899',
  color: '#d946ef',
  navigation: '#14b8a6',
  cta: '#f59e0b',
  accessibility: '#8b5cf6',
};

const PREVIEW_PINS = [
  { id: 1, label: 'Layout & Hierarki', score: 85, color: SCORE_BAR_COLORS.layout },
  { id: 2, label: 'Typography', score: 72, color: SCORE_BAR_COLORS.typography },
  { id: 3, label: 'Color Contrast', score: 90, color: SCORE_BAR_COLORS.color },
  { id: 4, label: 'Navigation Flow', score: 88, color: SCORE_BAR_COLORS.navigation },
];

const TESTIMONIALS = [
  { name: 'Rina A.', role: 'Frontend Developer', text: 'Feedback AI-nya sangat detail. Saya langsung tahu bagian mana yang perlu diperbaiki untuk aksesibilitas.', avatar: '‍💻' },
  { name: 'Budi S.', role: 'UI/UX Designer', text: 'Komunitasnya aktif dan memberi masukan yang jujur. Jauh lebih baik daripada review dari teman sendiri.', avatar: '🎨' },
  { name: 'TechStartup ID', role: 'Agency', text: 'Kami menggunakan DesignLens untuk QA cepat sebelum deliver ke klien. Menghemat waktu 40%.', avatar: '🚀' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<'ai' | 'community' | null>('ai');
  const [activeSection, setActiveSection] = useState('hero');
  
  // State untuk Simulasi Scan Interaktif
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScores, setCurrentScores] = useState(PREVIEW_PINS.map(p => ({ ...p, score: 0 })));
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Track active section untuk parallax effects
      const sections = ['hero', 'features', 'simulasi', 'testimoni'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= -200 && rect.top <= 400) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logika Simulasi Scan
  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      const timer = setTimeout(() => {
        setScanProgress(prev => {
          const next = prev + 2;
          setCurrentScores(prevScores => 
            prevScores.map((item, idx) => ({
              ...item,
              score: Math.min(PREVIEW_PINS[idx].score, Math.floor((next / 100) * PREVIEW_PINS[idx].score + Math.random() * 5))
            }))
          );
          return next;
        });
      }, 50);
      return () => clearTimeout(timer);
    } else if (scanProgress >= 100) {
      setIsScanning(false);
    }
  }, [isScanning, scanProgress]);

  const startSimulation = () => {
    setScanProgress(0);
    setCurrentScores(PREVIEW_PINS.map(p => ({ ...p, score: 0 })));
    setIsScanning(true);
  };

  return (
    <SmoothScroll>
      <TargetCursor />
      <div className="relative min-h-screen overflow-hidden bg-[#05050A] text-white selection:bg-brand-500/30">
        
        {/* ══════════════════════════════ BACKGROUNDS ═══════════════════════════════ */}
        {/* Layer 1: Dither Background Effect */}
        <div className="fixed inset-0 z-0">
          <Dither />
        </div>
        
        {/* Layer 2: Floating 3D Objects (dengan opacity dinamis) */}
        <div className={`fixed inset-0 z-0 transition-opacity duration-1000 ${activeSection === 'hero' ? 'opacity-100' : 'opacity-40'}`}>
          {/* <ThreeFloatingObjects /> */}
        </div>

        {/* Layer 3: Gradient Overlay untuk depth */}
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0F172A]/30 via-transparent to-[#05050A]/80 pointer-events-none" />
        
        {/* Layer 4: Radial gradient spotlight effect */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at 50% 50%, transparent 0%, rgba(5,5,10,0.4) 100%)`,
            opacity: activeSection === 'hero' ? 1 : 0.5
          }}
        />

        {/* ═══════════════════════════════ NAVBAR ══════════════════════════════ */}
        <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${scrolled ? 'w-[95%] max-w-6xl' : 'w-[98%] max-w-7xl'}`}>
          <div className={`mx-auto px-6 py-3.5 rounded-2xl backdrop-blur-2xl border transition-all duration-500 cursor-target ${scrolled ? 'bg-[#0A0A0A]/80 border-white/10 shadow-2xl shadow-black/50' : 'bg-[#0A0A0A]/40 border-white/5'}`}>
            <div className="flex items-center justify-between gap-6">
              <Link href="/" className="flex items-center gap-2.5 group shrink-0 cursor-target">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white hidden sm:block">
                  Design<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Lens</span>
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
                {['Fitur', 'Simulasi', 'Testimoni', 'Komunitas'].map((item) => (
                  <Link 
                    key={item} 
                    href={`#${item.toLowerCase()}`} 
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-target relative group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-brand-500 group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isAuthenticated ? (
                  <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-300 hover:-translate-y-0.5 cursor-target">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="hidden sm:block px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-target">Masuk</Link>
                    <Link href="/register" className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-all duration-300 hover:-translate-y-0.5 cursor-target">
                      Daftar Gratis
                    </Link>
                  </>
                )}
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                  className="md:hidden p-2 rounded-xl text-white/70 hover:bg-white/5 cursor-target transition-all"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {mobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* ═══════════════════════════════ HERO ════════════════════════════════ */}
        <section id="hero" className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
          <div className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <ScrollReveal direction="up" delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-300 text-sm mb-8 backdrop-blur-md cursor-target hover:bg-brand-500/10 transition-all duration-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                v2.0 Sekarang dengan Analisis WCAG 2.2
              </div>
            </ScrollReveal>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
              <ScrollFloat textClassName="text-white" stagger={0.02}>Evaluasi Desain</ScrollFloat>
              <ScrollFloat textClassName="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400" stagger={0.02}>Website Anda</ScrollFloat>
              <ScrollFloat textClassName="text-white/80" stagger={0.02}>dalam Hitungan Detik</ScrollFloat>
            </h1>

            <ScrollReveal direction="up" delay={200}>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                Dapatkan feedback UI/UX dari <strong className="text-white">AI</strong> secara instan dan masukan autentik dari <strong className="text-white">komunitas developer</strong> Indonesia.
              </p>
            </ScrollReveal>

            {/* Interactive Hero Input */}
            <ScrollReveal direction="up" delay={400}>
              <div className="max-w-lg mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                  <div className="pl-4 text-white/40">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="cursor-target">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="https://website-anda.com" 
                    className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-white/30 cursor-text"
                    readOnly
                  />
                  <Link 
                    href="/register" 
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-300 whitespace-nowrap cursor-target hover:scale-105 active:scale-95"
                  >
                    Scan Sekarang
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Animated Floating Decorative Elements */}
          <div className="absolute top-1/2 left-10 w-20 h-20 border border-brand-500/20 rounded-full animate-pulse pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-32 h-32 border border-purple-500/10 rounded-full animate-pulse delay-1000 pointer-events-none" />
        </section>

        {/* ═══════════════════════════════ MARQUEE ══════════════════════════════ */}
        <div className="w-full border-y border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden py-4 relative z-10">
          <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-12 items-center text-white/30 font-semibold text-lg tracking-wider">
                {['REACT', 'NEXT.JS', 'TAILWIND', 'FIGMA', 'TYPESCRIPT', 'FRAMER MOTION'].map((tech) => (
                  <span key={tech} className="cursor-target hover:text-white transition-colors duration-300">
                    {tech}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════ STATS ═══════════════════════════════ */}
        <section className="py-24 px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Website Dianalisis', target: 1240, suffix: '+', icon: '' },
              { label: 'AI Reviews', target: 987, suffix: '+', icon: '🤖' },
              { label: 'Rata-rata Skor', target: 76, suffix: '/100', icon: '' },
              { label: 'Member Aktif', target: 430, suffix: '+', icon: '👥' },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 100} direction="up">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/30 hover:bg-white/[0.07] transition-all duration-300 text-center group cursor-target">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════ FEATURES (BENTO) ═══════════════════ */}
        <section id="fitur" className="py-24 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Dua Kekuatan, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Satu Platform</span>
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                  Kombinasi kecepatan mesin dan kebijaksanaan manusia untuk hasil terbaik.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-6 h-auto md:h-[500px]">
              {/* AI Review Card */}
              <div 
                className={`relative rounded-3xl border transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer overflow-hidden group cursor-target ${expandedCard === 'ai' ? 'md:col-span-1 bg-gradient-to-br from-brand-500/10 to-transparent border-brand-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                onClick={() => setExpandedCard('ai')}
                onMouseEnter={() => setHoveredFeature(1)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8 h-full flex flex-col relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center mb-6 shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform duration-300">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /><path d="M12 16v-4M12 8h.01" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">AI Review Instan</h3>
                  <p className="text-white/60 leading-relaxed mb-6">
                    AI menganalisis website berdasarkan 6 kategori UI/UX utama. Hasil bersifat <strong className="text-white">100% privat</strong> dan rahasia.
                  </p>
                  <ul className="space-y-3 mt-auto">
                    {['Evaluasi dalam < 5 detik', 'Skor detail per komponen', 'Rekomendasi kode perbaikan'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-white/70 text-sm">
                        <span className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 text-brand-400">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Community Review Card */}
              <div 
                className={`relative rounded-3xl border transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer overflow-hidden group cursor-target ${expandedCard === 'community' ? 'md:col-span-1 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                onClick={() => setExpandedCard('community')}
                onMouseEnter={() => setHoveredFeature(2)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8 h-full flex flex-col relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Community Feedback</h3>
                  <p className="text-white/60 leading-relaxed mb-6">
                    Publikasikan ke komunitas. Dapatkan perspektif <strong className="text-white">manusia yang nyata</strong> dari developer dan desainer lain.
                  </p>
                  <ul className="space-y-3 mt-auto">
                    {['Diskusi berjenjang (thread)', 'Feedback dari praktisi senior', 'Networking dengan builder lain'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-white/70 text-sm">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 text-purple-400">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ LIVE SIMULATION ═══════════════════════ */}
        <section id="simulasi" className="py-24 px-6 bg-white/[0.02] border-y border-white/5 relative z-10">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Lihat AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Bekerja</span>
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
                  Klik tombol di bawah untuk melihat simulasi bagaimana AI kami menganalisis dan memberi skor pada website secara real-time.
                </p>
                <button 
                  onClick={startSimulation}
                  disabled={isScanning}
                  className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 mx-auto cursor-target ${isScanning ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 hover:scale-105 shadow-xl shadow-white/10 active:scale-95'}`}
                >
                  {isScanning ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menganalisis... {scanProgress}%
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      Jalankan Simulasi Scan
                    </>
                  )}
                </button>
              </div>
            </ScrollReveal>

            {/* Simulation UI */}
            <div className="grid lg:grid-cols-5 gap-8 mt-12">
              {/* Mock Browser */}
              <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl relative group">
                <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/10 gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 mx-4 h-7 rounded-md bg-black/40 flex items-center px-3 border border-white/5">
                    <span className="text-xs text-white/40 truncate">https://example-portfolio.com</span>
                  </div>
                </div>
                <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-black p-6 flex flex-col gap-4">
                  {/* Scanning Line Effect */}
                  {isScanning && (
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                      <div className="w-full h-0.5 bg-brand-400 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan" />
                    </div>
                  )}
                  {/* Fake UI Elements */}
                  <div className="h-8 bg-white/5 rounded-lg w-1/3 animate-pulse" />
                  <div className="h-32 bg-white/5 rounded-xl w-full mt-4 flex items-center justify-center">
                    <span className="text-white/10 text-4xl font-bold">HERO SECTION</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
                    <div className="h-24 bg-white/5 rounded-xl animate-pulse delay-75" />
                    <div className="h-24 bg-white/5 rounded-xl animate-pulse delay-150" />
                  </div>
                </div>
              </div>

              {/* Live Scores Panel */}
              <div className="lg:col-span-2 space-y-4">
                {currentScores.map((pin, idx) => (
                  <div 
                    key={pin.id} 
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 cursor-target group"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{pin.label}</span>
                      <span className="text-sm font-bold transition-colors duration-300" style={{ color: pin.score >= 80 ? '#4ade80' : pin.score >= 60 ? '#facc15' : '#f87171' }}>
                        {pin.score}/100
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${pin.score}%`, background: pin.color }}
                      />
                    </div>
                  </div>
                ))}
                
                <div className="p-4 rounded-xl bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/20 mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">Overall Score</div>
                      <div className="text-3xl font-bold text-white">
                        {Math.round(currentScores.reduce((acc, curr) => acc + curr.score, 0) / currentScores.length)}/100
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">Status</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-500 ${scanProgress === 100 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {scanProgress === 100 ? 'Sangat Baik' : 'Memproses...'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ TESTIMONIALS ═══════════════════════ */}
        <section id="testimoni" className="py-24 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Apa Kata <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Mereka?</span>
                </h2>
              </div>
            </ScrollReveal>
            
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <ScrollReveal key={i} delay={i * 150} direction="up">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand-500/20 transition-all duration-300 h-full flex flex-col group cursor-target">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{t.name}</div>
                        <div className="text-xs text-white/50">{t.role}</div>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed flex-1">"{t.text}"</p>
                    <div className="flex gap-1 mt-4 text-yellow-500 text-xs">★★★★★</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ HOW IT WORKS ═══════════════════════ */}
        <section id="cara-kerja" className="relative z-10">
          <HowItWorks />
        </section>

        {/* ═══════════════════════════════ CTA ═════════════════════════════════ */}
        <section className="py-32 px-6 relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-900/10 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <ScrollReveal direction="up">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Siap Membuat Desain yang <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Lebih Baik?</span>
              </h2>
              <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
                Bergabung dengan ratusan developer yang sudah meningkatkan kualitas UI/UX mereka secara signifikan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/register" 
                  className="px-8 py-4 rounded-2xl bg-white text-black font-bold text-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-xl shadow-white/10 cursor-target active:scale-95"
                >
                  Mulai Evaluasi Gratis
                </Link>
                <Link 
                  href="/community" 
                  className="px-8 py-4 rounded-2xl border border-white/10 text-white font-semibold text-lg hover:bg-white/5 transition-all duration-300 backdrop-blur-sm cursor-target hover:border-brand-500/50 active:scale-95"
                >
                  Lihat Komunitas →
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════ FOOTER ══════════════════════════════ */}
        <footer className="bg-[#020205] border-t border-white/5 pt-20 pb-8 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-10 mb-16">
              <div className="md:col-span-2">
                <Link href="/" className="flex items-center gap-2 mb-4 cursor-target">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  </div>
                  <span className="font-bold text-white text-lg">DesignLens AI</span>
                </Link>
                <p className="text-sm text-white/40 leading-relaxed max-w-xs mb-6">
                  Platform evaluasi UI/UX website berbasis AI dan Community Review pertama di Indonesia.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Platform</h4>
                <ul className="space-y-3">
                  {['Fitur', 'Simulasi', 'Harga', 'Komunitas'].map((l) => (
                    <li key={l}><Link href="#" className="text-sm text-white/40 hover:text-brand-400 transition-colors cursor-target">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
                <ul className="space-y-3">
                  {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
                    <li key={l}><Link href="#" className="text-sm text-white/40 hover:text-brand-400 transition-colors cursor-target">{l}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-white/30">© 2026 DesignLens AI. All rights reserved.</p>
              <p className="text-sm text-white/30 flex items-center gap-1.5">Built with <span className="text-red-500">❤️</span> in Jakarta</p>
            </div>
          </div>
        </footer>

        {/* Global Styles for Custom Animations */}
        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
          @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          .animate-scan {
            animation: scan 2s linear infinite;
          }
        `}</style>
      </div>
    </SmoothScroll>
  );
}