# Modul 6.9 — Notifikasi Terpusat

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Dokumentasi Kegiatan](./03h-dokumentasi.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Halaman Publik →](./03j-halaman-publik.md)

---

## Deskripsi

Modul yang **memusatkan seluruh pengingat dan notifikasi sistem** dalam satu mekanisme terpadu — dari notifikasi jenjang pendidikan anak kader, pengingat agenda mendatang, hingga peringatan struk yang belum diverifikasi. Pengguna dapat menyesuaikan notifikasi mana yang ingin mereka terima sesuai perannya.

**Peran yang dapat mengakses:** Semua peran (sesuai preferensi masing-masing)

---

## Sumber Notifikasi

Modul ini mengagregasi notifikasi dari seluruh modul lain:

| Sumber | Jenis Notifikasi | Penerima Default |
|--------|-----------------|-----------------|
| [Data Kader & Keluarga](./03e-kader-keluarga.md) | Estimasi jenjang pendidikan anak kader akan tiba | Kaderisasi, Ketua |
| [Agenda & Absensi](./03a-agenda-absensi.md) | Pengingat agenda mendatang (H-1, H-7) | Semua peran sesuai bidang |
| [Surat-Menyurat](./03b-surat-menyurat.md) | Surat masuk baru yang perlu ditindaklanjuti | Ketua, Sekretaris |
| [Keuangan Kegiatan](./03d-keuangan.md) | Struk hasil OCR siap diverifikasi; struk belum diperiksa | Bendahara |
| [Laporan Bulanan](./03c-laporan-bulanan.md) | Laporan PDF selesai digenerate | Sekretaris, Ketua |

---

## Kebutuhan Fungsional

### F-01 · Notifikasi In-App

- [ ] Sistem menampilkan **notifikasi dalam aplikasi** (bell icon dengan badge) yang dapat diklik untuk melihat detail
- [ ] Pengguna dapat menandai notifikasi sebagai "sudah dibaca"
- [ ] Pengguna dapat melihat histori semua notifikasi (terbaca dan belum terbaca)
- [ ] Notifikasi yang sudah lama (> 30 hari) secara otomatis diarsipkan

### F-02 · Notifikasi via WhatsApp (Opsional)

- [ ] Sistem mendukung pengiriman notifikasi penting via **WhatsApp** menggunakan penyedia API pihak ketiga (Fonnte/Wablas/dll)
- [ ] WhatsApp notification bersifat **opsional** per pengguna — dapat diaktifkan/dinonaktifkan
- [ ] Jika diaktifkan, pengguna memasukkan nomor WhatsApp di profil mereka
- [ ] Hanya notifikasi prioritas tinggi yang dikirim via WhatsApp (bukan semua notifikasi)

### F-03 · Notifikasi via Email (Opsional)

- [ ] Sistem mendukung pengiriman notifikasi via **email**
- [ ] Email notification bersifat **opsional** per pengguna — dapat diaktifkan/dinonaktifkan
- [ ] Email dikirim menggunakan konfigurasi SMTP/Mailgun yang dapat dikonfigurasi Superadmin

### F-04 · Preferensi Notifikasi

- [ ] Setiap pengguna dapat **mengatur preferensi notifikasi** yang ingin diterima:
  - Jenis notifikasi mana yang diaktifkan (dari daftar sumber di atas)
  - Channel yang digunakan: in-app saja / in-app + WhatsApp / in-app + email / semua
- [ ] Preferensi disimpan per akun pengguna

---

## Entitas Data Terkait

Lihat [Model Data](../06-data-model.md) untuk skema lengkap.

| Entitas | Keterangan |
|---------|-----------|
| `NotifikasiSistem` | Notifikasi terjadwal (jenis, penerima, pesan, status baca, timestamp) |

---

## Catatan Implementasi

- **Trigger notifikasi:** Dijalankan via **Laravel Queue** dan **scheduled jobs** (cron harian untuk cek jenjang pendidikan, event-driven untuk notifikasi real-time seperti surat masuk)
- **WhatsApp API:** Gunakan penyedia yang mendukung template message; rate limit perlu diperhatikan
- **Penghindaran spam:** Notifikasi yang sama tidak dikirim ulang jika sudah dikirim dalam window waktu yang sama (deduplikasi)
- **Graceful degradation:** Jika WhatsApp/email gagal dikirim, notifikasi in-app tetap berfungsi normal

---

> [← Dokumentasi Kegiatan](./03h-dokumentasi.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Halaman Publik →](./03j-halaman-publik.md)
