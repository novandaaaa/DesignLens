import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import GlobalBackground from "@/components/GlobalBackground";
import TargetCursor from "@/components/TargetCursor";

const inter = Inter({
  variable: "--font-geist-sans",
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
    <html lang="id" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased cursor-none">
        {/* 
          Catatan: 
          - 'color' menggantikan 'cursorColor'
          - 'mixBlendMode' bisa digunakan untuk efek blending (default: 'screen')
          - Cursor default disembunyikan menggunakan class 'cursor-none' pada body
        */}
        <TargetCursor
          color="#7dd3fc"
          trailLength={50}
          inertia={0.5}
          bloomStrength={0.15}
          bloomRadius={1.0}
          mixBlendMode="screen"
          zIndex={50}
        />
        
        <GlobalBackground />
        <div className="relative z-10">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}