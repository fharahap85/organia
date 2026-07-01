# Modul 6.10 — Halaman Publik & Profil Organisasi

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Notifikasi Terpusat](./03i-notifikasi.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Non-Fungsional →](../04-non-functional.md)

---

## Deskripsi

Halaman publik **opsional** yang menampilkan profil organisasi, struktur pengurus aktif, dan kalender kegiatan secara terbuka kepada masyarakat umum — tanpa perlu login. Bertujuan sebagai bentuk transparansi dan identitas digital organisasi.

**Peran yang dapat mengelola:** Superadmin (aktifkan/nonaktifkan, kelola konten)

> 📌 **Status:** Opsional — dapat diaktifkan atau dinonaktifkan sesuai kebijakan organisasi.

---

## Kebutuhan Fungsional

### F-01 · Profil Organisasi

- [ ] Halaman publik menampilkan:
  - Nama dan logo organisasi
  - Visi dan misi
  - Sejarah singkat (opsional)
  - Kontak organisasi
- [ ] Konten profil dapat diedit oleh Superadmin melalui panel admin

### F-02 · Struktur Kepengurusan Periode Aktif

- [ ] Menampilkan **bagan atau daftar kepengurusan periode aktif** yang disusun di [Modul Manajemen Pengguna](./03f-manajemen-pengguna.md)
- [ ] Tampilan: nama jabatan dan nama pejabat (tanpa data sensitif seperti kontak pribadi)
- [ ] Otomatis diperbarui saat Superadmin memperbarui struktur di panel admin

### F-03 · Kalender Kegiatan Publik

- [ ] Menampilkan **kalender agenda** yang ditandai sebagai "publik/terbuka untuk umum" oleh Sekretaris/Superadmin saat membuat agenda di [Modul Agenda & Absensi](./03a-agenda-absensi.md)
- [ ] Agenda yang tidak ditandai publik **tidak tampil** di halaman ini
- [ ] Pengunjung dapat melihat: judul kegiatan, tanggal, waktu, lokasi, dan deskripsi singkat
- [ ] Tidak ada data kehadiran atau informasi internal yang ditampilkan ke publik

### F-04 · Toggle Aktif/Nonaktif

- [ ] Superadmin dapat **mengaktifkan atau menonaktifkan** halaman publik sepenuhnya sesuai kebijakan organisasi
- [ ] Saat dinonaktifkan, URL halaman publik menampilkan halaman "tidak tersedia" atau redirect
- [ ] Pengaturan ini tidak mempengaruhi data internal sistem sama sekali

---

## Entitas Data Terkait

Lihat [Model Data](../06-data-model.md) untuk skema lengkap.

| Entitas | Keterangan |
|---------|-----------|
| `StrukturOrganisasi` | Bagan kepengurusan aktif (dari [Manajemen Pengguna](./03f-manajemen-pengguna.md)) |
| `Agenda` | Agenda yang ditandai publik (dari [Agenda & Absensi](./03a-agenda-absensi.md)) |

---

## Modul yang Berintegrasi

| Modul | Jenis Integrasi |
|-------|----------------|
| [Manajemen Pengguna & Struktur Organisasi](./03f-manajemen-pengguna.md) | **Sumber data** struktur kepengurusan yang ditampilkan |
| [Agenda & Absensi](./03a-agenda-absensi.md) | **Sumber data** agenda yang ditandai publik untuk kalender |

---

## Catatan Implementasi

- **Akses publik:** Endpoint API khusus tanpa autentikasi untuk data publik; **tidak ada endpoint privat** yang dapat diakses dari halaman ini
- **SEO:** Halaman dirender dengan meta tags yang tepat (nama organisasi, deskripsi, OG image)
- **Caching:** Data halaman publik di-cache untuk mengurangi beban query database; invalidasi cache saat ada update konten
- **Fase pengembangan:** Modul ini dikerjakan di [Fase 5](../09-roadmap.md) — setelah semua modul inti selesai

---

> [← Notifikasi Terpusat](./03i-notifikasi.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Non-Fungsional →](../04-non-functional.md)
