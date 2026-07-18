# DesignLens AI

## Pengembangan Platform Evaluasi UI/UX Website Berbasis Artificial Intelligence dan Community Review

# 1. Cover

**Nama Proyek:** DesignLens AI

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

# Tambahan sedikit
OpenRouter — OpenRouter menyediakan 28+ model dengan biaya $0 per token (ID model yang diakhiri :free), bisa dipakai dengan saldo $0 tanpa kartu kredit, dan model gratis ini dibatasi lewat rate limit, bukan kredit. Batasannya: cap 20 request/menit tetap berlaku meski sudah top-up, tapi top-up sekali sebesar $10 (kredit tidak kedaluwarsa) menaikkan cap harian dari 50 menjadi 1.000 request per hari. Untuk model gratisnya sendiri, pilihannya termasuk Qwen3 Coder, DeepSeek V4 Flash, Llama 3.3 70B, Google Gemma 4 31B, hingga OpenAI GPT-OSS 120B — bukan model "kaleng", beberapa memang cukup layak dipakai produksi. UsagePricingUsagePricing
Artinya untuk tugas kuliah Anda: pakai model :free di OpenRouter itu cukup gratis dan cukup layak untuk demo/testing 2 minggu ini — asal Anda sadar rate limit-nya (20 req/menit, maks 50-1000 req/hari). Kalau demo di depan kelas dengan traffic rendah, ini realistis tidak akan kena biaya sama sekali.
Untuk hosting (Vercel, Railway/Render, Supabase) — semuanya juga punya free tier, tapi dengan batas compute hours/bandwidth/koneksi database yang cukup untuk skala tugas kuliah (bukan produksi nyata). Jadi kesimpulannya: bisa $0 total kalau Anda pakai model :free + free tier hosting, tapi tetap ada batas rate/kuota yang perlu diperhitungkan saat demo langsung — bukan "gratis unlimited", tapi "gratis dengan pagar". Pokoknya yang gratis

# Relasi kunci:

WEBSITES adalah tabel pusat — terhubung ke USERS (siapa upload), CATEGORIES, SCREENSHOTS, AI_REVIEWS, dan COMMUNITY_POSTS.
AI_REVIEWS sengaja dibuat 1-ke-1 (opsional) dengan WEBSITES — kalau nanti mau fitur "re-review" (user minta AI menilai ulang), ubah jadi 1-ke-N.
COMMENTS punya parent_comment_id yang self-referencing ke tabel dirinya sendiri — ini yang menangani fitur "reply" berjenjang tanpa perlu tabel terpisah.
LIKES dibuat tabel sendiri (bukan kolom counter di COMMENTS) supaya bisa cegah user like berkali-kali pada komentar yang sama (unique constraint di user_id + comment_id).
ai_reviews.reasoning dan recommendation saya set tipe text (bukan string) karena isinya kemungkinan panjang — hasil penjelasan AI biasanya beberapa kalimat per kategori.

Yang perlu Anda putuskan sendiri sebelum implementasi ke Prisma schema:

Apakah reasoning disimpan sebagai satu blok teks panjang, atau JSON terstruktur per kategori (misalnya {"layout": "...", "typography": "..."}). JSON lebih fleksibel kalau nanti mau ditampilkan per-kategori di UI.
role di tabel USERS sebaiknya pakai enum (user, admin) di level database/Prisma, bukan string bebas, supaya tidak salah ketik.
(Itu nanti sesuaikan juga)

Lalu lanjutkan dengan Schema prisma nya 