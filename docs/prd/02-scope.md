# 02 — Lingkup Produk (Scope)

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Pengguna & Peran](./01-users-and-roles.md) | [← Index](../README.md) | [Selanjutnya: Modul Fungsional →](./03-modules/03-modules-index.md)

---

## 5.1 Termasuk dalam Lingkup (In Scope) — Versi 1.0

Fitur-fitur berikut **wajib hadir** pada rilis pertama Organia:

| # | Fitur | Modul Detail |
|---|-------|-------------|
| 1 | Manajemen agenda/kegiatan dengan format kolom absensi yang dapat disesuaikan | [Agenda & Absensi](./03-modules/03a-agenda-absensi.md) |
| 2 | Generate QR code untuk absensi yang dapat dibagikan dan diisi peserta secara mandiri (tanpa login) | [Agenda & Absensi](./03-modules/03a-agenda-absensi.md) |
| 3 | Pembuatan surat secara massal (bulk) dengan opsi tanda tangan digital atau dikosongkan untuk ditandatangani manual | [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |
| 4 | Penomoran surat otomatis dan pengarsipan surat masuk/keluar | [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |
| 5 | Laporan akhir bulan otomatis berdasarkan rekap agenda dan kegiatan yang telah dilaksanakan | [Laporan Bulanan](./03-modules/03c-laporan-bulanan.md) |
| 6 | Modul keuangan kegiatan: input bukti struk/kwitansi dengan ekstraksi OCR, verifikasi & edit manual, ekspor PDF gabungan | [Keuangan Kegiatan](./03-modules/03d-keuangan.md) |
| 7 | Manajemen data kader dan anggota keluarga dengan notifikasi otomatis jenjang pendidikan anak | [Data Kader & Keluarga](./03-modules/03e-kader-keluarga.md) |
| 8 | Kontrol akses berbasis peran (Superadmin, Ketua, Sekretaris, Bendahara, Kaderisasi, BIPEKA) | [Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md) |
| 9 | Jenjang kaderisasi & rapor perkembangan per kader | [Jenjang Kaderisasi](./03-modules/03g-jenjang-kaderisasi.md) |
| 10 | Dokumentasi kegiatan (foto/video) terhubung dengan data agenda | [Dokumentasi Kegiatan](./03-modules/03h-dokumentasi.md) |
| 11 | Notifikasi terpusat (in-app, opsional WhatsApp/email) | [Notifikasi Terpusat](./03-modules/03i-notifikasi.md) |
| 12 | Halaman publik profil organisasi & kalender kegiatan | [Halaman Publik](./03-modules/03j-halaman-publik.md) |
| 13 | Struktur organisasi & periodisasi kepengurusan | [Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md) |

---

## 5.2 Di Luar Lingkup (Out of Scope) — Versi 1.0

Fitur-fitur berikut **sengaja tidak disertakan** pada versi awal:

| Fitur | Alasan Dikecualikan | Kemungkinan Masa Depan |
|-------|--------------------|-----------------------|
| **Pengelolaan iuran/kas anggota** | Keputusan produk yang disepakati; modul satu-satunya yang sengaja dikecualikan dari saran awal | Bisa ditambahkan di v2.0 |
| **Aplikasi mobile native** (iOS/Android) | Versi awal cukup berbasis web responsif | Pertimbangkan setelah web stabil |
| **Integrasi pembayaran online** | Di luar kebutuhan inti saat ini | Relevan jika iuran/kas ditambahkan |
| **Multi-tenant penuh** (banyak organisasi berbeda) | Kompleksitas tinggi; di luar kebutuhan versi portofolio | Dipertimbangkan sebagai potensi model SaaS di masa mendatang |

---

## Catatan Keputusan Produk

> 📌 Keputusan pengecualian iuran/kas anggota adalah satu-satunya modul yang sengaja dikecualikan dari saran awal. Seluruh 10 modul lainnya — termasuk jenjang kaderisasi, dokumentasi, notifikasi terpusat, halaman publik, dan struktur organisasi — **disepakati masuk ke versi 1.0**.

Lihat detail keputusan produk selengkapnya di [Lampiran](./10-appendix.md).

---

## Keterkaitan dengan Roadmap

Meskipun semua fitur di atas masuk dalam scope v1.0, pengembangan dilakukan bertahap sesuai [Roadmap 5 Fase](./09-roadmap.md):

- **Fase 1–2**: Agenda, Absensi, Surat-Menyurat, Dokumentasi *(prioritas tertinggi)*
- **Fase 3**: Keuangan & Laporan Bulanan
- **Fase 4**: Kader, Jenjang Kaderisasi, Notifikasi
- **Fase 5**: Halaman Publik & finalisasi

---

> [← Pengguna & Peran](./01-users-and-roles.md) | [← Index](../README.md) | [Selanjutnya: Modul Fungsional →](./03-modules/03-modules-index.md)
