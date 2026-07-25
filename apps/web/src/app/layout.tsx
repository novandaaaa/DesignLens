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
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
          cursorColor="#7dd3fc"
          cursorColorOnTarget="#f472b6"
        /> {/* ⬅️ tambahkan ini, di luar div z-10 juga tidak masalah */}
        <GlobalBackground />
        <div className="relative z-10">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}