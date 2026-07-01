# Fase 10: Halaman Publik & Profil Organisasi

> **Tujuan:** Menampilkan profil, visi-misi, struktur kepengurusan aktif, dan kalender kegiatan ke masyarakat luas tanpa autentikasi.
>
> **Referensi PRD:** [03j-halaman-publik.md](../prd/03j-halaman-publik.md)

---

## 🌐 10.1 Backend API: Endpoint Publik (Tanpa Auth)

- [ ] 10.1.1 Buat `PublicController` khusus tanpa middleware Sanctum.
- [ ] 10.1.2 `GET /api/public/profil`
  - Ambil konfigurasi nama organisasi, logo, visi misi (bisa disimpan di tabel config atau file).
- [ ] 10.1.3 `GET /api/public/struktur`
  - Ambil data Struktur Organisasi untuk periode yang berstatus "Aktif".
- [ ] 10.1.4 `GET /api/public/agendas`
  - Ambil daftar Agenda (yang berstatus selesai/aktif) yang memiliki flag `is_publik = true`.
  - Jangan return rekap kehadiran/data sensitif. Hanya return judul, tanggal, lokasi.
- [ ] 10.1.5 (Superadmin Only) Buat endpoint untuk mengupdate data profil & flag *enable/disable* halaman publik.

## 🖥️ 10.2 Frontend: Landing Page (React)

- [ ] 10.2.1 Buat route publik baru di frontend (misal di `/` atau `/profil`).
- [ ] 10.2.2 Desain UI Landing Page:
  - Hero Section (Logo, Visi Misi).
  - Section "Kepengurusan Saat Ini" (Render bagan/struktur berdasarkan data API).
  - Section "Kalender Kegiatan" (Tampilkan agenda-agenda publik dalam bentuk list/kalender UI).
- [ ] 10.2.3 Buat sistem proteksi: Jika Superadmin men-disable halaman publik, arahkan URL publik ke halaman login atau tampilkan "Maintenance / Private Mode".
- [ ] 10.2.4 Pastikan meta tags (Helmet) ditambahkan untuk SEO dasar (title, description, og:image).

---

> **Langkah Selanjutnya:** Semua modul fungsional telah selesai! Lanjut ke tahap akhir penyelesaian dan deployment di [Fase 11: Polish & Deploy](./11-polish-deploy.md).
