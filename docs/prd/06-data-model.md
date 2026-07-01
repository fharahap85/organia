# 06 — Model Data (Entitas Utama)

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Arsitektur & Stack](./05-architecture.md) | [← Index](../README.md) | [Selanjutnya: User Flow →](./07-user-flows.md)

---

## Pendahuluan

Berikut entitas inti yang menjadi dasar perancangan skema database **PostgreSQL** Organia. Setiap entitas dipetakan ke modul fungsional terkait untuk memudahkan pelacakan. Detail kolom, tipe data, dan relasi lengkap akan disusun pada tahap desain database.

---

## Entitas per Domain

### 👥 Domain: Pengguna & Akses

| Entitas | Deskripsi | Modul Terkait |
|---------|-----------|--------------|
| **`Users`** | Akun pengguna sistem; relasi ke Role dan Periode Kepengurusan | [Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md) |
| **`Roles & Permissions`** | Daftar peran dan hak akses per modul | [Pengguna & Peran](./01-users-and-roles.md), [Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md) |
| **`PeriodeKepengurusan`** | Periode jabatan organisasi (mulai/akhir, status aktif) | [Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md) |
| **`StrukturOrganisasi`** | Bagan kepengurusan per periode (jabatan → pengguna) | [Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md), [Halaman Publik](./03-modules/03j-halaman-publik.md) |

---

### 📅 Domain: Agenda & Absensi

| Entitas | Deskripsi | Modul Terkait |
|---------|-----------|--------------|
| **`Agenda`** | Data kegiatan/rapat (judul, waktu, lokasi, bidang, status, flag publik) | [Agenda & Absensi](./03-modules/03a-agenda-absensi.md) |
| **`TemplateAbsensi`** | Susunan kolom absensi yang dapat dipakai ulang (JSON) | [Agenda & Absensi](./03-modules/03a-agenda-absensi.md) |
| **`Absensi`** | Data kehadiran per agenda; data tersimpan sesuai template yang dipilih (format JSON fleksibel) | [Agenda & Absensi](./03-modules/03a-agenda-absensi.md) |

---

### 📄 Domain: Surat-Menyurat

| Entitas | Deskripsi | Modul Terkait |
|---------|-----------|--------------|
| **`TemplateSurat`** | Template surat dengan placeholder dinamis dan format layout | [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |
| **`Surat`** | Surat yang dihasilkan: nomor, jenis, status TTD, file PDF, relasi ke penerima | [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |
| **`SuratMasuk`** | Pencatatan surat masuk beserta status disposisi dan tindak lanjut | [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |

---

### 💰 Domain: Keuangan

| Entitas | Deskripsi | Modul Terkait |
|---------|-----------|--------------|
| **`Struk`** | Bukti pengeluaran kegiatan: file gambar, hasil ekstraksi OCR, status verifikasi, relasi ke Agenda | [Keuangan Kegiatan](./03-modules/03d-keuangan.md) |

---

### 📊 Domain: Laporan

| Entitas | Deskripsi | Modul Terkait |
|---------|-----------|--------------|
| **`LaporanBulanan`** | Hasil generate laporan per periode dan bidang (file PDF, status, timestamp) | [Laporan Bulanan](./03-modules/03c-laporan-bulanan.md) |

---

### 🎓 Domain: Kader & Kaderisasi

| Entitas | Deskripsi | Modul Terkait |
|---------|-----------|--------------|
| **`Kader`** | Profil kader: data diri, jenjang kaderisasi saat ini, riwayat pelatihan, status | [Data Kader & Keluarga](./03-modules/03e-kader-keluarga.md) |
| **`AnggotaKeluarga`** | Data keluarga kader, termasuk anak dengan tanggal lahir | [Data Kader & Keluarga](./03-modules/03e-kader-keluarga.md) |
| **`RiwayatPendidikanAnak`** | Catatan jenjang sekolah anak: jenjang, nama sekolah, tahun masuk | [Data Kader & Keluarga](./03-modules/03e-kader-keluarga.md) |
| **`JenjangKaderisasi`** | Daftar jenjang kaderisasi organisasi dan syarat kenaikannya | [Jenjang Kaderisasi & Rapor](./03-modules/03g-jenjang-kaderisasi.md) |
| **`RiwayatPelatihanKader`** | Relasi kader dengan agenda pelatihan yang pernah diikuti | [Jenjang Kaderisasi & Rapor](./03-modules/03g-jenjang-kaderisasi.md) |

---

### 🔔 Domain: Notifikasi & Dokumentasi

| Entitas | Deskripsi | Modul Terkait |
|---------|-----------|--------------|
| **`NotifikasiSistem`** | Notifikasi terjadwal: jenis, penerima, pesan, status baca, channel | [Notifikasi Terpusat](./03-modules/03i-notifikasi.md) |
| **`DokumentasiKegiatan`** | File foto/video terhubung dengan Agenda: path, caption, tipe, timestamp | [Dokumentasi Kegiatan](./03-modules/03h-dokumentasi.md) |

---

## Peta Relasi Antar Entitas (ERD Ringkas)

```
PeriodeKepengurusan
    │ 1:N
    ├──→ Users
    │       │ 1:N
    │       └──→ [membuat] Agenda, Surat, LaporanBulanan
    │
    └──→ StrukturOrganisasi

Agenda
    │ 1:N
    ├──→ Absensi           (TemplateAbsensi menentukan format)
    ├──→ Struk             (pengeluaran per kegiatan)
    ├──→ DokumentasiKegiatan
    └──→ RiwayatPelatihanKader  (jika agenda = pelatihan kaderisasi)

Kader
    │ 1:N
    ├──→ AnggotaKeluarga
    │       │ 1:N
    │       └──→ RiwayatPendidikanAnak
    │
    └──→ RiwayatPelatihanKader → Agenda

JenjangKaderisasi
    └──→ [dimiliki oleh] Kader (current level)

NotifikasiSistem
    └──→ [dikirim ke] Users (berdasarkan peran)
```

---

## Catatan untuk Desain Database

- **Format fleksibel:** `Absensi` menyimpan data kolom sebagai JSON (`JSONB` di PostgreSQL) agar fleksibel mengikuti `TemplateAbsensi` yang dikustomisasi
- **Enkripsi:** Field sensitif di `Kader`, `AnggotaKeluarga`, `RiwayatPendidikanAnak` dienkripsi di level aplikasi Laravel
- **Audit columns:** Semua entitas utama memiliki `created_by`, `updated_by`, `created_at`, `updated_at`
- **Soft delete:** Entitas penting (Users, Kader, Agenda) menggunakan soft delete agar data historis tidak hilang

---

> [← Arsitektur & Stack](./05-architecture.md) | [← Index](../README.md) | [Selanjutnya: User Flow →](./07-user-flows.md)
