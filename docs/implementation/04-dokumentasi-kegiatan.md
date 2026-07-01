# Fase 4: Dokumentasi Kegiatan (Galeri Foto/Video)

> **Tujuan:** Fitur untuk mengunggah dan mengelola foto/video kegiatan yang terhubung langsung dengan Agenda. Dokumentasi ini nantinya akan digunakan sebagai bahan Laporan Bulanan.
>
> **Referensi PRD:** [03h-dokumentasi.md](../prd/03h-dokumentasi.md)

---

## 📸 4.1 Model & Migrasi Database

- [ ] 4.1.1 Buat migration & model `DokumentasiKegiatan`:
  - Kolom: `agenda_id`, `file_path`, `tipe_file` (foto/video), `caption`, `uploaded_by`.
- [ ] 4.1.2 Pastikan relasi model:
  - `Agenda` hasMany `DokumentasiKegiatan`.
  - `DokumentasiKegiatan` belongsTo `Agenda`.

## ⚙️ 4.2 Backend API: Manajemen Upload File

- [ ] 4.2.1 Buat controller `DokumentasiController`.
- [ ] 4.2.2 Buat endpoint `GET /api/agendas/{id}/dokumentasi` (List foto/video untuk satu agenda).
- [ ] 4.2.3 Buat endpoint `POST /api/agendas/{id}/dokumentasi`:
  - Menerima file multipart/form-data.
  - Validasi tipe file (Hanya jpg, png, webp, mp4).
  - Validasi ukuran file (misal: max 10MB foto, max 100MB video).
  - Simpan file ke `storage/app/public/dokumentasi` menggunakan Laravel Filesystem.
  - (Opsional/Nilai Tambah): Gunakan *Intervention Image* untuk resize/kompres foto sebelum disimpan agar hemat space.
  - Simpan path & metadata ke tabel `DokumentasiKegiatan`.
- [ ] 4.2.4 Buat endpoint `DELETE /api/dokumentasi/{id}`.
- [ ] 4.2.5 Jalankan `php artisan storage:link` agar file publik dapat diakses via URL.

## 🖥️ 4.3 Frontend: Galeri Dokumentasi per Agenda

- [ ] 4.3.1 Pada halaman Detail Agenda (`/agendas/:id`), tambahkan tab/section "Dokumentasi".
- [ ] 4.3.2 Buat komponen Upload Area:
  - Dukungan drag-and-drop file atau klik tombol upload.
  - Form input kecil untuk mengisi `caption` setiap file yang diupload.
- [ ] 4.3.3 Buat komponen Galeri Grid:
  - Tampilkan foto sebagai thumbnail (grid view).
  - Jika video, tampilkan icon play.
  - Klik foto untuk memperbesar (Lightbox).
- [ ] 4.3.4 Tambahkan tombol Delete (Hanya muncul untuk role Superadmin atau uploader asli).

---

> **Langkah Selanjutnya:** Jika fitur upload berjalan dan file dapat ditampilkan, lanjut ke [Fase 5: Keuangan & OCR Struk](./05-keuangan-ocr.md).
