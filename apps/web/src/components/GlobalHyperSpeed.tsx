'use client';

import { usePathname } from 'next/navigation';
import HyperspeedBackground from './HyperspeedBackground';

export default function GlobalHyperspeed() {
  const pathname = usePathname();

  // Jangan tampilkan Hyperspeed di landing page dan upload
  if (pathname === '/' || pathname.startsWith('/upload')) {
    return null;
  }

  return <HyperspeedBackground />;
}