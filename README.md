# Organia - Sistem Informasi Organisasi & Kaderisasi

Platform manajemen organisasi modern berbasis Laravel + React dengan fitur autentikasi, manajemen kader, keuangan OCR, dan halaman publik.

## Arsitektur

```
organia/
├── backend/          # Laravel 12 API (PHP 8.2+)
│   ├── app/
│   │   ├── Http/Controllers/Api/   # REST API controllers
│   │   ├── Models/                 # Eloquent models
│   │   ├── Services/               # Business logic services
│   │   └── Traits/                 # Shared traits (Trackable)
│   ├── database/
│   │   ├── migrations/             # Schema definitions
│   │   └── seeders/                # Initial data seeders
│   └── tests/                      # PHPUnit tests
├── frontend/         # React 19 + TypeScript SPA
│   └── src/
│       ├── components/             # Shared components (Layout, AuthGuard)
│       ├── pages/                  # Page components
│       ├── services/               # Axios API client
│       └── store/                  # Zustand auth store
└── prd/              # Product Requirement Documents
```

## Fitur Utama

| Modul | Deskripsi |
|-------|-----------|
| **Auth & RBAC** | Login Sanctum, 6 role (Superadmin, Ketua, Sekretaris, Bendahara, Kaderisasi, BIPEKA) |
| **Agenda & Absensi** | CRUD agenda, QR code absensi, export CSV, absensi publik via QR scan |
| **Surat-Menyurat** | Template surat, auto-generate nomor surat, verifikasi publik |
| **Keuangan & OCR** | Upload struk, ekstraksi OCR, verifikasi transaksi, export PDF |
| **Laporan Bulanan** | Auto-generate laporan statistik (agenda, keuangan, surat, kehadiran) |
| **Data Kader & HRIS** | Data kader, keluarga, jenjang kaderisasi, estimasi pendidikan anak |
| **Kelompok Mentoring** | CRUD mentoring group & members |
| **Halaman Publik** | Landing page tanpa auth (visi, misi, struktur, kalender kegiatan) |

## Instalasi Local

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
cp .env.example .env
npm run dev
```

Default login: `superadmin@organia.local` / `password`

## Testing

```bash
cd backend
php artisan test
```

22 tests mencakup:
- Unit: SuratService, PendidikanEstimatorService, LaporanGeneratorService
- Feature: Auth (login, logout, me, RBAC)

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

## Tech Stack

- **Backend:** Laravel 12, PHP 8.2, SQLite/PostgreSQL, Sanctum
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Zustand, React Router v7
- **Testing:** PHPUnit 11, PHPUnit SQLite in-memory
