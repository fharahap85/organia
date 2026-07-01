# Modul 6.5 — Data Kader & Keluarga

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Keuangan Kegiatan](./03d-keuangan.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Manajemen Pengguna →](./03f-manajemen-pengguna.md)

---

## Deskripsi

Modul sistem informasi kader yang mencatat **data kader beserta anggota keluarganya**, dengan fitur unggulan berupa **notifikasi otomatis** saat anak kader diperkirakan memasuki jenjang pendidikan baru (TK, SD, SMP, SMA, Perguruan Tinggi).

**Peran yang dapat mengakses:** Kaderisasi (full), Superadmin (full), Ketua (view), BIPEKA (akses terbatas sesuai relevansi program)

> ⚠️ **Data Sensitif:** Modul ini menyimpan data pribadi anak-anak. Akses dibatasi ketat hanya untuk peran yang relevan. Data dienkripsi saat disimpan. Lihat [Kebutuhan Non-Fungsional](../04-non-functional.md) untuk kebijakan keamanan.

---

## Kebutuhan Fungsional

### F-01 · Profil Kader

- [ ] Pengguna (Kaderisasi/Superadmin) dapat mendata profil kader meliputi:
  - Data diri: nama lengkap, NIK, tempat/tanggal lahir, alamat, nomor HP, email
  - Jenjang kaderisasi saat ini (terhubung ke [Modul Jenjang Kaderisasi](./03g-jenjang-kaderisasi.md))
  - Riwayat pelatihan/kegiatan kaderisasi yang pernah diikuti
  - Status keanggotaan (aktif / tidak aktif / alumni)
- [ ] Data kader dapat diedit dan diperbarui seiring waktu

### F-02 · Data Anggota Keluarga

- [ ] Pengguna dapat mendata anggota keluarga kader, meliputi:
  - Pasangan (nama, pekerjaan)
  - Anak: nama, tanggal lahir, jenis kelamin, riwayat pendidikan
- [ ] Untuk setiap anak, dapat dicatat riwayat pendidikan:
  - Jenjang sekolah (TK / SD / SMP / SMA / Kuliah)
  - Nama sekolah/institusi
  - Tahun masuk

### F-03 · Estimasi Jenjang Pendidikan Anak & Notifikasi Otomatis

- [ ] Sistem secara **otomatis menghitung perkiraan** waktu anak kader memasuki jenjang pendidikan berikutnya berdasarkan usia anak
  - Rujukan usia standar masuk jenjang pendidikan Indonesia (TK: 5 tahun, SD: 7 tahun, SMP: 13 tahun, SMA: 16 tahun, Kuliah: 19 tahun)
- [ ] Sistem **mengirimkan notifikasi** kepada Kaderisasi/Ketua menjelang waktu estimasi tersebut tiba
  - Contoh: "Anak kader [nama] diperkirakan masuk SD pada Juli 2027"
- [ ] Detail notifikasi dikelola oleh [Modul Notifikasi Terpusat](./03i-notifikasi.md)

### F-04 · Pencatatan Manual Aktual Jenjang Pendidikan

- [ ] Pengguna dapat mencatat secara manual saat anak **benar-benar memasuki** jenjang pendidikan tertentu
  - Field: jenjang, nama sekolah, tanggal masuk
- [ ] Pencatatan manual memperbarui status estimasi otomatis sehingga data tetap akurat meski ada penyesuaian dari estimasi
- [ ] Sistem tidak lagi mengirimkan notifikasi estimasi jika jenjang tersebut sudah dicatat secara aktual

### F-05 · Pencarian & Filter Data Kader

- [ ] Sistem menyediakan pencarian dan filter data kader berdasarkan:
  - Nama kader
  - Wilayah/cabang
  - Jenjang kaderisasi
  - Status keanggotaan (aktif / alumni)
  - Bidang kegiatan

### F-06 · Kontrol Akses Data Keluarga

- [ ] Akses ke data keluarga dan anak **dibatasi hanya untuk peran yang relevan:**
  - Kaderisasi, Ketua, Superadmin: akses penuh
  - BIPEKA: akses terbatas pada data yang relevan dengan program perempuan & ketahanan keluarga
  - Bendahara, Sekretaris: **tidak ada akses** ke data keluarga/anak kader

---

## Entitas Data Terkait

Lihat [Model Data](../06-data-model.md) untuk skema lengkap.

| Entitas | Keterangan |
|---------|-----------|
| `Kader` | Profil kader (data diri, jenjang kaderisasi, riwayat pelatihan, status) |
| `AnggotaKeluarga` | Data keluarga kader termasuk anak dengan tanggal lahir |
| `RiwayatPendidikanAnak` | Catatan jenjang sekolah anak (jenjang, nama sekolah, tahun masuk) |
| `NotifikasiSistem` | Notifikasi terjadwal jenjang pendidikan (dikelola bersama [Modul Notifikasi](./03i-notifikasi.md)) |

---

## User Flow Terkait

Lihat [Alur 10.3: Notifikasi Pendidikan Anak Kader](../07-user-flows.md#103-alur-notifikasi-pendidikan-anak-kader) untuk gambaran lengkap.

---

## Modul yang Berintegrasi

| Modul | Jenis Integrasi |
|-------|----------------|
| [Jenjang Kaderisasi](./03g-jenjang-kaderisasi.md) | Data jenjang & riwayat pelatihan kader |
| [Notifikasi Terpusat](./03i-notifikasi.md) | Trigger notifikasi estimasi jenjang pendidikan anak |
| [Agenda & Absensi](./03a-agenda-absensi.md) | Riwayat kehadiran kader di kegiatan organisasi |

---

## Catatan Implementasi

- **Enkripsi:** Data anak (nama, tanggal lahir) dienkripsi at-rest menggunakan enkripsi di level aplikasi
- **Kalkulasi estimasi:** Dijalankan via scheduled job harian; notifikasi dikirim H-30 dan H-7 sebelum estimasi bulan masuk sekolah (Juli)
- **Log akses:** Setiap akses ke data keluarga dicatat dalam audit log (siapa, kapan, data apa)

---

> [← Keuangan Kegiatan](./03d-keuangan.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Manajemen Pengguna →](./03f-manajemen-pengguna.md)
