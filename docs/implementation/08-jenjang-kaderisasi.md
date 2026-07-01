# Fase 8: Jenjang Kaderisasi & Rapor Kader

> **Tujuan:** Memantau perkembangan setiap kader berdasarkan kegiatan/pelatihan yang mereka ikuti. Memberikan "Rapor Kader" sebagai landasan evaluasi.
>
> **Referensi PRD:** [03g-jenjang-kaderisasi.md](../prd/03g-jenjang-kaderisasi.md)

---

## 📈 8.1 Model & Migrasi Database

- [ ] 8.1.1 Buat migration & model `JenjangKaderisasi`:
  - Kolom: `nama_jenjang` (Dasar/Menengah/dll), `syarat_kenaikan` (jsonb atau text).
  - Update tabel `Kader` tambahkan `jenjang_saat_ini_id`.
- [ ] 8.1.2 Buat migration & model `RiwayatPelatihanKader`:
  - Kolom: `kader_id`, `agenda_id` (jika dari kegiatan internal), `nama_pelatihan_eksternal` (jika input manual luar sistem), `tanggal_pelatihan`.

## ⚙️ 8.2 Backend API: Auto-Rekam & Rapor

- [ ] 8.2.1 Event Listener Absensi:
  - Buat Laravel Event `AbsensiTercatat`.
  - Buat Listener yang mengecek apakah agenda terkait adalah tipe "Kaderisasi". Jika ya, insert/update ke tabel `RiwayatPelatihanKader` untuk `kader_id` yang cocok.
- [ ] 8.2.2 Buat Endpoint CRUD Konfigurasi `JenjangKaderisasi` (Admin/Kaderisasi).
- [ ] 8.2.3 Buat Endpoint `GET /api/kader/{id}/rapor`:
  - Return data jenjang kader saat ini.
  - Return history pelatihan (gabungan dari `RiwayatPelatihanKader`).
  - Return logic rekomendasi (membandingkan syarat jenjang selanjutnya dengan pelatihan yang sudah diikuti).

## 🖥️ 8.3 Frontend: Rapor Perkembangan Kader

- [ ] 8.3.1 Pada Halaman "Detail Kader", tambahkan tab "Rapor Kaderisasi".
- [ ] 8.3.2 Tampilkan UI Progress:
  - Nama Jenjang saat ini.
  - Progress bar atau checklist syarat menuju jenjang berikutnya.
- [ ] 8.3.3 Tampilkan List Riwayat Pelatihan.
  - Sediakan form untuk "Tambah Pelatihan Manual" (jika pelatihan dilakukan di luar/sebelum sistem dipakai).
- [ ] 8.3.4 Buat Halaman "Dashboard Kaderisasi" (Rekap):
  - Tampilkan Chart/Angka: Jumlah kader per jenjang.
  - Tampilkan Tabel: "Kader yang Siap Naik Jenjang".

---

> **Langkah Selanjutnya:** Lanjut ke pembuatan sistem notifikasi terpusat di [Fase 9: Notifikasi Terpusat](./09-notifikasi.md).
