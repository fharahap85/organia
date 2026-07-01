# 07 — Alur Pengguna Utama (User Flow)

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Model Data](./06-data-model.md) | [← Index](../README.md) | [Selanjutnya: Metrik & Risiko →](./08-metrics-risks.md)

---

## Pendahuluan

Dokumen ini menggambarkan **tiga alur pengguna (user flow) kritis** yang paling sering dijalankan dalam sistem Organia. Alur-alur ini mencakup skenario paling kompleks dan paling bernilai bagi pengguna.

---

## 10.1 Alur Pembuatan Agenda & Absensi

**Aktor:** Sekretaris (utama), Peserta (eksternal/tanpa akun)
**Modul:** [Agenda & Absensi](./03-modules/03a-agenda-absensi.md)

```
Sekretaris                   Sistem                    Peserta
    │                           │                          │
    │── Buat agenda baru ──────→│                          │
    │   (judul, waktu, lokasi)  │                          │
    │                           │                          │
    │── Pilih/susun template ──→│                          │
    │   kolom absensi           │                          │
    │                           │                          │
    │                           │←── Generate QR code ─────│
    │                           │    (unik per agenda)      │
    │                           │                          │
    │←── Dapatkan QR code ──────│                          │
    │    (gambar + link)        │                          │
    │                           │                          │
    │── Bagikan QR ─────────────┼─────────────────────────→│
    │   (cetak/chat/layar)      │                          │
    │                           │                          │
    │                           │←── Pindai QR + isi form ─│
    │                           │    (nama, jabatan, dll)  │
    │                           │                          │
    │                           │── Simpan data absensi    │
    │                           │── Tampilkan konfirmasi ─→│
    │                           │                          │
    │←── Pantau rekap real-time │                          │
    │    (jumlah hadir, list)   │                          │
    │                           │                          │
    │── Tambah absensi susulan  │                          │
    │   (manual + alasan) ─────→│                          │
    │                           │                          │
    │── Request ekspor ────────→│                          │
    │                           │── Generate Excel/PDF     │
    │←── File siap diunduh ─────│   (via queue)            │
```

**Catatan:**
- QR code secara otomatis tidak aktif setelah masa berlaku berakhir
- Rekap real-time tersedia tanpa perlu refresh manual
- Data rekap ini otomatis tersedia untuk [Laporan Bulanan](./03-modules/03c-laporan-bulanan.md)

---

## 10.2 Alur Pencatatan Struk oleh Bendahara

**Aktor:** Bendahara
**Modul:** [Keuangan Kegiatan](./03-modules/03d-keuangan.md)

```
Bendahara                    Sistem (API)              Queue Worker
    │                           │                          │
    │── Upload foto struk ─────→│                          │
    │   + pilih agenda terkait  │                          │
    │                           │── Simpan foto asli       │
    │                           │── Kirim job ke queue ───→│
    │                           │                          │
    │←── "Foto diterima,        │                          │── Preprocessing gambar
    │    sedang diproses..."    │                          │   (brightness, deskew)
    │                           │                          │
    │                           │                          │── Jalankan Tesseract OCR
    │                           │                          │   (baca nominal, tgl, vendor)
    │                           │                          │
    │                           │←── Hasil ekstraksi ──────│
    │                           │    + confidence score    │
    │                           │                          │
    │←── Notifikasi: "Struk     │                          │
    │    siap diperiksa"        │                          │
    │                           │                          │
    │── Buka form verifikasi ──→│                          │
    │                           │                          │
    │←── Form dengan data OCR ──│                          │
    │    (field merah jika      │                          │
    │    low-confidence)        │                          │
    │                           │                          │
    │── Edit jika ada yang ─────│                          │
    │   tidak sesuai            │                          │
    │                           │                          │
    │── Konfirmasi & simpan ───→│                          │
    │                           │── Status: "terverifikasi"│
    │←── Data tersimpan ────────│── Total pengeluaran      │
    │                           │   agenda terupdate       │
```

**Catatan:**
- Foto asli **tetap disimpan** meskipun data sudah diedit/terverifikasi
- Bendahara **wajib** mengkonfirmasi sebelum data disimpan sebagai terverifikasi
- Data yang terverifikasi masuk ke ringkasan [Laporan Bulanan](./03-modules/03c-laporan-bulanan.md)

---

## 10.3 Alur Notifikasi Pendidikan Anak Kader

**Aktor:** Kaderisasi (input data), Sistem (otomatis), Kaderisasi & Ketua (penerima notifikasi)
**Modul:** [Data Kader & Keluarga](./03-modules/03e-kader-keluarga.md), [Notifikasi Terpusat](./03-modules/03i-notifikasi.md)

```
Kaderisasi                   Sistem                    Ketua
    │                           │                          │
    │── Input data anak kader ─→│                          │
    │   (nama, tanggal lahir)   │                          │
    │                           │                          │
    │                           │── Hitung estimasi jenjang│
    │                           │   pendidikan berikutnya  │
    │                           │   (berdasarkan usia)     │
    │                           │                          │
    │                           │── Simpan jadwal notif    │
    │                           │   (H-30 & H-7 sebelum   │
    │                           │    estimasi masuk sekolah│
    │                           │    Juli setiap tahun)    │
    │                           │                          │
    │                    [Waktu berlalu...]                 │
    │                           │                          │
    │←── Notifikasi: "Anak ─────┼─────────────────────────→│
    │    [nama] diperkirakan    │                          │
    │    masuk SD Juli 2027"    │                          │
    │                           │                          │
    │── Verifikasi & catat ────→│                          │
    │   aktual saat anak benar- │                          │
    │   benar masuk sekolah     │                          │
    │   (nama sekolah, tgl masuk│                          │
    │                           │                          │
    │                           │── Update status estimasi │
    │                           │── Hentikan notif ulang   │
    │                           │   untuk jenjang ini      │
```

**Catatan:**
- Estimasi berdasarkan **usia standar Indonesia**: TK 5th, SD 7th, SMP 13th, SMA 16th, Kuliah 19th
- Notifikasi dikirim **H-30 dan H-7** sebelum estimasi bulan masuk sekolah (Juli)
- Setelah data aktual dicatat, sistem **tidak lagi mengirimkan estimasi** untuk jenjang yang sama
- Jika tanggal lahir diperbarui, sistem **menghitung ulang** estimasi secara otomatis

---

## Alur Lain yang Akan Didokumentasikan

Alur berikut akan ditambahkan pada iterasi PRD berikutnya:

| # | Alur | Modul |
|---|------|-------|
| 10.4 | Pembuatan Surat Massal (Bulk Letter Generation) | [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |
| 10.5 | Generate Laporan Bulanan | [Laporan Bulanan](./03-modules/03c-laporan-bulanan.md) |
| 10.6 | Login & Switch Peran | [Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md) |
| 10.7 | Pergantian Periode Kepengurusan | [Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md) |

---

> [← Model Data](./06-data-model.md) | [← Index](../README.md) | [Selanjutnya: Metrik & Risiko →](./08-metrics-risks.md)
