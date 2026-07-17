# WebInsight AI

## Pengembangan Platform Evaluasi UI/UX Website Berbasis Artificial Intelligence dan Community Review

# 1. Cover

**Nama Proyek:** WebInsight AI

**Judul Skripsi:** Pengembangan Platform Evaluasi UI/UX Website Berbasis
Artificial Intelligence dan Community Review

------------------------------------------------------------------------

# 2. Pendahuluan

## 2.1 Latar Belakang

Perkembangan teknologi web mendorong banyak individu, perusahaan, UMKM,
dan mahasiswa untuk membangun website sebagai media informasi maupun
layanan digital. Namun, memperoleh masukan mengenai kualitas User
Interface (UI) dan User Experience (UX) masih menjadi tantangan.
Feedback dari praktisi sering membutuhkan waktu, sedangkan evaluasi
manual bersifat subjektif.

WebInsight AI hadir sebagai platform yang menggabungkan Artificial
Intelligence (AI) dan Community Review. AI memberikan evaluasi awal
secara cepat, sedangkan Community Review menjadi ruang diskusi
independen untuk memperoleh perspektif dari pengguna lain.

## 2.2 Rumusan Masalah

-   Bagaimana membangun platform evaluasi UI/UX website yang mudah
    digunakan?
-   Bagaimana mengintegrasikan AI untuk memberikan evaluasi awal
    terhadap tampilan website?
-   Bagaimana menyediakan Community Review yang independen tanpa
    dipengaruhi hasil AI?

## 2.3 Tujuan

-   Mengembangkan platform evaluasi UI/UX website.
-   Mengimplementasikan AI sebagai evaluator otomatis.
-   Menyediakan Community Review sebagai media diskusi.

## 2.4 Manfaat

-   Membantu developer memperoleh feedback lebih cepat.
-   Membantu mahasiswa mengevaluasi proyek website.
-   Menjadi media diskusi desain website.

------------------------------------------------------------------------

# 3. Analisis Sistem

## Gambaran Sistem

Pengguna mengirim URL website atau screenshot. Sistem kemudian
menyediakan pilihan AI Review, Community Review, atau keduanya. AI
menghasilkan evaluasi privat, sedangkan Community Review hanya
menampilkan postingan tanpa hasil AI.

### Alur

``` text
Upload URL / Screenshot
        │
        ▼
Isi Informasi Website
        │
        ▼
Pilih Review
 ├── AI Review
 ├── Community Review
 └── AI + Community Review
```

## Target Pengguna

-   Frontend Developer
-   Fullstack Developer
-   UI/UX Designer
-   Mahasiswa
-   Startup
-   UMKM

------------------------------------------------------------------------

# 4. Analisis Fitur

## Login & Register

Autentikasi pengguna menggunakan JWT.

## Upload Website

-   URL Website
-   Upload Screenshot

## Informasi Website

-   Judul
-   Deskripsi
-   Kategori
-   Target Pengguna
-   Fokus Feedback

## AI Review

AI mengevaluasi: - Layout - Typography - Color - Navigation - CTA -
Accessibility

Output: - Nilai - Alasan - Rekomendasi

> Hasil AI hanya dapat dilihat oleh pemilik website.

## Community Review

Website dipublikasikan ke feed.

Fitur: - Komentar - Balasan - Diskusi - Like (opsional)

Community tidak dapat melihat hasil AI.

## Dashboard

-   Riwayat review
-   Statistik
-   Status review

## Admin

-   Kelola pengguna
-   Moderasi komentar
-   Kelola kategori

------------------------------------------------------------------------

# 5. Flowchart

Flow utama:

``` text
Upload
  │
Review
  │
AI / Community
  │
Hasil
```

------------------------------------------------------------------------

# 6. Use Case Diagram (Deskripsi)

User: - Login - Upload Website - AI Review - Publish - Memberi
Komentar - Membalas Komentar

Admin: - Kelola User - Moderasi Komentar

------------------------------------------------------------------------

# 7. Activity Diagram (Deskripsi)

Aktivitas utama: - Login - Upload - AI Review - Publish - Komentar -
Reply

------------------------------------------------------------------------

# 8. Sequence Diagram (Deskripsi)

``` text
User
 │
 ▼
Next.js
 │
 ▼
NestJS
 │
 ├── Playwright
 │
 ├── OpenRouter
 │
 ▼
PostgreSQL
```

------------------------------------------------------------------------

# 9. Database Design

Tabel utama:

-   users
-   websites
-   screenshots
-   ai_reviews
-   community_reviews
-   comments
-   notifications

------------------------------------------------------------------------

# 10. API Design

-   POST /auth/login
-   POST /auth/register
-   POST /websites
-   POST /reviews/ai
-   POST /community/posts
-   POST /comments
-   GET /dashboard

------------------------------------------------------------------------

# 11. Tech Stack

## Frontend

-   Next.js 15
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   TanStack Query

## Backend

-   NestJS
-   Prisma ORM
-   JWT Authentication

## Database

-   PostgreSQL

## AI

-   OpenRouter API

## Screenshot

-   Playwright

## Deployment

-   Vercel
-   Railway / Render
-   Supabase PostgreSQL

Alasan pemilihan: - TypeScript digunakan di frontend dan backend
sehingga konsisten. - NestJS cocok untuk REST API yang modular. -
PostgreSQL kuat untuk data relasional. - Playwright stabil untuk
screenshot website. - OpenRouter memudahkan pergantian model AI.

------------------------------------------------------------------------

# 12. AI Prompt Engineering

AI diminta mengevaluasi: - Layout - Typography - Color - Navigation -
CTA

Output berupa JSON berisi skor, alasan, dan rekomendasi.

------------------------------------------------------------------------

# 13. Arsitektur Sistem

``` text
Browser
   │
Next.js
   │
TanStack Query
   │
NestJS
 ├── Prisma
 ├── Playwright
 ├── OpenRouter
 └── PostgreSQL
```

------------------------------------------------------------------------

# 14. UI Design (Rencana)

-   Landing Page
-   Login
-   Register
-   Dashboard
-   Upload Website
-   Detail AI Review
-   Community Feed
-   Detail Diskusi
-   Profile
-   Admin Dashboard

------------------------------------------------------------------------

# 15. Roadmap

1.  Desain UI
2.  Setup Backend
3.  Database
4.  Upload URL & Screenshot
5.  Integrasi AI
6.  Community Review
7.  Dashboard
8.  Testing
9.  Deployment

------------------------------------------------------------------------

# 16. Future Development

-   Integrasi Figma
-   Export PDF
-   Multi-page Analysis
-   Accessibility Checker
-   Mobile Responsiveness Analyzer
-   Badge Reviewer

------------------------------------------------------------------------

# 17. Kesimpulan

WebInsight AI dirancang sebagai platform evaluasi UI/UX website yang
menggabungkan Artificial Intelligence dan Community Review. AI
memberikan evaluasi awal secara cepat dan privat, sedangkan Community
Review menyediakan ruang diskusi independen agar pengguna memperoleh
masukan yang lebih beragam. Dengan arsitektur modern menggunakan
Next.js, NestJS, PostgreSQL, Prisma, Playwright, dan OpenRouter,
platform ini memiliki ruang lingkup yang realistis untuk skripsi
sekaligus berpotensi dikembangkan menjadi produk nyata.
