# 📋 Organia — Rencana Implementasi (Task Breakdown)

> **Tujuan Dokumen:** Memecah seluruh PRD Organia menjadi langkah implementasi yang sangat kecil dan jelas, sehingga seorang **junior programmer** atau **AI model yang lebih murah** dapat mengerjakan setiap task tanpa ambiguitas.

---

## 📌 Cara Menggunakan Dokumen Ini

1. **Kerjakan secara berurutan** — mulai dari Fase 0, lalu Fase 1, dst.
2. **Jangan loncat fase** — setiap fase bergantung pada fase sebelumnya.
3. **Centang setiap task** setelah selesai (`- [x]`) untuk tracking progres.
4. **Baca file PRD terkait** sebelum mengerjakan setiap task (link sudah disediakan).
5. **Satu task = satu PR/commit** — usahakan setiap task menghasilkan satu perubahan yang dapat di-review.
6. **Test sebelum lanjut** — pastikan task sebelumnya berfungsi sebelum melanjutkan.

---

## 📁 Daftar File Fase

| Fase | File | Deskripsi | Estimasi |
|------|------|-----------|----------|
| 0 | [00-setup-environment.md](./00-setup-environment.md) | Setup project, tooling, database awal | 2-3 hari |
| 1 | [01-auth-rbac-user.md](./01-auth-rbac-user.md) | Autentikasi, RBAC, manajemen pengguna & periodisasi | 5-7 hari |
| 2 | [02-agenda-absensi.md](./02-agenda-absensi.md) | Modul Agenda & Absensi QR Code | 5-7 hari |
| 3 | [03-surat-menyurat.md](./03-surat-menyurat.md) | Modul Surat-Menyurat (Bulk & TTD Digital) | 5-7 hari |
| 4 | [04-dokumentasi-kegiatan.md](./04-dokumentasi-kegiatan.md) | Modul Dokumentasi Kegiatan (Galeri Foto/Video) | 2-3 hari |
| 5 | [05-keuangan-ocr.md](./05-keuangan-ocr.md) | Modul Keuangan Kegiatan & OCR Struk | 5-7 hari |
| 6 | [06-laporan-bulanan.md](./06-laporan-bulanan.md) | Modul Laporan Akhir Bulan | 3-5 hari |
| 7 | [07-kader-keluarga.md](./07-kader-keluarga.md) | Modul Data Kader & Keluarga | 5-7 hari |
| 8 | [08-jenjang-kaderisasi.md](./08-jenjang-kaderisasi.md) | Modul Jenjang Kaderisasi & Rapor Kader | 3-5 hari |
| 9 | [09-notifikasi.md](./09-notifikasi.md) | Modul Notifikasi Terpusat | 3-5 hari |
| 10 | [10-halaman-publik.md](./10-halaman-publik.md) | Halaman Publik & Profil Organisasi | 3-4 hari |
| 11 | [11-polish-deploy.md](./11-polish-deploy.md) | Polish, Testing, Dokumentasi, Deploy | 5-7 hari |

---

## 🏗️ Stack Teknologi (Referensi Cepat)

| Komponen | Teknologi |
|----------|-----------|
| Backend | Laravel (REST API only) |
| Auth | Laravel Sanctum |
| Frontend | React + TypeScript + Vite |
| Database | PostgreSQL |
| Queue | Laravel Queue (database driver) |
| OCR | Tesseract (self-hosted) + Intervention Image |
| PDF | Spatie Laravel PDF / DomPDF |
| QR Code | Simple QR Code (Laravel) |
| File Storage | Laravel Filesystem (lokal) |

---

## ⚠️ Aturan Penting

1. **Backend = API only** — tidak ada Blade view. Semua response dalam JSON.
2. **Frontend = SPA terpisah** — React consume API via Axios/Fetch.
3. **Setiap endpoint API harus dilindungi RBAC middleware** (kecuali endpoint publik).
4. **Proses berat (OCR, generate PDF, bulk) wajib via Laravel Queue**.
5. **Data sensitif (NIK, data anak) wajib dienkripsi at-rest**.
6. **Semua tabel utama harus memiliki `created_by`, `updated_by`, `created_at`, `updated_at`**.
7. **Tabel penting menggunakan Soft Delete**.

---

> **PRD Lengkap:** Lihat folder `docs/prd/` untuk referensi detail setiap modul.
> **Implementation Guide:** Lihat `docs/IMPLEMENTATION_GUIDE.md` untuk panduan tingkat tinggi.
