# Fase 0: Setup Lingkungan (Environment)

> **Tujuan:** Menyiapkan kerangka kerja dasar untuk Backend (Laravel) dan Frontend (React). Memastikan tooling, database awal, dan struktur folder telah siap sebelum memulai implementasi fitur.
>
> **Referensi PRD:** [05-architecture.md](../prd/05-architecture.md), [06-data-model.md](../prd/06-data-model.md)

---

## 🏗️ 0.1 Setup Backend (Laravel API)

- [ ] 0.1.1 Install project Laravel baru (minimal Laravel 11+) dalam folder `backend` atau sesuai struktur repo.
- [ ] 0.1.2 Bersihkan boilerplate Laravel (hapus view default, sisakan rute `api.php`).
- [ ] 0.1.3 Konfigurasi file `.env`:
  - Set `DB_CONNECTION=pgsql`
  - Set parameter koneksi PostgreSQL (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
  - Set `QUEUE_CONNECTION=database`.
- [ ] 0.1.4 Install & konfigurasi **Laravel Sanctum** untuk autentikasi API SPA.
- [ ] 0.1.5 Jalankan `php artisan queue:table` dan `php artisan migrate` awal.
- [ ] 0.1.6 Setup struktur folder standar API:
  - Buat folder `app/Http/Controllers/Api`
  - Buat folder `app/Http/Resources`
  - Buat folder `app/Http/Requests`
- [ ] 0.1.7 Konfigurasi CORS di `config/cors.php` agar dapat menerima request dari URL frontend.

## 🎨 0.2 Setup Frontend (React SPA)

- [ ] 0.2.1 Inisialisasi project React dengan Vite & TypeScript di folder `frontend` (contoh: `npm create vite@latest frontend -- --template react-ts`).
- [ ] 0.2.2 Install Tailwind CSS dan konfigurasinya (opsional tapi disarankan sesuai PRD).
- [ ] 0.2.3 Install dependensi utama:
  - `react-router-dom` (Routing)
  - `axios` (HTTP Client)
  - `zustand` atau `@tanstack/react-query` (State Management)
  - `lucide-react` atau icon library lain.
- [ ] 0.2.4 Konfigurasi **Axios instance**:
  - Set `baseURL` mengarah ke URL API Laravel.
  - Aktifkan `withCredentials: true` (penting untuk Sanctum SPA authentication).
  - Setup interceptor untuk menyisipkan Bearer token atau CSRF token secara otomatis.
- [ ] 0.2.5 Siapkan struktur folder dasar frontend:
  - `src/components`
  - `src/pages`
  - `src/services` (untuk Axios API calls)
  - `src/store` (jika pakai zustand)
  - `src/types` (untuk TypeScript interfaces)

## 🗄️ 0.3 Desain Skema Database Dasar & Migrasi Utama

- [ ] 0.3.1 Buat file Base Model (opsional, jika ingin membuat fungsi khusus yang di-inherit model lain, contohnya trait `created_by` / `updated_by`).
- [ ] 0.3.2 Pastikan koneksi antara Laravel backend dan PostgreSQL sudah berjalan dengan baik.
- [ ] 0.3.3 Commit inisialisasi awal ke repository Git.

---

> **Langkah Selanjutnya:** Jika Fase 0 selesai, lanjutkan ke [Fase 1: Auth & RBAC](./01-auth-rbac-user.md).
