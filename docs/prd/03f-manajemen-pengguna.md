# Modul 6.6 — Manajemen Pengguna & Struktur Organisasi/Periodisasi

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Data Kader & Keluarga](./03e-kader-keluarga.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Jenjang Kaderisasi →](./03g-jenjang-kaderisasi.md)

---

## Deskripsi

Fondasi sistem Organia. Modul ini mengelola **akun pengguna, penetapan peran (RBAC)**, dan **struktur organisasi per periode kepengurusan** — sehingga riwayat jabatan tetap tersimpan ketika pengurus berganti, dan data dari periode sebelumnya tetap dapat diakses.

**Peran yang dapat mengakses:** Superadmin (full, exclusive)

---

## Kebutuhan Fungsional

### F-01 · Manajemen Akun Pengguna

- [ ] Superadmin dapat **menambah akun pengguna baru** dengan field:
  - Nama lengkap
  - Username / email login
  - Password awal (dapat diubah pengguna setelah login pertama)
  - Peran (Role): Ketua / Sekretaris / Bendahara / Kaderisasi / BIPEKA / Superadmin
  - Periode kepengurusan yang berlaku
- [ ] Superadmin dapat **mengedit** data dan peran pengguna
- [ ] Superadmin dapat **menonaktifkan akun** pengguna (tanpa menghapus data historis)
- [ ] Daftar seluruh pengguna aktif dan tidak aktif dapat dilihat dengan filter per peran dan periode

### F-02 · Role-Based Access Control (RBAC)

- [ ] Setiap akun memiliki **tepat satu peran** yang menentukan modul apa yang dapat diakses
- [ ] Hak akses per peran mengikuti matriks yang didefinisikan di [Target Pengguna & Peran](../01-users-and-roles.md)
- [ ] Perubahan peran pengguna berlaku segera setelah disimpan Superadmin
- [ ] Sistem mencatat riwayat peran pengguna (siapa menjabat apa di periode mana)

### F-03 · Periodisasi Kepengurusan

- [ ] Superadmin dapat membuat **periode kepengurusan** baru dengan field:
  - Nama periode (contoh: "Periode 2024–2027")
  - Tanggal mulai & berakhir
  - Status: aktif / selesai
- [ ] Hanya **satu periode** yang dapat berstatus aktif pada satu waktu
- [ ] Saat periode baru diaktifkan, periode lama otomatis berubah ke status "selesai"
- [ ] **Data dan laporan dari periode lama tetap dapat diakses** (read-only) meskipun kepengurusan telah berganti

### F-04 · Struktur Organisasi per Periode

- [ ] Superadmin dapat **menyusun bagan kepengurusan** per periode, meliputi:
  - Jabatan Ketua, Sekretaris, Bendahara
  - Bidang-bidang di bawah Ketua (Kaderisasi, BIPEKA, dll) beserta penanggungjawabnya
- [ ] Bagan organisasi dapat ditampilkan sebagai:
  - Referensi internal dalam sistem (dashboard)
  - Konten di [Halaman Publik](./03j-halaman-publik.md) organisasi (jika diaktifkan)
- [ ] Pengguna yang terhubung ke satu jabatan di bagan dapat melihat posisinya dalam struktur

---

## Entitas Data Terkait

Lihat [Model Data](../06-data-model.md) untuk skema lengkap.

| Entitas | Keterangan |
|---------|-----------|
| `Users` | Akun pengguna sistem dengan relasi ke Role dan Periode Kepengurusan |
| `Roles & Permissions` | Daftar peran dan hak akses per modul |
| `PeriodeKepengurusan` | Periode jabatan organisasi (mulai/akhir, status aktif) |
| `StrukturOrganisasi` | Bagan kepengurusan per periode |

---

## Modul yang Berintegrasi

| Modul | Jenis Integrasi |
|-------|----------------|
| **Semua modul** | RBAC dari modul ini menentukan siapa bisa akses apa |
| [Halaman Publik](./03j-halaman-publik.md) | Struktur organisasi aktif ditampilkan di halaman publik |
| [Surat-Menyurat](./03b-surat-menyurat.md) | Data pejabat & gambar TTD digital tersimpan di sini |

---

## Catatan Implementasi

- **Autentikasi:** Laravel Sanctum (token-based untuk SPA) — lihat [Arsitektur](../05-architecture.md)
- **RBAC middleware:** Setiap endpoint API dilindungi middleware yang memeriksa peran pengguna
- **Audit log:** Setiap perubahan akun dan peran dicatat dengan timestamp dan ID Superadmin yang melakukan perubahan
- **Keamanan password:** Password disimpan dengan bcrypt; reset password dikirim via email

---

> [← Data Kader & Keluarga](./03e-kader-keluarga.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Jenjang Kaderisasi →](./03g-jenjang-kaderisasi.md)
