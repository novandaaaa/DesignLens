'use client';

import { useMemo } from 'react';
import Hyperspeed, { type EffectOptions } from './Hyperspeed';

// Konstanta di luar komponen (bukan di dalam useMemo) supaya reference-nya
// selalu stabil antar render — sesuai catatan di dokumentasi Hyperspeed
// soal memoize effectOptions untuk menghindari WebGL scene dibuat ulang
// terus-menerus.
const brandEffectOptions: EffectOptions = {
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  colors: {
    roadColor: 0x080810,
    islandColor: 0x0a0a14,
    background: 0x000000,
    shoulderLines: 0x6366f1,
    brokenLines: 0x6366f1,
    // Warna mobil kiri/kanan & light sticks disamakan ke palet brand
    // (indigo/purple/pink/teal) biar nyambung sama ikon-ikon di ThreeBackground
    leftCars: [0x6366f1, 0xa855f7, 0xec4899],
    rightCars: [0x2dd4bf, 0x6366f1, 0xa855f7],
    sticks: 0xa855f7,
  },
};

/**
 * Hyperspeed dipasang sebagai lapisan PALING belakang, di bawah
 * ThreeBackground (monitor + ikon). Sengaja pakai z-index lebih negatif
 * (-20) dari ThreeBackground (-10) supaya dia "mengintip" lewat celah
 * transparan di scene ThreeBackground, bukan menutupinya.
 *
 * Hanya dipasang di landing page (bukan lewat GlobalBackground/layout)
 * karena ini WebGL context KEDUA yang jalan bersamaan dengan
 * ThreeBackground — kalau dipasang global di semua halaman, biayanya ke
 * GPU jadi berlipat ganda di setiap route.
 */
export default function HyperspeedBackground() {
  const effectOptions = useMemo(() => brandEffectOptions, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -20,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <Hyperspeed effectOptions={effectOptions} />
    </div>
  );
}
