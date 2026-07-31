import type { Metadata } from "next";
import { Orbitron, Rajdhani, Exo_2, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import TargetCursor from "@/components/TargetCursor";
import Dither from "@/components/Dither";

import SmoothScroll from "@/components/SmoothScroll";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DesignLens AI — Platform Evaluasi UI/UX Website",
  description:
    "Platform evaluasi UI/UX website berbasis AI dan Community Review. Dapatkan feedback desain website Anda secara cepat dan akurat.",
  keywords: ["UI/UX", "design review", "website evaluation", "AI", "community feedback"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${orbitron.variable} ${rajdhani.variable} ${exo2.variable} ${inter.variable} dark`}>
      <body className="min-h-screen bg-transparent text-foreground font-sans antialiased">
        <SmoothScroll>
          <AuthProvider>
            <div className="fixed inset-0 -z-50 pointer-events-none">
             <Dither
  waveColor={[0.239, 0.239, 0.239]}
  disableAnimation={false}
  enableMouseInteraction={true}
  mouseRadius={0.3}
  colorNum={4}
  waveAmplitude={0.3}
  waveFrequency={3}
  waveSpeed={0.05}
>
  <></>
</Dither>
            </div>
            <TargetCursor />
            {children}
          </AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
