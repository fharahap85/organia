# ORGANIA — PRD Index

> **Sistem Informasi Manajemen Organisasi & Kaderisasi**

| Field | Detail |
|-------|--------|
| Nama Produk | Organia (working title) |
| Jenis Dokumen | Product Requirements Document (PRD) |
| Versi | 1.0 |
| Tanggal | 30 Juni 2026 |
| Disusun oleh | Abdullah Fikri Harahap |
| Status | Draft awal — untuk pengembangan & portfolio |

---

## Daftar Isi PRD

### Bagian Utama

| No | Dokumen | Deskripsi Singkat |
|----|---------|-------------------|
| 00 | [Ringkasan Eksekutif & Latar Belakang](./00-overview.md) | Gambaran produk, masalah yang diselesaikan, dan tujuan |
| 01 | [Target Pengguna & Peran (Role)](./01-users-and-roles.md) | 6 peran pengguna dan hak akses masing-masing |
| 02 | [Lingkup Produk (Scope)](./02-scope.md) | Fitur yang masuk & di luar versi 1.0 |
| 03 | [Modul & Kebutuhan Fungsional](./03-modules/03-modules-index.md) | Index 10 modul fungsional |
| 04 | [Kebutuhan Non-Fungsional](./04-non-functional.md) | Keamanan, performa, kompatibilitas, dll |
| 05 | [Arsitektur & Stack Teknologi](./05-architecture.md) | Pendekatan arsitektur, pilihan teknologi |
| 06 | [Model Data (Entitas Utama)](./06-data-model.md) | Daftar entitas dan relasi database |
| 07 | [Alur Pengguna Utama (User Flow)](./07-user-flows.md) | 3 user flow kritis |
| 08 | [Metrik Keberhasilan & Risiko](./08-metrics-risks.md) | Target sukses dan analisis risiko |
| 09 | [Roadmap Pengembangan](./09-roadmap.md) | 5 fase selama 3–6 bulan |
| 10 | [Lampiran](./10-appendix.md) | Keputusan produk & hal yang perlu didiskusikan |

---

### Detail 10 Modul Fungsional

| Kode | Modul | File |
|------|-------|------|
| 6.1 | Agenda & Absensi QR | [03a-agenda-absensi.md](./03-modules/03a-agenda-absensi.md) |
| 6.2 | Surat-Menyurat (Bulk & TTD Digital) | [03b-surat-menyurat.md](./03-modules/03b-surat-menyurat.md) |
| 6.3 | Laporan Akhir Bulan | [03c-laporan-bulanan.md](./03-modules/03c-laporan-bulanan.md) |
| 6.4 | Keuangan Kegiatan (OCR Struk) | [03d-keuangan.md](./03-modules/03d-keuangan.md) |
| 6.5 | Data Kader & Keluarga | [03e-kader-keluarga.md](./03-modules/03e-kader-keluarga.md) |
| 6.6 | Manajemen Pengguna & Struktur Organisasi | [03f-manajemen-pengguna.md](./03-modules/03f-manajemen-pengguna.md) |
| 6.7 | Jenjang Kaderisasi & Rapor Kader | [03g-jenjang-kaderisasi.md](./03-modules/03g-jenjang-kaderisasi.md) |
| 6.8 | Dokumentasi Kegiatan | [03h-dokumentasi.md](./03-modules/03h-dokumentasi.md) |
| 6.9 | Notifikasi Terpusat | [03i-notifikasi.md](./03-modules/03i-notifikasi.md) |
| 6.10 | Halaman Publik & Profil Organisasi | [03j-halaman-publik.md](./03-modules/03j-halaman-publik.md) |

---

## Keterkaitan Antar Dokumen

```
00-overview
    └── 01-users-and-roles  ← RBAC yang dirujuk semua modul
    └── 02-scope            ← Batasan fitur

03-modules/
    ├── 03a-agenda-absensi  ← Jadi dasar: 03c, 03d, 03g, 03h, 03i
    ├── 03b-surat-menyurat  ← Terhubung: 03f (manajemen pengguna/TTD)
    ├── 03c-laporan-bulanan ← Agregat dari: 03a, 03d, 03h
    ├── 03d-keuangan        ← Terhubung: 03a (per agenda)
    ├── 03e-kader-keluarga  ← Terhubung: 03g, 03i
    ├── 03f-manajemen-pengguna ← Dasar RBAC sistem
    ├── 03g-jenjang-kaderisasi ← Terhubung: 03e, 03a
    ├── 03h-dokumentasi     ← Terhubung: 03a, 03c
    ├── 03i-notifikasi      ← Agregat notifikasi dari semua modul
    └── 03j-halaman-publik  ← Konsumsi data: 03f, 03a

05-architecture             ← Fondasi teknis semua modul
06-data-model               ← Entitas yang digunakan semua modul
07-user-flows               ← Implementasi praktis 03a, 03d, 03e
```

---

*PRD ini merupakan dokumen hidup yang dapat diperbarui seiring perkembangan proyek.*
