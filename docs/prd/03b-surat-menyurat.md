# Modul 6.2 — Surat-Menyurat (Bulk & Tanda Tangan Digital)

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Agenda & Absensi](./03a-agenda-absensi.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Laporan Bulanan →](./03c-laporan-bulanan.md)

---

## Deskripsi

Modul untuk membuat surat secara **massal (bulk)** dari template, dengan opsi tanda tangan digital otomatis atau dikosongkan untuk ditandatangani secara fisik. Semua surat yang dibuat tersimpan otomatis di arsip digital yang terstruktur.

**Peran yang dapat mengakses:** Sekretaris (full: buat & kelola), Ketua (approval), Superadmin (full)

---

## Kebutuhan Fungsional

### F-01 · Manajemen Template Surat

- [ ] Pengguna dapat membuat template surat dengan:
  - Jenis surat: Undangan, Surat Tugas, Surat Keputusan, Surat Keterangan, dll
  - Konten template dengan **placeholder data dinamis** (contoh: `{{nama_penerima}}`, `{{jabatan}}`, `{{tanggal_kegiatan}}`)
  - Format layout standar organisasi (kop surat, tanda tangan, nomor)
- [ ] Template dapat disimpan, diedit, dan dipakai ulang
- [ ] Template dikelola oleh Sekretaris/Superadmin

### F-02 · Pembuatan Surat Massal (Bulk)

- [ ] Pengguna dapat membuat surat secara massal sekaligus dengan mengisi/mengimpor **daftar penerima**
  - Contoh: 30 surat undangan untuk 30 kader berbeda dalam satu proses generate
- [ ] Data penerima dapat diinput manual atau diimport dari file Excel/CSV
- [ ] Sistem mengisi placeholder secara otomatis untuk setiap penerima

### F-03 · Penomoran Surat Otomatis

- [ ] Sistem memberikan **nomor surat otomatis** sesuai format penomoran yang dapat dikonfigurasi:
  - Format: `[nomor-urut]/[kode-bidang]/[bulan]/[tahun]`
  - Contoh: `001/SEK/VI/2026`
- [ ] Penomoran urut tidak boleh duplikat; sistem memastikan urutan konsisten

### F-04 · Opsi Tanda Tangan

- [ ] Pengguna dapat memilih salah satu dari dua opsi tanda tangan:
  1. **Tanda tangan digital**: gambar tanda tangan pejabat berwenang yang tersimpan di sistem disisipkan otomatis
  2. **Kolom kosong**: kolom tanda tangan dibiarkan kosong untuk dicetak dan ditandatangani secara manual
- [ ] Gambar tanda tangan digital dikelola oleh Superadmin/Ketua; tidak dapat diakses peran lain

### F-05 · Arsip Surat Keluar

- [ ] Seluruh surat yang dibuat **otomatis tersimpan dalam arsip surat keluar**
- [ ] Pencarian arsip berdasarkan: nomor surat, tanggal, jenis, atau nama penerima
- [ ] Surat dapat diunduh ulang kapan saja dalam format **PDF**

### F-06 · Pencatatan Surat Masuk

- [ ] Pengguna dapat mencatat surat masuk dengan field:
  - Nomor & tanggal surat masuk
  - Pengirim
  - Perihal
  - File surat (upload PDF/gambar)
- [ ] Surat masuk dapat **didisposisikan** ke bidang terkait
- [ ] Pencatatan **status tindak lanjut** (belum ditindaklanjuti / sedang diproses / selesai)
- [ ] Notifikasi otomatis ke peran terkait saat ada surat masuk baru (lihat [Notifikasi Terpusat](./03i-notifikasi.md))

### F-07 · Ekspor PDF

- [ ] Surat dapat diunduh dalam format **PDF siap cetak atau kirim digital**
- [ ] Generate PDF diproses via background queue agar tidak membebani server saat bulk generation besar

---

## Entitas Data Terkait

Lihat [Model Data](../06-data-model.md) untuk skema lengkap.

| Entitas | Keterangan |
|---------|-----------|
| `TemplateSurat` | Template surat dengan placeholder dinamis |
| `Surat` | Surat yang dihasilkan (nomor, jenis, status TTD, file PDF, relasi ke penerima) |
| `SuratMasuk` | Pencatatan surat masuk beserta status disposisi |

---

## Modul yang Berintegrasi

| Modul | Jenis Integrasi |
|-------|----------------|
| [Manajemen Pengguna](./03f-manajemen-pengguna.md) | Data pejabat & gambar TTD digital tersimpan di manajemen pengguna |
| [Notifikasi Terpusat](./03i-notifikasi.md) | Notifikasi surat masuk yang perlu ditindaklanjuti |
| [Laporan Bulanan](./03c-laporan-bulanan.md) | Rekap surat masuk/keluar dapat disertakan dalam laporan |

---

## Catatan Implementasi

- **Generate PDF:** Menggunakan Spatie Laravel PDF / DomPDF; diproses via [Laravel Queue](../05-architecture.md)
- **Bulk generation besar:** Proses generate 30+ surat sekaligus harus diqueue agar tidak timeout
- **Keamanan TTD digital:** Gambar tanda tangan hanya dapat diakses sistem (tidak dapat diunduh langsung oleh pengguna biasa)

---

> [← Agenda & Absensi](./03a-agenda-absensi.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Laporan Bulanan →](./03c-laporan-bulanan.md)
