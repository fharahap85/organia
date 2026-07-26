# ORGANIA

**Sistem Informasi Manajemen Organisasi & Kaderisasi**

Organia adalah platform manajemen organisasi berbasis web yang dirancang untuk mendigitalkan administrasi organisasi kemasyarakatan dan kaderisasi — mulai dari agenda & absensi QR, surat-menyurat massal dengan tanda tangan digital, laporan bulanan otomatis, pencatatan keuangan kegiatan dengan OCR struk, hingga pendataan kader dan keluarga dengan notifikasi jenjang pendidikan anak.

## Fitur Utama

| Modul | Deskripsi |
|-------|-----------|
| **Agenda & Absensi QR** | Buat agenda dengan QR code unik, kolom absensi kustom, rekap real-time |
| **Surat-Menyurat** | Generate surat massal dari template, penomoran otomatis, tanda tangan digital |
| **Laporan Bulanan** | Laporan otomatis dari rekap agenda, kehadiran, dan keuangan per periode |
| **Keuangan Kegiatan** | Upload struk dengan OCR (Tesseract), verifikasi manual, ekspor PDF gabungan |
| **Data Kader & Keluarga** | Profil kader, data keluarga, notifikasi jenjang pendidikan anak |
| **Jenjang Kaderisasi** | Rapor kader, riwayat pelatihan, syarat kenaikan jenjang |
| **Dokumentasi Kegiatan** | Galeri foto/video per agenda, terintegrasi dengan laporan |
| **Notifikasi Terpusat** | In-app notification untuk pengingat agenda, surat, verifikasi struk, dll |
| **Manajemen Pengguna** | RBAC multi-peran, periodisasi kepengurusan, struktur organisasi |
| **Halaman Publik** | Profil organisasi, struktur pengurus, kalender kegiatan (opsional) |

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Backend** | Laravel (REST API, Sanctum auth) |
| **Frontend** | React + TypeScript (SPA) |
| **Database** | PostgreSQL |
| **Queue** | Laravel Queue (database/Redis) |
| **OCR** | Tesseract OCR + Intervention Image |
| **PDF** | Spatie Laravel PDF / DomPDF |
| **QR Code** | Simple QR Code |
| **Hosting** | VPS (Docker) |

## Arsitektur

API-first architecture — backend Laravel menyediakan REST API yang dikonsumsi oleh frontend React SPA terpisah. Proses berat (OCR, generate PDF) dijalankan via background queue.

## Struktur Proyek

```
organia/
├── backend/          # Laravel REST API
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/         # React + TypeScript SPA
│   ├── src/
│   └── ...
├── docs/             # Dokumentasi tambahan
├── PRD_Organia.md    # Product Requirements Document
└── WORKFLOW.md       # Pola kerja & branching convention
```

## Persiapan Pengembangan

### Prasyarat

- PHP 8.x + Composer
- Node.js 18+ + npm
- PostgreSQL
- Tesseract OCR (untuk fitur struk)

### Setup Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

## Pengembangan

Lihat [WORKFLOW.md](WORKFLOW.md) untuk pola kerja, branching convention, dan panduan testing.

Dokumen lengkap requirements tersedia di [PRD_Organia.md](PRD_Organia.md).

## Lisensi

Hak cipta © 2026 — Abdullah Fikri Harahap. Digunakan untuk keperluan pengembangan dan portofolio.
