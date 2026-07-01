# Modul 6.1 — Agenda & Absensi QR

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Index Modul](./03-modules-index.md) | [← Index Utama](../README.md) | [Selanjutnya: Surat-Menyurat →](./03b-surat-menyurat.md)

---

## Deskripsi

Modul untuk membuat agenda rapat atau kegiatan apa pun, lengkap dengan **QR code absensi** yang formatnya dapat disesuaikan sesuai kebutuhan kegiatan. Peserta mengisi absensi secara mandiri tanpa perlu memiliki akun di sistem.

**Peran yang dapat mengakses:** Sekretaris (full), Ketua (view + approve), Superadmin (full), BIPEKA (bidang sendiri)

---

## Kebutuhan Fungsional

### F-01 · Pembuatan Agenda

- [ ] Pengguna (Sekretaris/Ketua/Superadmin) dapat membuat agenda baru dengan field:
  - Judul kegiatan
  - Deskripsi
  - Tanggal & waktu (mulai–selesai)
  - Lokasi
  - Bidang penyelenggara
  - Status (draft / aktif / selesai)
- [ ] Agenda dapat dikaitkan dengan pelatihan kaderisasi (relasi ke [Modul Jenjang Kaderisasi](./03g-jenjang-kaderisasi.md))

### F-02 · Template Kolom Absensi Kustom

- [ ] Pengguna dapat menentukan **kolom data absensi secara bebas** sesuai kebutuhan kegiatan.
  - Contoh kolom: Nama, Jabatan, Nomor HP, Asal Cabang, atau kolom kustom lainnya
- [ ] Pengguna dapat **menyimpan susunan kolom sebagai template** untuk dipakai ulang pada kegiatan serupa
- [ ] Format kolom tersimpan fleksibel (JSON) agar mudah diperluas tanpa mengubah skema database

### F-03 · Generate & Distribusi QR Code

- [ ] Sistem menghasilkan **QR code unik per agenda** yang mengarah ke form absensi online
- [ ] QR code dapat dibagikan dalam bentuk:
  - Tautan (URL langsung)
  - Gambar QR yang dapat diunduh/dicetak
- [ ] QR code dapat diberi **masa berlaku** (aktif hanya pada rentang waktu kegiatan berlangsung)
- [ ] QR code non-aktif setelah masa berlaku berakhir; peserta tidak dapat lagi mengisi absensi

### F-04 · Pengisian Absensi oleh Peserta

- [ ] Peserta memindai QR dan mengisi form absensi melalui browser **tanpa perlu login/memiliki akun**
- [ ] Form absensi menampilkan kolom sesuai template yang telah ditentukan Sekretaris
- [ ] Sistem memberikan konfirmasi visual setelah pengisian berhasil

### F-05 · Manajemen Absensi oleh Sekretaris

- [ ] Sekretaris dapat **menambahkan absensi susulan secara manual** (untuk peserta yang tidak scan QR) dengan catatan alasan
- [ ] Sekretaris dapat mengedit atau menghapus entri absensi yang keliru

### F-06 · Rekap & Ekspor Kehadiran

- [ ] Sistem menampilkan **rekap kehadiran per agenda secara real-time** (jumlah hadir, daftar nama)
- [ ] Data kehadiran dapat diunduh sebagai:
  - File **Excel** (.xlsx)
  - File **PDF**
- [ ] Data rekap ini digunakan otomatis oleh [Modul Laporan Bulanan](./03c-laporan-bulanan.md)

---

## Entitas Data Terkait

Lihat [Model Data](../06-data-model.md) untuk skema lengkap.

| Entitas | Keterangan |
|---------|-----------|
| `Agenda` | Data kegiatan/rapat utama |
| `TemplateAbsensi` | Susunan kolom absensi yang dapat dipakai ulang |
| `Absensi` | Data kehadiran per agenda (format fleksibel/JSON sesuai template) |

---

## User Flow Terkait

Lihat [Alur 10.1: Pembuatan Agenda & Absensi](../07-user-flows.md#101-alur-pembuatan-agenda--absensi) untuk gambaran lengkap langkah-langkahnya.

---

## Modul yang Berintegrasi dengan Modul Ini

| Modul | Jenis Integrasi |
|-------|----------------|
| [Laporan Bulanan](./03c-laporan-bulanan.md) | Agenda & rekap kehadiran jadi bahan laporan otomatis |
| [Keuangan Kegiatan](./03d-keuangan.md) | Struk/bukti pengeluaran dikaitkan ke agenda tertentu |
| [Jenjang Kaderisasi](./03g-jenjang-kaderisasi.md) | Agenda pelatihan dicatat sebagai riwayat kaderisasi kader |
| [Dokumentasi Kegiatan](./03h-dokumentasi.md) | Foto/video kegiatan diunggah dan dikaitkan ke agenda ini |
| [Notifikasi Terpusat](./03i-notifikasi.md) | Pengingat agenda mendatang dikirimkan via notifikasi |
| [Halaman Publik](./03j-halaman-publik.md) | Agenda yang ditandai publik tampil di kalender publik |

---

## Catatan Implementasi

- **Stack terkait:** Laravel Queue untuk proses generate QR di background; library `Simple QR Code` untuk Laravel
- **Penyimpanan gambar QR:** Menggunakan Laravel Filesystem (lokal/VPS)
- **Pertimbangan resource:** Generate QR ringan, tidak perlu diqueue; namun generate PDF rekap sebaiknya diqueue

Lihat [Arsitektur & Stack Teknologi](../05-architecture.md) untuk konteks teknis lengkap.

---

> [← Index Modul](./03-modules-index.md) | [← Index Utama](../README.md) | [Selanjutnya: Surat-Menyurat →](./03b-surat-menyurat.md)
