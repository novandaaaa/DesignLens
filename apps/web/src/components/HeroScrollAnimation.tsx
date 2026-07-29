'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import ScrollFloat from './ScrollFloat';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroScrollAnimation() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || !imageRef.current) return;

    const isDesktop = window.innerWidth >= 768;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 1,
        }
      });

      if (isDesktop) {
        // Desktop: text moves from center to left, image appears from right
        tl.to('.align-anim', {
          x: function(_index: number, target: HTMLElement) {
            const parentWidth = target.parentElement!.offsetWidth;
            const targetWidth = target.offsetWidth;
            return -(parentWidth / 2 - targetWidth / 2);
          },
          ease: 'none',
        }, 0);

        tl.fromTo(imageRef.current,
          { x: '20vw', opacity: 0, scale: 0.9, display: 'none' },
          { x: '0vw', opacity: 1, scale: 1, display: 'block', ease: 'none' },
          0
        );
      } else {
        // Mobile: text moves up, image fades in below
        tl.to('.align-anim', { y: '-15vh', ease: 'none' }, 0);
        tl.fromTo(imageRef.current,
          { y: '10vh', opacity: 0, scale: 0.9, display: 'none' },
          { y: '-5vh', opacity: 1, scale: 1, display: 'block', ease: 'none' },
          0
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center pt-16 md:pt-20"
    >
      <div className="relative w-full max-w-7xl mx-auto px-6 h-full flex items-center">

        {/* TEXT SECTION */}
        <div
          className={`relative z-20 w-full flex flex-col transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="align-anim w-max mx-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8A2BE1]/20 bg-[#8A2BE1]/5 text-[#8A2BE1] text-sm mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#8A2BE1] animate-pulse" />
            Powered by AI + Community Review
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-5 flex flex-col">
            <div className="align-anim w-max mx-auto">
              <ScrollFloat textClassName="text-text-primary" stagger={0.02} animationDuration={1.2}>Evaluasi Desain</ScrollFloat>
            </div>
            <div className="align-anim w-max mx-auto">
              <ScrollFloat textClassName="text-[#8A2BE1]" stagger={0.02} animationDuration={1.2}>Website Anda</ScrollFloat>
            </div>
            <div className="align-anim w-max mx-auto">
              <ScrollFloat textClassName="text-text-primary" stagger={0.02} animationDuration={1.2}>dalam Hitungan Detik</ScrollFloat>
            </div>
          </h1>

          <div className="flex flex-col mb-8 gap-1">
            <p className="align-anim w-max mx-auto text-base md:text-lg text-text-secondary leading-relaxed">
              Dapatkan feedback UI/UX dari <strong className="text-text-primary">AI</strong> secara instan
            </p>
            <p className="align-anim w-max mx-auto text-base md:text-lg text-text-secondary leading-relaxed">
              dan masukan autentik dari <strong className="text-text-primary">komunitas developer</strong>.
            </p>
          </div>

          <div className="align-anim w-max mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="cursor-target group relative px-8 py-3.5 cyber-cut bg-[#8A2BE1] text-[#F9F9FD] font-bold text-lg hover:shadow-2xl hover:shadow-[#8A2BE1]/30 transition-all duration-500 hover:-translate-y-1"
            >
              Mulai Evaluasi — Gratis
              <div className="absolute inset-0 cyber-cut bg-[#8A2BE1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
            </Link>
            <a
              href="#live-preview"
              className="cursor-target px-8 py-3.5 cyber-cut border border-border text-text-secondary font-medium hover:border-[#8A2BE1]/50 hover:text-[#8A2BE1] transition-all duration-300 backdrop-blur-sm bg-[#F9F9FD]/5"
            >
              Lihat Demo &rarr;
            </a>
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div
          ref={imageRef}
          className="absolute right-6 lg:right-10 w-full md:w-112.5 lg:w-137.5 z-10 hidden"
        >
          <div className="glass-card p-3 rounded-2xl bg-white/5 border border-white/10 shadow-2xl shadow-[#8A2BE1]/20 transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="w-full aspect-video bg-[#0A0A0A] rounded-xl flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
              <video 
                src="/klip_hero.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 bg-linear-to-tr from-[#8A2BE1]/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
