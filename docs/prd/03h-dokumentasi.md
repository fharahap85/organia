# Modul 6.8 — Dokumentasi Kegiatan

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Jenjang Kaderisasi](./03g-jenjang-kaderisasi.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Notifikasi Terpusat →](./03i-notifikasi.md)

---

## Deskripsi

Modul untuk **menyimpan dan mengelola dokumentasi visual** (foto/video) setiap kegiatan, terhubung langsung dengan data Agenda terkait. Dokumentasi ini dapat disertakan secara otomatis dalam laporan bulanan sehingga laporan ke pengurus pusat lebih informatif — tanpa perlu menyusun lampiran foto secara manual.

**Peran yang dapat mengakses:** Semua peran (upload untuk bidang sendiri), Superadmin (full)

---

## Kebutuhan Fungsional

### F-01 · Upload Dokumentasi per Agenda

- [ ] Pengguna dapat **mengunggah foto atau video dokumentasi** pada agenda yang telah atau sedang berlangsung
- [ ] Mendukung format:
  - Foto: JPG, PNG, WEBP
  - Video: MP4 (opsional, dengan batasan ukuran file)
- [ ] Upload dilakukan secara langsung dari browser (termasuk dari perangkat mobile untuk kemudahan di lapangan)
- [ ] Setiap file yang diunggah **dikaitkan secara otomatis** ke agenda yang bersangkutan

### F-02 · Galeri Per Agenda

- [ ] Dokumentasi tersimpan dalam **galeri per agenda** yang dapat dilihat oleh pengguna yang memiliki akses ke agenda tersebut
- [ ] Setiap item dokumentasi dapat diberi **keterangan singkat** (caption)
- [ ] Galeri menampilkan thumbnail preview untuk foto; link download/play untuk video

### F-03 · Integrasi dengan Laporan Bulanan

- [ ] [Laporan Akhir Bulan](./03c-laporan-bulanan.md) secara otomatis dapat **menyertakan cuplikan dokumentasi** dari kegiatan-kegiatan yang masuk dalam periode laporan
- [ ] Pengguna (Sekretaris) dapat memilih foto mana yang akan disertakan dalam laporan saat proses generate
- [ ] Jika tidak ada pilihan manual, sistem menyertakan satu foto pertama dari setiap agenda sebagai default

---

## Entitas Data Terkait

Lihat [Model Data](../06-data-model.md) untuk skema lengkap.

| Entitas | Keterangan |
|---------|-----------|
| `DokumentasiKegiatan` | File foto/video yang terhubung dengan Agenda (path file, caption, tipe, relasi ke agenda) |
| `Agenda` | Induk dari setiap dokumentasi — dari [Modul Agenda & Absensi](./03a-agenda-absensi.md) |

---

## Modul yang Berintegrasi

| Modul | Jenis Integrasi |
|-------|----------------|
| [Agenda & Absensi](./03a-agenda-absensi.md) | **Wajib**: setiap dokumentasi harus dikaitkan ke satu agenda |
| [Laporan Bulanan](./03c-laporan-bulanan.md) | Foto kegiatan dapat disertakan otomatis dalam laporan |

---

## Catatan Implementasi

- **Penyimpanan:** Laravel Filesystem (lokal VPS); pertimbangkan object storage (S3-compatible) untuk masa depan jika volume dokumentasi besar
- **Kompresi otomatis:** Foto dikompresi otomatis saat upload untuk menghemat storage, dengan tetap menyimpan versi original
- **Batasan ukuran:** Upload foto maksimal 10MB per file; video maksimal 100MB (dapat dikonfigurasi)
- **Akses kontrol:** Pengguna hanya dapat mengelola dokumentasi untuk agenda di bidangnya; Superadmin dapat akses semua

---

> [← Jenjang Kaderisasi](./03g-jenjang-kaderisasi.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Notifikasi Terpusat →](./03i-notifikasi.md)
