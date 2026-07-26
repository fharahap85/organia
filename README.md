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
| **Manajemen Pengguna** | RBAC multi-peran (Superadmin, Ketua, Sekretaris, Bendahara, Kaderisasi, BIPEKA), periodisasi kepengurusan |
| **Halaman Publik** | Profil organisasi, struktur pengurus, kalender kegiatan (opsional) |
| **Kelompok Mentoring** | CRUD mentoring group & members |

## Arsitektur

API-first — backend Laravel menyediakan REST API yang dikonsumsi oleh frontend React SPA terpisah. Proses berat (OCR, generate PDF, notifikasi) dijalankan via background queue.

```
organia/
├── backend/              # Laravel 12 API (PHP 8.2+)
│   ├── app/
│   │   ├── Http/Controllers/Api/   # REST API controllers
│   │   ├── Models/                 # Eloquent models
│   │   ├── Services/               # Business logic services
│   │   └── Traits/                 # Shared traits
│   ├── database/
│   │   ├── migrations/             # Schema definitions
│   │   └── seeders/                # Initial data seeders
│   ├── routes/api.php              # API route definitions
│   └── tests/                      # PHPUnit tests
├── frontend/             # React 19 + TypeScript SPA
│   └── src/
│       ├── components/             # Shared components (Layout, AuthGuard)
│       ├── pages/                  # Page components
│       ├── services/               # Axios API client
│       └── store/                  # Zustand auth store
├── PRD_Organia.md        # Product Requirements Document
└── WORKFLOW.md            # Pola kerja & branching convention
```

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Backend** | Laravel 12, PHP 8.2, Sanctum |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Zustand, React Router v7 |
| **Database** | PostgreSQL |
| **Queue** | Laravel Queue (database/Redis) |
| **OCR** | Tesseract OCR + Intervention Image |
| **PDF** | Spatie Laravel PDF / DomPDF |
| **QR Code** | Simple QR Code |
| **Testing** | PHPUnit 11 |
| **Hosting** | VPS (Docker) |

## Setup Lokal

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Default login: `superadmin@organia.local` / `password`

## Testing
```bash
cd backend
php artisan test
```

22 tests mencakup:
- **Unit**: SuratService, PendidikanEstimatorService, LaporanGeneratorService
- **Feature**: Auth (login, logout, me, RBAC)

## API Endpoints

### Public (Tanpa Auth)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/login` | Login & dapatkan token |
| GET | `/api/public/profile` | Profil organisasi |
| GET | `/api/public/struktur` | Struktur kepengurusan aktif |
| GET | `/api/public/agendas` | Daftar agenda publik |
| GET | `/api/public/agenda/{uuid}` | Detail agenda untuk absen QR |
| POST | `/api/public/agenda/{uuid}/absen` | Submit absensi publik |

### Protected (Bearer Token)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/logout` | Logout |
| GET | `/api/me` | Data user login |
| CRUD | `/api/agendas` | Manajemen agenda |
| CRUD | `/api/template-absensis` | Template form absensi |
| CRUD | `/api/users` | Manajemen user (Superadmin) |
| CRUD | `/api/periodes` | Manajemen periode (Superadmin) |
| CRUD | `/api/strukturs` | Struktur organisasi (Superadmin) |
| CRUD | `/api/surat/templates` | Template surat |
| POST | `/api/surat/generate` | Generate surat dari template |
| CRUD | `/api/keuangan/struk` | Upload & verifikasi struk |
| GET | `/api/keuangan/summary` | Ringkasan keuangan per agenda |
| CRUD | `/api/kader` | Data kader & HRIS |
| CRUD | `/api/mentoring-groups` | Kelompok mentoring |

## Pengembangan

Lihat [WORKFLOW.md](WORKFLOW.md) untuk pola kerja, branching convention, dan panduan testing.

Dokumen lengkap requirements tersedia di [PRD_Organia.md](PRD_Organia.md).

## Lisensi

Hak cipta © 2026 — Abdullah Fikri Harahap. Digunakan untuk keperluan pengembangan dan portofolio.
