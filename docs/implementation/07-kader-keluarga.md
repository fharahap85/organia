# Fase 7: Data Kader & Keluarga

> **Tujuan:** Modul HRIS mini untuk organisasi. Mendata profil kader dan keluarganya, dengan enkripsi untuk data anak. Termasuk logika penentuan otomatis estimasi jenjang pendidikan anak.
>
> **Referensi PRD:** [03e-kader-keluarga.md](../prd/03e-kader-keluarga.md)

---

## 👪 7.1 Model & Migrasi Database

- [ ] 7.1.1 Buat migration & model `Kader`:
  - Kolom: `nama_lengkap`, `nik` (encrypted string), `tempat_lahir`, `tanggal_lahir`, `alamat`, `no_hp`, `email`, `status_keanggotaan`.
  - (*Catatan: enkripsi NIK diakses/didekripsi otomatis di model Laravel via Eloquent Mutators/Casts*).
- [ ] 7.1.2 Buat migration & model `AnggotaKeluarga`:
  - Kolom: `kader_id`, `tipe_hubungan` (pasangan/anak), `nama`, `tanggal_lahir` (encrypted jika anak), `jenis_kelamin`.
- [ ] 7.1.3 Buat migration & model `RiwayatPendidikanAnak`:
  - Kolom: `anggota_keluarga_id` (relasi ke tabel keluarga tipe anak), `jenjang` (TK/SD/SMP/SMA/Kuliah), `nama_sekolah`, `tahun_masuk`, `is_estimasi` (boolean, true jika ini baru hitungan sistem, false jika sudah diinput manual/aktual).

## 🧮 7.2 Backend API: Logika Estimasi & CRUD Data

- [ ] 7.2.1 Konfigurasi Enkripsi di Model:
  - Gunakan trait atau atribut `$casts = ['nik' => 'encrypted']` di Laravel.
- [ ] 7.2.2 Buat Helper/Service penghitungan estimasi pendidikan:
  - Logic: Berdasarkan `tanggal_lahir` anak, tentukan kapan umur mencapai batas (5th=TK, 7th=SD, 13th=SMP, 16th=SMA, 19th=Kuliah).
  - Ketika data anak baru ditambahkan/tanggal lahir diubah, jalankan fungsi ini untuk meng-insert data ke `RiwayatPendidikanAnak` dengan `is_estimasi = true`.
- [ ] 7.2.3 Buat Endpoint CRUD Profil `Kader` (dengan fitur pencarian & filter wilayah/status).
- [ ] 7.2.4 Buat Endpoint CRUD `AnggotaKeluarga`.
- [ ] 7.2.5 Buat Endpoint CRUD aktualisasi `RiwayatPendidikanAnak` (mengubah status estimasi menjadi data sekolah nyata).

## 🖥️ 7.3 Frontend: Manajemen Data Kader

- [ ] 7.3.1 Buat Halaman "Daftar Kader" (`/kader`).
  - Tabel dengan input Pencarian (Search by name) dan Filter.
- [ ] 7.3.2 Buat Halaman "Detail Kader" (`/kader/:id`).
  - Terdapat beberapa Tab/Section: Profil Diri, Data Keluarga (Pasangan & Anak), Jenjang Kaderisasi (di Fase 8).
- [ ] 7.3.3 Buat Form Tambah/Edit Data Diri Kader.
- [ ] 7.3.4 Buat Form Tambah Data Anak:
  - Khusus untuk data anak, tampilkan UI timeline/list riwayat pendidikan di sebelahnya.
- [ ] 7.3.5 Buat form modal "Aktualisasi Pendidikan Anak":
  - Memungkinkan staf Kaderisasi menginput nama sekolah saat tahun ajaran baru dimulai (menandakan estimasi sudah jadi aktual).

---

> **Langkah Selanjutnya:** Lanjut ke [Fase 8: Jenjang Kaderisasi & Rapor Kader](./08-jenjang-kaderisasi.md) untuk memonitor perkembangan setiap kader.
