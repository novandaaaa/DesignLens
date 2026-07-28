'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Pastikan mendaftarkan plugin di client-side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    id: 1,
    title: 'Masukkan URL',
    description: 'Cukup tempelkan tautan website atau aplikasi web Anda. Tidak perlu instalasi khusus atau setup berbelit.',
    icon: '🔗',
    color: 'bg-[#8A2BE1]',
  },
  {
    id: 2,
    title: 'Evaluasi Instan oleh AI',
    description: 'AI kami akan menelusuri halaman Anda dan menganalisis 6 metrik utama UX/UI dalam hitungan detik.',
    icon: '🤖',
    color: 'bg-[#8A2BE1]',
  },
  {
    id: 3,
    title: 'Dapatkan Laporan Detail',
    description: 'Lihat skor komprehensif, temukan titik kelemahan (pain points), dan dapatkan saran perbaikan yang konkret.',
    icon: '📊',
    color: 'bg-[#8A2BE1]',
  },
  {
    id: 4,
    title: 'Review dari Komunitas (Opsional)',
    description: 'Bagikan hasil evaluasi ke komunitas kami untuk mendapatkan wawasan tambahan dari desainer dan developer lain.',
    icon: '👥',
    color: 'bg-[#8A2BE1]',
  },
  {
    id: 5,
    title: 'Terapkan & Tingkatkan',
    description: 'Terapkan rekomendasi yang diberikan, tingkatkan konversi dan kepuasan pengguna (user experience) Anda!',
    icon: '🚀',
    color: 'bg-[#8A2BE1]',
  }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client side and if refs are available
    if (typeof window === 'undefined' || !containerRef.current || !scrollWrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Menghitung berapa jauh kita harus menggeser elemen ke kiri
      // Total lebar elemen dikurangi lebar layar
      const getScrollAmount = () => {
        const scrollWidth = scrollWrapperRef.current?.scrollWidth || 0;
        return -(scrollWidth - window.innerWidth);
      };

      const tween = gsap.to(scrollWrapperRef.current, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true, // Recalculate on resize
          end: () => `+=${scrollWrapperRef.current?.scrollWidth || 0}`
        }
      });

      return () => tween.kill();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="how-it-works" 
      ref={containerRef} 
      className="relative bg-[#0A0A0A] text-white overflow-hidden"
      // Height can be left default, GSAP pin automatically adds padding/height to scroll
    >
      <div className="h-screen w-full flex items-center pt-20">
        <div 
          ref={scrollWrapperRef}
          className="flex gap-8 px-[10vw] md:px-[20vw] flex-nowrap items-center min-w-max"
        >
          {/* Header Card yang diam di awal */}
          <div className="w-75 md:w-100 shrink-0 mr-8 md:mr-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Cara <span className="text-[#8A2BE1]">Kerja</span>
            </h2>
            <p className="text-text-secondary text-lg">
              Perjalanan singkat untuk mengubah desain yang biasa saja menjadi luar biasa.
              <br/><br/>
              <span className="text-[#8A2BE1] font-medium animate-pulse">Scroll ke bawah untuk melanjutkan &rarr;</span>
            </p>
          </div>

          {/* Kartu Langkah-langkah */}
          {STEPS.map((step) => (
            <div 
              key={step.id}
              className="w-75 md:w-100 shrink-0 h-100 glass-card p-8 flex flex-col justify-between hover:border-white/20 transition-colors duration-300 relative group"
            >
              {/* Background gradient glow on hover */}
              <div className={`absolute inset-0 bg-linear-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 cyber-cut -z-10`} />
              
              <div>
                <div className={`w-16 h-16 cyber-cut bg-linear-to-br ${step.color} flex items-center justify-center text-3xl mb-8 shadow-lg`}>
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              <div className="text-6xl font-black text-white/5 absolute bottom-4 right-8 select-none pointer-events-none">
                0{step.id}
              </div>
            </div>
          ))}
          
          {/* Spacing di akhir agar kartu terakhir tidak menempel di tepi layar */}
          <div className="w-[10vw] md:w-[20vw] shrink-0" />
        </div>
      </div>
    </section>
  );
}
