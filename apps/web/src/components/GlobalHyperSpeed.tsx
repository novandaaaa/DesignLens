'use client';

import { usePathname } from 'next/navigation';
import HyperspeedBackground from './HyperspeedBackground';

/**
 * Hyperspeed dipasang global (semua halaman), KECUALI di halaman upload —
 * di situ udah ada ThreeFloatingObjects (mode subtle) yang jalan, dan
 * halaman upload biasanya fokus ke form, jadi sengaja dijaga ringan.
 *
 * Di landing page ('/'), Hyperspeed tetap jalan berdampingan dengan
 * ThreeBackground (lihat HyperspeedBackground.tsx: z-index -20, di
 * belakang ThreeBackground yang -z-10).
 */
export default function GlobalHyperspeed() {
  const pathname = usePathname();

  const isSkipped = pathname.startsWith('/upload');

  if (isSkipped) return null;

  return <HyperspeedBackground />;
}
