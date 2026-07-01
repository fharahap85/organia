# Fase 6: Laporan Akhir Bulan

> **Tujuan:** Sistem mengumpulkan data dari modul Agenda (kehadiran), Dokumentasi (foto cuplikan), dan Keuangan (struk verified) lalu merangkumnya menjadi laporan PDF bulanan yang siap dikirim.
>
> **Referensi PRD:** [03c-laporan-bulanan.md](../prd/03c-laporan-bulanan.md)

---

## 📊 6.1 Model & Migrasi Database

- [ ] 6.1.1 Buat migration & model `LaporanBulanan`:
  - Kolom: `bulan`, `tahun`, `tipe_laporan` (gabungan/per_bidang), `bidang` (nullable), `file_pdf_path`, `generated_by`.

## ⚙️ 6.2 Backend API: Auto-Generate Laporan

- [ ] 6.2.1 Buat Class Service `LaporanGeneratorService` untuk mengumpulkan data:
  - Query 1: Ambil semua Agenda (status selesai) pada bulan & tahun terpilih (filter by bidang jika tipe per_bidang).
  - Query 2: Hitung total Absensi per agenda tersebut.
  - Query 3: Ambil 1-2 Dokumentasi foto per agenda.
  - Query 4: Ambil rekap keuangan (sum nominal) dari Struk (status verified) terkait agenda-agenda tersebut.
  - Validasi: Beri warning text jika ada struk yang masih *pending verifikasi* di periode tersebut.
- [ ] 6.2.2 Buat Job Queue `GenerateLaporanPdfJob`:
  - Terima data array matang dari Service di atas.
  - Susun HTML (View) yang menggabungkan daftar kegiatan, tabel kehadiran, tabel keuangan, dan grid foto dokumentasi.
  - Generate PDF dari HTML menggunakan package (contoh: DomPDF).
  - Simpan file PDF, update tabel `LaporanBulanan`.
- [ ] 6.2.3 Buat Endpoint `POST /api/laporan/generate`:
  - Request: `bulan`, `tahun`, `tipe`.
  - Memanggil Service agregasi dan Dispatch Job.
- [ ] 6.2.4 Buat Endpoint `GET /api/laporan` (List histori laporan dengan link download PDF).

## 🖥️ 6.3 Frontend: Modul Laporan (Sekretaris & Ketua)

- [ ] 6.3.1 Buat Halaman "Laporan Bulanan" (`/laporan`).
- [ ] 6.3.2 Buat Form Generate Laporan:
  - Dropdown Bulan (Januari-Desember) dan Tahun.
  - Radio button / Dropdown "Tipe Laporan" (Seluruh Bidang, atau Pilih Bidang Spesifik).
  - Tombol "Proses & Buat PDF".
- [ ] 6.3.3 Buat Tabel Histori Laporan:
  - Menampilkan daftar laporan yang pernah digenerate di masa lalu.
  - Tombol Download PDF.
- [ ] 6.3.4 (Opsional) Tampilkan Preview/Dashboard Ringkasan Angka sebelum digenerate PDF-nya (misal: "Bulan ini ada 5 kegiatan, total biaya Rp 2.000.000").

---

> **Langkah Selanjutnya:** Setelah fitur rekap dan pelaporan selesai, sistem manajemen kegiatan sudah utuh. Lanjut ke modul SDM di [Fase 7: Data Kader & Keluarga](./07-kader-keluarga.md).
