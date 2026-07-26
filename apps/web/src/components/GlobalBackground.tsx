'use client';

import { usePathname } from 'next/navigation';
import ThreeFloatingObjects from '@/components/ThreeFloatingObjects';

/**
 * Background 3D global untuk semua halaman selain landing page.
 * Landing page (route "/") sudah punya ThreeBackground sendiri
 * (versi lengkap dengan monitor + partikel + ring), jadi di sini
 * sengaja di-skip supaya tidak dobel render 2 canvas WebGL sekaligus.
 */
export default function GlobalBackground() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return <ThreeFloatingObjects />;
}
