# Fase 3: Surat-Menyurat (Bulk & Tanda Tangan Digital)

> **Tujuan:** Membuat template surat dinamis, penomoran otomatis, generate surat secara massal via queue, arsip surat keluar/masuk, dan tanda tangan digital.
>
> **Referensi PRD:** [03b-surat-menyurat.md](../prd/03b-surat-menyurat.md)

---

## ✉️ 3.1 Model & Migrasi Database

- [ ] 3.1.1 Buat migration & model `TemplateSurat`:
  - Kolom: `judul_template`, `jenis_surat`, `konten_html` (isi template berserta placeholder `{{var}}`), `layout_config`.
- [ ] 3.1.2 Buat migration & model `Surat` (Surat Keluar):
  - Kolom: `nomor_surat`, `tanggal_surat`, `jenis_surat`, `template_id`, `penerima_nama`, `penerima_data_json`, `status_ttd` (digital/kosong), `file_pdf_path`.
- [ ] 3.1.3 Buat migration & model `SuratMasuk`:
  - Kolom: `nomor_surat`, `tanggal_terima`, `pengirim`, `perihal`, `file_lampiran_path`, `status_tindak_lanjut`, `disposisi_ke_bidang`.
- [ ] 3.1.4 Modifikasi/Pastikan tabel `Users` atau `StrukturOrganisasi` bisa menyimpan path gambar Tanda Tangan Digital untuk Ketua/Pejabat.

## ⚙️ 3.2 Backend API: Template & Surat Masuk

- [ ] 3.2.1 Setup library PDF (contoh: `barryvdh/laravel-dompdf` atau `spatie/laravel-pdf`).
- [ ] 3.2.2 Buat CRUD API `TemplateSurat` (hanya Sekretaris/Superadmin).
  - Terdapat deteksi placeholder di backend (misal: extract string antara `{{` dan `}}`).
- [ ] 3.2.3 Buat CRUD API `SuratMasuk` (input surat, upload lampiran PDF/Gambar, disposisi).

## 🖨️ 3.3 Backend API: Penomoran & Generate Bulk Surat

- [ ] 3.3.1 Buat Helper/Service untuk "Penomoran Otomatis":
  - Logika membuat nomor urut baru berdasarkan bulan & tahun berjalan tanpa duplikat (misal: `001/SEK/VI/2026`).
- [ ] 3.3.2 Buat Job (Queue) untuk `GenerateBulkSuratJob`:
  - Job menerima array data penerima, format template, dan opsi TTD.
  - Job menghasilkan PDF satu per satu atau digabung, menyimpan ke file lokal, dan mencatat data ke tabel `Surat`.
- [ ] 3.3.3 Buat Endpoint `POST /api/surat/generate`:
  - Menerima request berisi: ID template, opsi TTD, list penerima (array of objects).
  - Dispatch Job ke Laravel Queue agar response HTTP tidak timeout.
- [ ] 3.3.4 Buat Endpoint `GET /api/surat` (Daftar Arsip Surat Keluar dengan filter).
- [ ] 3.3.5 Buat Endpoint untuk mendownload/stream file PDF surat.

## 🖥️ 3.4 Frontend: Manajemen Template & Surat Masuk

- [ ] 3.4.1 Buat Halaman "Template Surat" (`/surat/templates`).
  - Gunakan Rich Text Editor (seperti Quill / TipTap) agar Sekretaris bisa membuat format surat dengan placeholder tebal, miring, dll.
- [ ] 3.4.2 Buat Halaman "Arsip Surat Masuk" (`/surat/masuk`).
  - Tabel dengan status tindak lanjut warna-warni.
  - Form upload PDF surat masuk.

## 👥 3.5 Frontend: Bulk Generation Surat Keluar

- [ ] 3.5.1 Buat Halaman "Buat Surat Keluar" (`/surat/buat`).
- [ ] 3.5.2 Implementasikan Wizard / Multi-step Form:
  - Step 1: Pilih Template.
  - Step 2: Pilih Opsi (TTD Digital atau TTD Kosong).
  - Step 3: Input Data Penerima.
    - Bisa berupa input form berulang (baris per baris).
    - Atau fitur impor Excel/CSV (opsional di Fase 3, minimal input array dinamis).
- [ ] 3.5.3 Handle Submit dan tampilkan status loading (karena proses berjalan di background).
- [ ] 3.5.4 Buat Halaman "Arsip Surat Keluar" (`/surat/keluar`).
  - Tampilkan tabel daftar surat yang sudah ter-generate.
  - Tombol download PDF.

---

> **Langkah Selanjutnya:** Pastikan queue worker berjalan (`php artisan queue:work`) saat mengetes fitur ini. Lanjut ke [Fase 4: Dokumentasi Kegiatan](./04-dokumentasi-kegiatan.md).
