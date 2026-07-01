# Fase 1: Autentikasi, RBAC & Manajemen Pengguna

> **Tujuan:** Membangun sistem login, kontrol akses berbasis peran (RBAC), manajemen pengguna (CRUD admin), serta struktur organisasi/periodisasi.
>
> **Referensi PRD:** [01-users-and-roles.md](../prd/01-users-and-roles.md), [03f-manajemen-pengguna.md](../prd/03f-manajemen-pengguna.md)

---

## 🛡️ 1.1 Model & Migrasi Database

- [ ] 1.1.1 Buat migration & model `Role` dan `Permission` (atau install package Spatie Permission jika diizinkan).
- [ ] 1.1.2 Modifikasi migration tabel `users`:
  - Tambahkan relasi `role_id` atau integrasikan tabel pivot spatie.
  - Tambahkan kolom status aktif/tidak aktif.
  - Tambahkan soft deletes.
- [ ] 1.1.3 Buat migration & model `PeriodeKepengurusan`:
  - Kolom: `id`, `nama_periode`, `tanggal_mulai`, `tanggal_selesai`, `is_active`.
  - Tambahkan `periode_id` ke tabel `users`.
- [ ] 1.1.4 Buat migration & model `StrukturOrganisasi` (relasi periode ke hirarki jabatan).
- [ ] 1.1.5 Jalankan `php artisan migrate`.
- [ ] 1.1.6 Buat Seeder dasar:
  - Role: Superadmin, Ketua, Sekretaris, Bendahara, Kaderisasi, BIPEKA.
  - Periode aktif awal.
  - 1 Akun Superadmin default (`superadmin@organia.local`).

## 🔐 1.2 Backend API: Autentikasi & RBAC

- [ ] 1.2.1 Buat `AuthController`:
  - Endpoint `POST /api/login` (validasi credential, return Sanctum token / cookie).
  - Endpoint `POST /api/logout` (revoke token).
  - Endpoint `GET /api/me` (return data user, role, permission, & periode aktif).
- [ ] 1.2.2 Buat Middleware Role/RBAC:
  - Middleware untuk membatasi endpoint khusus role tertentu (misal: `role:Superadmin`).
- [ ] 1.2.3 Buat Endpoint Manajemen Pengguna (CRUD) — hanya untuk Superadmin:
  - `GET /api/users` (list dengan filter/pagination)
  - `POST /api/users` (create user baru)
  - `PUT /api/users/{id}` (edit, ubah role/periode)
  - `DELETE /api/users/{id}` (nonaktifkan / soft delete)
- [ ] 1.2.4 Buat Endpoint CRUD `PeriodeKepengurusan` (hanya Superadmin).
- [ ] 1.2.5 Buat Endpoint CRUD `StrukturOrganisasi` (hanya Superadmin).

## 🖥️ 1.3 Frontend: Autentikasi & Dashboard Layout

- [ ] 1.3.1 Buat halaman Login (`/login`).
- [ ] 1.3.2 Implementasikan logika Login:
  - Ambil token CSRF Sanctum (jika berbasis cookie) atau simpan Bearer token.
  - Panggil `GET /api/me` dan simpan data user ke global state (Zustand/Context).
- [ ] 1.3.3 Buat Protected Route / Auth Guard:
  - Redirect ke login jika belum auth.
  - Redirect ke error/403 jika role tidak sesuai untuk rute tertentu.
- [ ] 1.3.4 Buat Layout Dashboard Utama:
  - Sidebar dinamis (menu tampil/hilang tergantung Role user).
  - Topbar (menampilkan nama user aktif & tombol logout).

## 👥 1.4 Frontend: Manajemen Pengguna & Periode

- [ ] 1.4.1 Buat halaman "Manajemen Pengguna" (`/admin/users`) khusus Superadmin.
- [ ] 1.4.2 Buat tabel/list pengguna (integrasi ke API `GET /api/users`).
- [ ] 1.4.3 Buat form Modal/Page Tambah Pengguna & Edit Pengguna.
- [ ] 1.4.4 Buat halaman "Periode & Struktur" (`/admin/periode`).
- [ ] 1.4.5 Buat form manajemen Periode aktif.

---

> **Langkah Selanjutnya:** Jika Fase 1 selesai, user dapat login dengan rolenya masing-masing. Lanjutkan ke [Fase 2: Agenda & Absensi](./02-agenda-absensi.md).
