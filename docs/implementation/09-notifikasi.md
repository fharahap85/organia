# Fase 9: Notifikasi Terpusat

> **Tujuan:** Menyatukan semua trigger peringatan dalam satu sistem notifikasi (In-App). Termasuk integrasi Cron job untuk notifikasi terjadwal seperti estimasi pendidikan anak.
>
> **Referensi PRD:** [03i-notifikasi.md](../prd/03i-notifikasi.md)

---

## 🔔 9.1 Model & Migrasi Database

- [ ] 9.1.1 Buat migration & model `NotifikasiSistem`:
  - Kolom: `user_id` (penerima), `jenis_notifikasi`, `judul`, `pesan`, `is_read` (boolean), `url_tujuan` (opsional, untuk di-klik).
- [ ] 9.1.2 Tambahkan field preferensi notif ke tabel `Users` (contoh: `notif_preferences` jsonb).

## ⚙️ 9.2 Backend API: Cron Job & Broadcaster

- [ ] 9.2.1 Buat `NotifikasiController`:
  - `GET /api/notifikasi` (ambil list notifikasi milik user auth, pagination).
  - `PUT /api/notifikasi/{id}/read` (tandai sudah dibaca).
  - `PUT /api/notifikasi/read-all` (tandai semua dibaca).
- [ ] 9.2.2 Buat Laravel Console Command `php artisan organia:cek-pendidikan-anak`:
  - Melakukan loop pada data estimasi anak yang mendekati bulan Juli tahun ini (H-30).
  - Insert notifikasi ke tabel `NotifikasiSistem` untuk user dengan role Kaderisasi/Ketua.
  - Jadwalkan command ini berjalan harian di `app/Console/Kernel.php` (`->daily()`).
- [ ] 9.2.3 Buat sistem "Event Dispatcher" agar modul lain mudah mengirim notifikasi:
  - Misal saat `SuratMasuk` baru diinput, trigger `NotifikasiService::sendToRole('Ketua', 'Surat Masuk Baru...')`.

## 🖥️ 9.3 Frontend: Komponen Lonceng (Bell)

- [ ] 9.3.1 Buat Komponen Dropdown Notifikasi di Navbar/Topbar.
- [ ] 9.3.2 Tampilkan badge warna merah dengan jumlah notifikasi *unread*.
- [ ] 9.3.3 Handle klik notifikasi:
  - Panggil API tandai sudah dibaca.
  - Redirect (history.push) ke URL terkait (misal: ke halaman surat, atau ke profil kader terkait).
- [ ] 9.3.4 (Opsional) Implementasi WebSocket/Pusher jika ingin notifikasi muncul secara real-time tanpa refresh browser. Jika tidak, cukup ambil list saat komponen mount.
- [ ] 9.3.5 Buat Halaman "Pengaturan Notifikasi" (User Settings) untuk meng-enable/disable notif tertentu sesuai `notif_preferences`.

---

> **Langkah Selanjutnya:** Lanjut ke modul terakhir, yaitu [Fase 10: Halaman Publik](./10-halaman-publik.md).
