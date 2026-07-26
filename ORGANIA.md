# ORGANIA — Project Reference

Sistem Informasi Manajemen Organisasi & Kaderisasi.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 6, Vite 8, TailwindCSS 4, Zustand 5 |
| Backend | Laravel 12, PHP 8.2 |
| Database | PostgreSQL |
| Auth | Laravel Sanctum (token-based) |
| UI Icons | lucide-react |
| HTTP Client | axios |
| QR Code | simplesoftwareio/simple-qrcode (backend) |
| OCR | thiagoalessio/tesseract_ocr (receipt scanning) |
| PDF | barryvdh/laravel-dompdf (laporan, surat) |

---

## Roles (RBAC)

| Role | Access Level |
|------|------------|
| **Superadmin** | Bypasses all permission checks; accesses route groups with `role:Superadmin` middleware |
| **Ketua** | Full operational access to all modules |
| **Sekretaris** | Agendas, Surat, Laporan |
| **Bendahara** | Keuangan |
| **Kaderisasi** | Kader, Mentoring, Kaderisasi jenjang |
| **BIPEKA** | Kader, Mentoring, Agendas |

Note: Every page with an inline sidebar checks `user.role.name` to filter visible sidebar items. `AuthGuard` component supports `requiredRole`, `allowedRoles[]`, and `requiredPermission` props.

---

## Folder Structure

```
organia/
├── backend/              # Laravel 12 API
│   ├── app/
│   │   ├── Models/       # 22 models (Eloquent)
│   │   ├── Http/Controllers/Api/  # 15 controllers
│   │   ├── Http/Middleware/       # CheckRole, EnsureTokenFromQueryString
│   │   ├── Services/     # SuratService, OcrService, LaporanGeneratorService, PendidikanEstimatorService
│   │   ├── Jobs/         # GenerateBulkSuratJob, ProsesOcrStrukJob, GenerateLaporanPdfJob
│   │   └── Traits/       # Trackable (auto set created_by/updated_by)
│   ├── routes/api.php    # ~75+ endpoints
│   ├── database/migrations/  # 25 migrations (20 app + 5 Laravel core)
│   └── config/
│       ├── app.php       # FRONTEND_URL, APP_TIMEZONE config
│       ├── cors.php      # CORS for localhost:5173
│       └── sanctum.php
│
├── frontend/             # React 19 + Vite 8
│   └── src/
│       ├── pages/        # 24 page components
│       ├── components/   # AuthGuard, Layout, SignaturePad
│       ├── services/     # api.ts (axios instance)
│       ├── store/        # authStore.ts (zustand)
│       └── types/        # (empty, types defined inline)
│
├── PRD_Organia.md        # Product requirements (341 lines)
├── WORKFLOW.md           # Branching/PR convention (158 lines)
└── ORGANIA.md            # THIS FILE — project reference
```

---

## Database Schema (20 Tables)

### Core Auth
- `users` — id, name, email, password, role_id (FK->roles), periode_id (FK->periode_kepengurusans), status, signature_path, created_by, updated_by, timestamps, softDeletes
- `roles` — id, name, timestamps
- `permissions` — id, name, timestamps
- `role_permissions` — role_id (FK), permission_id (FK), PK(role_id, permission_id)
- `personal_access_tokens` — Sanctum tokens

### Periode & Struktur
- `periode_kepengurusans` — id, nama_periode, tanggal_mulai, tanggal_selesai, is_active, created_by, updated_by, timestamps, softDeletes
- `struktur_organisasis` — id, periode_id (FK), parent_id (FK self), jabatan, user_id (FK), created_by, updated_by, timestamps, softDeletes

### Agenda & Absensi
- `agendas` — id, judul, deskripsi, tanggal_mulai, tanggal_selesai, lokasi, bidang_penyelenggara, status (draft/aktif/selesai), is_publik, uuid_qr, template_absensi_id, created_by, updated_by, timestamps, softDeletes
- `template_absensis` — id, nama_template, **skema_kolom (jsonb)**, created_by, updated_by, timestamps, softDeletes
- `absensis` — id, agenda_id (FK), **data_kehadiran (jsonb)**, waktu_hadir, ditambahkan_oleh (nullable), timestamps, softDeletes

### Surat
- `template_surats` — id, judul_template, jenis_surat, konten_html (longText), layout_config (jsonb), created_by, updated_by, timestamps, softDeletes
- `surats` — id, nomor_surat, tanggal_surat, jenis_surat, template_id (FK), penerima_nama, penerima_data_json (jsonb), status_ttd, file_pdf_path, uuid_verifikasi, created_by, updated_by, timestamps, softDeletes
- `surat_masuks` — id, nomor_surat, tanggal_terima, pengirim, perihal, file_lampiran_path, status_tindak_lanjut, disposisi_ke_bidang, created_by, updated_by, timestamps, softDeletes

### Keuangan
- `struks` — id, agenda_id (FK), file_gambar_path, nominal, tanggal_transaksi, nama_vendor, status_verifikasi (pending/verified/rejected), ocr_raw_text, low_confidence_flags (jsonb), created_by, updated_by, timestamps, softDeletes

### Laporan
- `laporan_bulanans` — id, bulan, tahun, tipe_laporan (gabungan/per-bidang), bidang, file_pdf_path, generated_by (FK), timestamps, softDeletes

### Kader & Mentoring
- `kaders` — id, user_id (FK nullable), nama_lengkap, nik (encrypted), tempat_lahir, tanggal_lahir, alamat, no_hp, email, status_keanggotaan, timestamps, softDeletes
- `anggota_keluargas` — id, kader_id (FK), tipe_hubungan (pasangan/anak), nama, tanggal_lahir (encrypted), jenis_kelamin, timestamps, softDeletes
- `riwayat_pendidikan_anaks` — id, anggota_keluarga_id (FK), jenjang (TK/SD/SMP/SMA/Kuliah), nama_sekolah, tahun_masuk, is_estimasi, timestamps, softDeletes
- `kaderisasi_records` — id, kader_id (FK), jenjang (MAPABA/PKD/PKL), tahun_lulus, predikat, sertifikat_file, timestamps
- `kader_ratings` — id, kader_id (FK), kepemimpinan (int), loyalitas (int), komunikasi (int), kreativitas (int), catatan, rated_by (FK), timestamps
- `mentoring_groups` — id, nama_kelompok, mentor_id (FK->kaders), tingkat, status, timestamps
- `mentoring_members` — id, mentoring_group_id (FK), kader_id (FK), status, timestamps, UNIQUE(mentoring_group_id, kader_id)

### Other
- `organization_profiles` — id, name, logo_url, visi, misi, sejarah, kontak, is_public_page_active
- `dokumentasi_kegiatans` — id, agenda_id (FK), file_path, tipe_file (image/video), caption, uploaded_by, timestamps, softDeletes

### Key JSONB Columns
| Table | Column | Content |
|-------|--------|---------|
| `template_absensis` | skema_kolom | `[{name, label, type, required, options?}]` |
| `absensis` | data_kehadiran | Dynamic key-value per `skema_kolom` definition |
| `surats` | penerima_data_json | `{nama, jabatan, ...}` (resolved placeholders) |
| `template_surats` | layout_config | `{placeholders: string[]}` |
| `struks` | low_confidence_flags | OCR warning flags array |

---

## API Routes — Key Endpoints

### Public (no auth)
```
GET  /login                                         # POST to login
GET  /public/agenda/{uuid_qr}                       # Get agenda + form schema for QR
POST /public/agenda/{uuid_qr}/absen                 # Submit attendance from QR
GET  /public/verifikasi-surat/{uuid_verifikasi}     # Verify letter
GET  /public/profile                                # Organization profile
GET  /public/struktur                               # Organization structure
GET  /public/agendas                                # Published agendas
```

### Protected (auth:sanctum)
```
# Agenda & Absensi
GET|POST     /agendas                                  # List/Create (apiResource)
GET|PUT|DEL  /agendas/{id}                             # Show/Update/Delete
GET          /agendas/{id}/qr                          # Generate QR SVG
GET          /agendas/{id}/absensi                     # List attendance
POST         /agendas/{id}/absensi/manual              # Manual add
PUT          /agendas/{agendaId}/absensi/{absensiId}   # Edit attendance
DELETE       /agendas/{agendaId}/absensi/{absensiId}   # Delete attendance
GET          /agendas/{id}/absensi/export?token=       # CSV export (manual auth)

# Template Absensi
GET|POST     /template-absensis                        # List/Create (apiResource)
GET|PUT|DEL  /template-absensis/{id}                   # Show/Update/Delete

# Documentation
GET|POST     /agendas/{id}/dokumentasi                 # List/Upload
DELETE       /dokumentasi/{id}                         # Delete

# Keuangan
GET|POST     /keuangan/struk
PUT|DEL      /keuangan/struk/{id}
GET          /keuangan/summary
GET          /keuangan/export-pdf

# Surat
GET|POST     /surat/templates
GET|PUT|DEL  /surat/templates/{id}
GET          /surat/keluar
POST         /surat/generate
GET|POST     /surat/masuk
POST         /surat/masuk/{id}
DELETE       /surat/masuk/{id}

# Laporan
GET          /laporan
POST         /laporan/preview
POST         /laporan/generate
DELETE       /laporan/{id}

# Kader
GET|POST     /kader
GET|PUT|DEL  /kader/{id}
POST         /kader/{id}/keluarga
DELETE       /keluarga/{id}
PUT          /pendidikan/{id}
POST         /kader/{id}/kaderisasi
DELETE       /kaderisasi/{id}
PUT          /kader/{id}/rating

# Mentoring
GET|POST     /mentoring-groups
GET|PUT|DEL  /mentoring-groups/{id}
POST         /mentoring-groups/{id}/members
DELETE       /mentoring-members/{id}
```

### Superadmin Only (role:Superadmin middleware)
```
apiResource /users, /periodes, /strukturs
GET|PUT     /organization-profile
GET         /roles
```

---

## Frontend Routes (React Router v7)

| Path | Component | Access |
|------|-----------|--------|
| `/` | LandingPage | Public |
| `/login` | Login | Public |
| `/403` | Forbidden | Public |
| `/absen/:uuid_qr` | AbsenFormPublik | Public (QR scan) |
| `/verifikasi-surat/:uuid_verifikasi` | SuratVerifikasiPublik | Public |
| `/dashboard` | Dashboard | Auth |
| `/agendas` | Agendas | Auth |
| `/agendas/:id` | AgendaDetail | Auth |
| `/template-absensis` | TemplateAbsensis | Auth |
| `/surat/templates` | SuratTemplates | Auth |
| `/surat/buat` | SuratKeluarBuat | Auth |
| `/surat/keluar` | SuratKeluarArsip | Auth |
| `/surat/masuk` | SuratMasukPage | Auth |
| `/keuangan` | Keuangan | Auth |
| `/laporan` | Laporan | Auth |
| `/kader` | Kader | Auth (Kaderisasi/BIPEKA) |
| `/kader/:id` | KaderDetail | Auth (Kaderisasi/BIPEKA) |
| `/mentoring` | Mentoring | Auth (Kaderisasi/BIPEKA) |
| `/mentoring/:id` | MentoringDetail | Auth (Kaderisasi/BIPEKA) |
| `/kaderisasi` | Kaderisasi | Auth (Kaderisasi) — placeholder |
| `/notifikasi` | Notifikasi | Auth — placeholder |
| `/admin/users` | Users | Superadmin |
| `/admin/profile` | ProfileSettings | Superadmin |
| `*` | Navigate → `/dashboard` | Catch-all |

---

## Frontend Architecture

### State Management
- **Zustand store**: `authStore` — holds `user`, `token`, `isAuthenticated`, `loading`
  - Token persisted to `localStorage('access_token')`
  - On login: store token, set `Authorization` header
  - On logout: clear token, remove header
  - `fetchMe()` called by `AuthGuard` on mount

### API Service
- **axios instance** at `services/api.ts`
- `baseURL`: `VITE_API_URL || 'http://localhost:8000/api'`
- `withCredentials: true`
- Token injected via interceptor or `api.defaults.headers.common['Authorization']`

### Auth Guard
- `AuthGuard` component wraps protected routes
- Three guard modes:
  - `<AuthGuard />` — just checks authenticated
  - `<AuthGuard requiredRole="Superadmin" />` — single role
  - `<AuthGuard allowedRoles={['A','B']}>` — multiple roles
  - `<AuthGuard requiredPermission="...">` — permission check
- Superadmin always bypasses role/permission checks
- Shows loading spinner while `fetchMe()` is pending

### Layout Pattern
Two patterns coexist:
1. **Shared Layout** (`components/Layout.tsx`) — responsive sidebar + header slot
   - Used by: Dashboard, Users, ProfileSettings
   - Sidebar items filtered by role
   - Mobile: hamburger menu overlay
2. **Inline Sidebar** — each page defines its own sidebar + header
   - Used by: Agendas, AgendaDetail, SuratTemplates, TemplateAbsensis, SuratKeluarBuat, SuratKeluarArsip, SuratMasuk, Keuangan, Laporan, Kader, KaderDetail, Mentoring, MentoringDetail, Kaderisasi, Notifikasi
   - Pattern: `<div class="flex">` with `<aside>` sidebar + `<div class="flex-grow">` content

### Template Absensi Schema
```typescript
interface TemplateField {
  name: string;       // auto-generated from label (lowercase, underscores)
  label: string;      // human label
  type: 'text' | 'number' | 'textarea' | 'select' | 'signature';
  required: boolean;
  options?: string[]; // for 'select' type
}
```
- Stored as `jsonb` in `template_absensis.skema_kolom`
- Rendered dynamically in `AbsenFormPublik.tsx` and `AgendaDetail.tsx`
- Signature fields render a `SignaturePad` component (canvas with mouse/touch support)
- Signature stored as base64 PNG data URL with transparent background

### Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `AuthGuard` | `components/AuthGuard.tsx` | Route protection, role/permission checks |
| `Layout` | `components/Layout.tsx` | Shared responsive layout with sidebar |
| `SignaturePad` | `components/SignaturePad.tsx` | Canvas-based signature drawing |

---

## Key Architectural Decisions

1. **CSV Export Auth**: Uses `window.open()` which can't send `Authorization: Bearer` header. Token passed via `?token=` query param, controller authenticates manually via `PersonalAccessToken::findToken`.
2. **Template absensi schema**: Fully dynamic JSON structure. No hardcoded form fields — all driven by `skema_kolom` array. Field types: text, number, textarea, select, signature.
3. **Soft deletes**: All major entities use `SoftDeletes` trait. Data is never permanently deleted through the API.
4. **QR Code**: Generated server-side via `simplesoftwareio/simple-qrcode` as SVG. UUID stored in `agendas.uuid_qr` column.
5. **Timezone**: Set to `Asia/Jakarta` (WIB) in `config/app.php`.
6. **CORS**: Configured for `http://localhost:5173` (Vite dev server) with credentials.
7. **Trackable trait**: Auto-sets `created_by` / `updated_by` from `auth()->id()` on create/update.

---

## Development Setup

```bash
# Backend
cd backend
cp .env.example .env    # Edit DB credentials, FRONTEND_URL
composer install
php artisan migrate
php artisan serve

# Frontend
cd frontend
npm install
npm run dev             # Vite dev server at localhost:5173

# Build
cd frontend
npm run build           # tsc -b && vite build
```

---

## Workflow (WORKFLOW.md Summary)

1. **Every change = 1 issue** → 1 branch → 1 PR (squash merge)
2. Branch from `master`, name: `feat/<keterangan>-<issue#>` or `fix/<keterangan>-<issue#>
3. Test before push: `npm run build` (frontend), lint/typecheck
4. PR with squash merge, delete branch after merge

---

## Modules Overview (10 Modules from PRD)

| # | Module | Status |
|---|--------|--------|
| 1 | **Agenda & Absensi** | Done — QR scan, manual entry, CSV export, signature field, template CRUD, attendance edit/delete |
| 2 | **Surat-Menyurat** | Done — templates, generate bulk, arsip surat keluar/masuk, verifikasi publik |
| 3 | **Keuangan Kegiatan** | Done — OCR struk, verifikasi, summary, export PDF |
| 4 | **Laporan Bulanan** | Done — generate per bidang/gabungan, export PDF |
| 5 | **Data Kader & Keluarga** | Done — CRUD kader, keluarga, pendidikan anak, kaderisasi records, rating |
| 6 | **Mentoring** | Done — kelompok mentoring, anggota |
| 7 | **Periode & Struktur** | Done — periode kepengurusan, struktur organisasi |
| 8 | **Landing Page Publik** | Done — profil organisasi, struktur, agenda publik |
| 9 | **Jenjang Kaderisasi** | Placeholder — route exists, page empty |
| 10 | **Notifikasi** | Placeholder — route exists, page empty |

---

## .env Key Variables

```bash
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5433
DB_DATABASE=organia
DB_USERNAME=postgres
DB_PASSWORD=
FRONTEND_URL=http://localhost:5173
APP_TIMEZONE=Asia/Jakarta
```
