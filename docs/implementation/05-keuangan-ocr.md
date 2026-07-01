# Fase 5: Keuangan Kegiatan & Ekstraksi OCR

> **Tujuan:** Bendahara dapat mencatat pengeluaran kegiatan dengan mengunggah foto struk. Sistem menggunakan Tesseract OCR (di background) untuk membaca data secara otomatis, sebelum diverifikasi manual.
>
> **Referensi PRD:** [03d-keuangan.md](../prd/03d-keuangan.md)

---

## 🧾 5.1 Model & Migrasi Database

- [ ] 5.1.1 Buat migration & model `Struk`:
  - Kolom: `agenda_id`, `file_gambar_path`, `nominal` (decimal/integer), `tanggal_transaksi` (date), `nama_vendor`, `status_verifikasi` (pending/verified/rejected), `ocr_raw_text` (text, untuk log), `low_confidence_flags` (jsonb).

## ⚙️ 5.2 Backend API: Upload & Tesseract OCR Pipeline

- [ ] 5.2.1 Setup Tesseract (Level OS):
  - Pastikan Tesseract OCR terinstall di server/local environment (`sudo apt install tesseract-ocr`).
  - Install wrapper PHP untuk Tesseract (misal: `thiagoalessio/tesseract_ocr`).
- [ ] 5.2.2 Setup Intervention Image (untuk Preprocessing).
- [ ] 5.2.3 Buat Job (Queue) `ProsesOcrStrukJob`:
  - Mengambil gambar struk yang baru diupload.
  - Preprocessing gambar (convert to grayscale, adjust contrast/brightness, sharpen) pakai Intervention Image.
  - Eksekusi Tesseract pada gambar hasil preprocessing.
  - Ekstraksi nominal (regex cari format uang), tanggal (regex tanggal), dan nama vendor dari `raw_text` hasil OCR.
  - Tentukan logic `low_confidence` (misal: jika gagal match regex dengan baik, beri flag warning).
  - Update data tabel `Struk` dengan hasil OCR.
- [ ] 5.2.4 Buat Endpoint `POST /api/keuangan/struk`:
  - Terima upload foto struk beserta ID agenda terkait.
  - Simpan foto, insert tabel `Struk` (status pending).
  - Dispatch `ProsesOcrStrukJob` ke queue.
- [ ] 5.2.5 Buat Endpoint CRUD lainnya:
  - `GET /api/keuangan/struk` (Daftar struk, filter per agenda/status).
  - `PUT /api/keuangan/struk/{id}/verifikasi` (Bendahara mensubmit koreksi dan mengubah status jadi verified).
  - `GET /api/keuangan/export-pdf` (Generate PDF gabungan struk terverifikasi di periode tersebut).

## 🖥️ 5.3 Frontend: Modul Bendahara

- [ ] 5.3.1 Buat Halaman "Keuangan Kegiatan" (`/keuangan`).
  - (Ingat pembatasan role: Hanya Bendahara, Ketua, Superadmin).
- [ ] 5.3.2 Buat Form Upload Struk:
  - Dropzone upload foto struk.
  - Dropdown memilih Agenda terkait pengeluaran.
- [ ] 5.3.3 Tampilkan status proses (Polling ringan atau cukup status teks "Sedang diproses AI" jika baru diupload).
- [ ] 5.3.4 Buat Form Verifikasi & Edit Manual:
  - Layout 2 kolom: Kiri menampilkan Foto Struk asli (bisa di-zoom), Kanan form input (Nominal, Tanggal, Vendor).
  - Tampilkan peringatan visual (warna kuning/merah) di field tertentu jika ada flag `low_confidence` dari backend.
  - Bendahara mengecek, mengubah jika salah baca, dan klik "Verifikasi & Simpan".
- [ ] 5.3.5 Buat tombol Export PDF di dashboard Keuangan (memanggil API generate PDF gabungan).

---

> **Langkah Selanjutnya:** Pastikan proses OCR benar-benar dilakukan di queue worker agar tidak RTO (Request Timeout). Jika sudah selesai, lanjut ke [Fase 6: Laporan Bulanan](./06-laporan-bulanan.md).
