# Organia — Implementation Guide untuk AI & Junior Developer

Dokumen ini adalah panduan langkah demi langkah (step-by-step) untuk mengimplementasikan **Organia** berdasarkan PRD yang ada di folder `docs/prd/`. 

Jika Anda adalah seorang Junior Programmer atau AI Assistant (seperti Claude, GPT, atau Gemini), **GUNAKAN DOKUMEN INI SEBAGAI MASTER PROMPT / ROADMAP UTAMA ANDA**. Jangan melompat ke tahap berikutnya sebelum tahap saat ini selesai dan diuji.

---

## 📌 Instruksi Penting untuk AI / Junior Developer

1. **Baca PRD Terkait:** Sebelum memulai setiap tahap atau modul, **WAJIB** membaca file PRD terkait di folder `docs/prd/` (misalnya, sebelum mengerjakan Agenda, baca `docs/prd/03-modules/03a-agenda-absensi.md`).
2. **Satu Modul Sekali Jalan:** Kerjakan satu modul hingga tuntas (Backend + Frontend) sebelum beralih ke modul lain.
3. **Konfirmasi Sebelum Eksekusi Besar:** Jika Anda adalah AI, selalu minta konfirmasi *User* sebelum menjalankan perintah yang memodifikasi banyak file, melakukan migrasi database besar, atau menginstal dependensi berat.
4. **Gunakan Branching:** Jika memungkinkan, gunakan git branch per fitur (misalnya `feature/01-auth-rbac`).
5. **Backend & Frontend Separation:** 
   - Backend: **Laravel** (Hanya REST API, route di `routes/api.php`)
   - Frontend: **React + TypeScript + Vite**
   - Database: **PostgreSQL**

---

## 🛠️ Tahap 0: Persiapan & Setup Lingkungan (Setup)

**Tujuan:** Menyiapkan kerangka kerja dasar untuk Backend dan Frontend.

- [ ] **0.1 Setup Backend (Laravel)**
  - Inisialisasi project Laravel baru.
  - Konfigurasi file `.env` untuk koneksi PostgreSQL.
  - Install **Laravel Sanctum** untuk autentikasi API.
  - Setup struktur folder API (Controllers, Resources, Requests, Models).
- [ ] **0.2 Setup Frontend (React)**
  - Inisialisasi React dengan Vite & TypeScript (misal di folder `frontend/` atau repository terpisah).
  - Install dependensi utama: React Router, Axios, Tailwind CSS (jika dipakai), dan State Management (Zustand/TanStack Query).
  - Konfigurasi Axios instance untuk menyisipkan token Sanctum di setiap request.
- [ ] **0.3 Desain Skema Database Dasar**
  - Baca `docs/prd/06-data-model.md`.
  - Buat diagram/skema awal dan diskusikan dengan tim/User sebelum membuat file migrasi.

---

## 🏗️ Tahap 1: Fondasi & Auth (Mengacu ke Fase 1 PRD)

**Tujuan:** Sistem autentikasi, pengaturan role (RBAC), dan struktur periode organisasi berfungsi.

- [ ] **1.1 Migrasi & Model User, Role, Periode**
  - Buat migration untuk tabel `users`, `roles`, `permissions`, `periode_kepengurusans`, `struktur_organisasis`.
  - Referensi: `03-modules/03f-manajemen-pengguna.md`.
- [ ] **1.2 Auth & RBAC Middleware (Backend)**
  - Buat endpoint API Login, Logout, dan Get Profile (`/api/auth/...`).
  - Buat Middleware Laravel untuk membatasi akses berdasarkan peran (Superadmin, Ketua, Sekretaris, dll). Referensi: `01-users-and-roles.md`.
- [ ] **1.3 Integrasi Auth di Frontend**
  - Buat halaman Login.
  - Buat sistem Protected Route di React (hanya bisa diakses jika sudah login).
  - Buat layout Dashboard dasar (Sidebar, Header, Main Content).
- [ ] **1.4 CRUD Manajemen Pengguna & Periode (Superadmin)**
  - Buat API Endpoint CRUD untuk User dan Periode.
  - Buat antarmuka (UI) di Frontend agar Superadmin bisa menambah user dan menetapkan periode kepengurusan.

---

## 📅 Tahap 2: Agenda & Absensi QR (Mengacu ke Fase 1 PRD)

**Tujuan:** Sekretaris bisa membuat agenda dan peserta bisa absen via QR Code.

- [ ] **2.1 Migrasi & Model Agenda & Absensi**
  - Tabel `agendas`, `template_absensis`, dan `absensis`.
  - Gunakan tipe data `JSON` atau `JSONB` untuk tabel `absensis` agar kolom absensinya fleksibel.
- [ ] **2.2 API & UI Agenda (Sekretaris)**
  - Buat API CRUD Agenda.
  - Buat halaman Frontend untuk melihat daftar agenda dan membuat agenda baru.
  - Referensi: `03-modules/03a-agenda-absensi.md`.
- [ ] **2.3 QR Code & Form Publik**
  - Install library QR Code di Laravel (misal: `simplesoftwareio/simple-qrcode`).
  - Buat endpoint publik (tanpa middleware auth) untuk form absensi.
  - Buat halaman frontend publik untuk peserta mengisi data kehadiran setelah scan QR.
- [ ] **2.4 Rekap Kehadiran**
  - Buat halaman di dashboard agar Sekretaris bisa memantau siapa saja yang sudah absen secara real-time.
  - Buat fitur export data kehadiran ke Excel/CSV.

---

## ✉️ Tahap 3: Surat-Menyurat & Dokumentasi (Mengacu ke Fase 2 PRD)

**Tujuan:** Arsip surat menyurat digital dan galeri kegiatan.

- [ ] **3.1 Migrasi Surat & Dokumentasi**
  - Tabel `template_surats`, `surats`, `surat_masuks`, dan `dokumentasi_kegiatans`.
- [ ] **3.2 Fitur Surat-Menyurat (Sekretaris)**
  - Buat fitur CRUD Template Surat (mendukung variable/placeholder seperti `{{nama}}`).
  - Buat logika penomoran surat otomatis di backend.
  - Implementasi *Bulk Generation* (Generate banyak surat sekaligus) menggunakan **Laravel Queue** agar server tidak hang.
  - Integrasi generator PDF (misal `barryvdh/laravel-dompdf`).
  - Referensi: `03-modules/03b-surat-menyurat.md`.
- [ ] **3.3 Fitur Dokumentasi Kegiatan**
  - Buat fitur upload foto/video yang di-attach ke spesifik ID Agenda.
  - Referensi: `03-modules/03h-dokumentasi.md`.

---

## 💰 Tahap 4: Keuangan Kegiatan & Laporan (Mengacu ke Fase 3 PRD)

**Tujuan:** Otomatisasi pembacaan struk dengan OCR dan pembuatan laporan bulanan.

- [ ] **4.1 Migrasi Struk & Laporan**
  - Tabel `struks` dan `laporan_bulanans`.
- [ ] **4.2 Integrasi Tesseract OCR (Bendahara)**
  - Setup proses upload gambar ke server.
  - Integrasikan library untuk memanggil perintah Tesseract OCR di backend (Proses ini **wajib** menggunakan Queue).
  - Parsing teks hasil OCR untuk mengambil Nominal, Tanggal, dan Vendor.
  - Buat UI Frontend agar Bendahara bisa memverifikasi dan mengoreksi hasil OCR sebelum disimpan.
  - Referensi: `03-modules/03d-keuangan.md`.
- [ ] **4.3 Generate Laporan Akhir Bulan**
  - Buat query agregasi yang menggabungkan data Agenda, Absensi, dan Struk Pengeluaran dalam rentang bulan tertentu.
  - Jadikan hasil agregasi tersebut menjadi file PDF yang rapi.
  - Referensi: `03-modules/03c-laporan-bulanan.md`.

---

## 🎓 Tahap 5: Kader, Kaderisasi & Notifikasi (Mengacu ke Fase 4 PRD)

**Tujuan:** Manajemen data keluarga kader dan notifikasi terpusat.

- [ ] **5.1 Migrasi Data Kader & Jenjang**
  - Tabel `kaders`, `anggota_keluargas`, `riwayat_pendidikan_anaks`, `jenjang_kaderisasis`.
  - **Penting:** Setup enkripsi di model Laravel untuk field sensitif (seperti NIK, Nama Anak, dll).
- [ ] **5.2 CRUD Data Kader (Kaderisasi)**
  - Buat halaman untuk menginput data kader dan data anggota keluarganya.
  - Referensi: `03-modules/03e-kader-keluarga.md`.
- [ ] **5.3 Logika Estimasi Jenjang Pendidikan**
  - Buat *Cron Job* (Laravel Scheduler) yang berjalan setiap hari untuk mengecek umur anak kader.
  - Buat logika: Jika umur mendekati batas masuk sekolah (TK/SD/SMP/SMA), masukkan data ke tabel `notifikasi_sistems`.
- [ ] **5.4 Modul Notifikasi**
  - Buat API untuk mengambil list notifikasi per user.
  - Buat komponen icon "Lonceng" (Bell) di Frontend yang memunculkan dropdown notifikasi.
  - Referensi: `03-modules/03i-notifikasi.md`.

---

## 🌐 Tahap 6: Halaman Publik & Finalisasi (Mengacu ke Fase 5 PRD)

**Tujuan:** Publikasi profil organisasi ke masyarakat luas.

- [ ] **6.1 Halaman Publik (Frontend)**
  - Buat halaman *Landing Page* publik tanpa perlu login.
  - Tarik data Struktur Organisasi (dari modul 1) dan Agenda Publik (dari modul 2) melalui endpoint API publik.
  - Referensi: `03-modules/03j-halaman-publik.md`.
- [ ] **6.2 Polish & Bug Fixing**
  - Lakukan pengujian E2E (End-to-End).
  - Perbaiki error visual dan bugs.
  - Susun dokumentasi (API Documentation menggunakan Postman/Swagger).

---

## 🤖 Workflow Harian untuk AI Model

Saat Anda (AI) diminta untuk memulai, gunakan alur percakapan berikut:

1. **AI:** "Tahap mana yang ingin kita kerjakan hari ini? (Misal: 1.2 Auth & RBAC)"
2. **User:** "Kerjakan 1.2"
3. **AI:** (Membaca file PRD yang relevan) -> "Berikut adalah rancangan API dan struktur komponen React-nya. Apakah boleh saya mulai membuat file-filenya?"
4. **User:** "Lanjut"
5. **AI:** (Generate kode backend & frontend, lalu melaporkan hasil dan cara testingnya).

Selamat bekerja! Ingat untuk selalu menjaga kode tetap bersih (Clean Code), berikan komentar pada logika yang rumit, dan utamakan keamanan data.
