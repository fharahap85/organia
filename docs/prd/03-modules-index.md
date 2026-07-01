# 03 — Modul & Kebutuhan Fungsional (Index)

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Scope](../02-scope.md) | [← Index](../README.md) | [Selanjutnya: Non-Fungsional →](../04-non-functional.md)

---

## Ringkasan 10 Modul Fungsional

Organia terdiri dari **10 modul fungsional** yang saling terhubung. Setiap modul memiliki dokumen tersendiri yang menjelaskan deskripsi dan kebutuhan fungsional secara detail.

| Kode | Modul | Peran Utama | Fase | File Detail |
|------|-------|-------------|------|-------------|
| **6.1** | [Agenda & Absensi QR](#61-agenda--absensi-qr) | Sekretaris | Fase 1 | [→ Detail](./03a-agenda-absensi.md) |
| **6.2** | [Surat-Menyurat](#62-surat-menyurat) | Sekretaris | Fase 2 | [→ Detail](./03b-surat-menyurat.md) |
| **6.3** | [Laporan Akhir Bulan](#63-laporan-akhir-bulan) | Ketua, Sekretaris | Fase 3 | [→ Detail](./03c-laporan-bulanan.md) |
| **6.4** | [Keuangan Kegiatan (OCR)](#64-keuangan-kegiatan) | Bendahara | Fase 3 | [→ Detail](./03d-keuangan.md) |
| **6.5** | [Data Kader & Keluarga](#65-data-kader--keluarga) | Kaderisasi | Fase 4 | [→ Detail](./03e-kader-keluarga.md) |
| **6.6** | [Manajemen Pengguna & Organisasi](#66-manajemen-pengguna--struktur-organisasi) | Superadmin | Fase 1 | [→ Detail](./03f-manajemen-pengguna.md) |
| **6.7** | [Jenjang Kaderisasi & Rapor](#67-jenjang-kaderisasi--rapor-kader) | Kaderisasi | Fase 4 | [→ Detail](./03g-jenjang-kaderisasi.md) |
| **6.8** | [Dokumentasi Kegiatan](#68-dokumentasi-kegiatan) | Semua peran | Fase 2 | [→ Detail](./03h-dokumentasi.md) |
| **6.9** | [Notifikasi Terpusat](#69-notifikasi-terpusat) | Semua peran | Fase 4 | [→ Detail](./03i-notifikasi.md) |
| **6.10** | [Halaman Publik & Profil Organisasi](#610-halaman-publik--profil-organisasi) | Publik | Fase 5 | [→ Detail](./03j-halaman-publik.md) |

---

## Peta Ketergantungan Modul

```
[6.6 Manajemen Pengguna]  ← Fondasi RBAC semua modul
        │
        ▼
[6.1 Agenda & Absensi]    ← Modul inti, dirujuk oleh:
    ├──→ [6.3 Laporan Bulanan]     (agregat agenda)
    ├──→ [6.4 Keuangan Kegiatan]   (struk per agenda)
    ├──→ [6.7 Jenjang Kaderisasi]  (pelatihan = agenda)
    └──→ [6.8 Dokumentasi]         (foto per agenda)

[6.5 Data Kader & Keluarga] ← Terhubung ke:
    ├──→ [6.7 Jenjang Kaderisasi]  (rapor per kader)
    └──→ [6.9 Notifikasi]          (notif pendidikan anak)

[6.9 Notifikasi Terpusat] ← Agregat semua notifikasi:
    ├── Notifikasi jenjang pendidikan anak (dari 6.5)
    ├── Pengingat agenda (dari 6.1)
    ├── Surat masuk perlu ditindaklanjuti (dari 6.2)
    └── Verifikasi struk belum diperiksa (dari 6.4)

[6.10 Halaman Publik] ← Konsumsi data dari:
    ├── Profil organisasi (dari 6.6)
    └── Kalender agenda publik (dari 6.1)
```

---

## Ringkasan Per Modul

### 6.1 Agenda & Absensi QR

Membuat agenda kegiatan dengan kolom absensi yang dapat dikustomisasi sepenuhnya, menghasilkan QR code unik agar peserta dapat mengisi absensi secara mandiri tanpa login.

**Fitur kunci:** Template kolom kustom · QR code dengan masa berlaku · Rekap real-time · Export Excel/PDF

[→ Baca spesifikasi lengkap](./03a-agenda-absensi.md)

---

### 6.2 Surat-Menyurat

Membuat surat secara massal dari template dengan placeholder dinamis, penomoran otomatis, dan opsi tanda tangan digital. Semua surat tersimpan otomatis di arsip digital.

**Fitur kunci:** Bulk generation · Penomoran otomatis · TTD digital/manual · Arsip surat masuk & keluar

[→ Baca spesifikasi lengkap](./03b-surat-menyurat.md)

---

### 6.3 Laporan Akhir Bulan

Menghasilkan laporan bulanan secara otomatis dari rekap agenda, kehadiran, dan ringkasan keuangan yang sudah terverifikasi — tanpa perlu menyusun ulang dari awal setiap bulan.

**Fitur kunci:** Auto-generate dari data agenda · Filter per bidang · Sertakan ringkasan keuangan · PDF siap kirim

[→ Baca spesifikasi lengkap](./03c-laporan-bulanan.md)

---

### 6.4 Keuangan Kegiatan

Mencatat bukti pengeluaran (struk/kwitansi) dengan bantuan OCR otomatis untuk ekstraksi nominal, tanggal, dan vendor — menggantikan pencatatan manual yang rawan kehilangan bukti fisik.

**Fitur kunci:** Upload foto struk · OCR Tesseract · Verifikasi manual sebelum simpan · Low-confidence warning · Export PDF gabungan

[→ Baca spesifikasi lengkap](./03d-keuangan.md)

---

### 6.5 Data Kader & Keluarga

Mendokumentasikan profil kader beserta seluruh anggota keluarganya, dengan fitur notifikasi otomatis saat anak kader diperkirakan memasuki jenjang pendidikan baru.

**Fitur kunci:** Profil kader lengkap · Data anak & tanggal lahir · Estimasi jenjang pendidikan · Notifikasi otomatis

[→ Baca spesifikasi lengkap](./03e-kader-keluarga.md)

---

### 6.6 Manajemen Pengguna & Struktur Organisasi

Fondasi sistem: mengelola akun pengguna, menetapkan peran, dan mencatat struktur organisasi per periode kepengurusan — sehingga riwayat jabatan tetap tersimpan saat pengurus berganti.

**Fitur kunci:** CRUD pengguna · Penetapan peran · Periodisasi kepengurusan · Bagan organisasi per periode

[→ Baca spesifikasi lengkap](./03f-manajemen-pengguna.md)

---

### 6.7 Jenjang Kaderisasi & Rapor Kader

Melacak perkembangan setiap kader dalam jenjang kaderisasi organisasi, menghasilkan "rapor kader" yang menampilkan progress, pelatihan yang sudah/belum diikuti, dan rekomendasi langkah berikutnya.

**Fitur kunci:** Definisi jenjang & syarat · Riwayat pelatihan terhubung ke Agenda · Rapor per kader · Rekap jenjang seluruh anggota

[→ Baca spesifikasi lengkap](./03g-jenjang-kaderisasi.md)

---

### 6.8 Dokumentasi Kegiatan

Menyimpan dan mengelola dokumentasi visual (foto/video) setiap kegiatan, terhubung langsung dengan data Agenda — dan dapat disertakan otomatis dalam laporan bulanan.

**Fitur kunci:** Upload foto/video per agenda · Galeri per kegiatan · Keterangan singkat · Auto-include ke laporan

[→ Baca spesifikasi lengkap](./03h-dokumentasi.md)

---

### 6.9 Notifikasi Terpusat

Memusatkan seluruh notifikasi dan pengingat sistem dalam satu mekanisme terpadu — dari jenjang pendidikan anak kader hingga pengingat agenda dan struk yang belum diverifikasi.

**Fitur kunci:** In-app notification · Opsional WhatsApp/email · Preferensi per peran

[→ Baca spesifikasi lengkap](./03i-notifikasi.md)

---

### 6.10 Halaman Publik & Profil Organisasi

Menampilkan profil organisasi, struktur pengurus aktif, dan kalender kegiatan terbuka kepada masyarakat umum tanpa login — sebagai bentuk transparansi organisasi.

**Fitur kunci:** Profil & visi-misi · Struktur kepengurusan · Kalender agenda publik · Toggle aktif/nonaktif

[→ Baca spesifikasi lengkap](./03j-halaman-publik.md)

---

> [← Scope](../02-scope.md) | [← Index](../README.md) | [Selanjutnya: Non-Fungsional →](../04-non-functional.md)
