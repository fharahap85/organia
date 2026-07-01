# Modul 6.3 — Laporan Akhir Bulan

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Surat-Menyurat](./03b-surat-menyurat.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Keuangan Kegiatan →](./03d-keuangan.md)

---

## Deskripsi

Modul yang menghasilkan **laporan bulanan secara otomatis** berdasarkan rekap seluruh agenda dan kegiatan yang telah dilaksanakan dalam periode tersebut. Tidak perlu lagi menyusun laporan dari awal setiap bulan.

**Peran yang dapat mengakses:** Ketua (view + approval), Sekretaris (generate + view), Superadmin (full)

---

## Kebutuhan Fungsional

### F-01 · Auto-Generate Laporan Bulanan

- [ ] Sistem secara otomatis merangkum **seluruh agenda/kegiatan** dalam rentang bulan yang dipilih, meliputi:
  - Daftar kegiatan yang dilaksanakan (judul, tanggal, lokasi, bidang)
  - Jumlah total kehadiran per kegiatan
  - Dokumentasi terkait (cuplikan foto dari [Modul Dokumentasi](./03h-dokumentasi.md))
- [ ] Pengguna memilih bulan dan tahun laporan; sistem memproses data otomatis

### F-02 · Laporan Per Bidang & Laporan Gabungan

- [ ] Laporan dapat digenerate dalam dua mode:
  1. **Per bidang:** Laporan khusus untuk satu bidang (Kaderisasi, BIPEKA, dll) — dapat dibuat oleh masing-masing bidang
  2. **Gabungan:** Laporan komprehensif lintas semua bidang — untuk Ketua/Superadmin
- [ ] Sekretaris dapat men-generate laporan gabungan atas permintaan Ketua

### F-03 · Ringkasan Keuangan Kegiatan

- [ ] Laporan menyertakan **ringkasan keuangan** (rekap struk yang telah diverifikasi Bendahara) bila relevan dengan kegiatan di periode tersebut
- [ ] Data keuangan diambil dari [Modul Keuangan Kegiatan](./03d-keuangan.md) yang sudah terverifikasi
- [ ] Struk yang belum diverifikasi Bendahara **tidak ikut terekap** dalam laporan

### F-04 · Ekspor PDF Siap Kirim

- [ ] Laporan dapat diunduh dalam format **PDF** siap dikirim ke pengurus pusat/wilayah
- [ ] Format PDF mengikuti kop surat dan format standar organisasi
- [ ] Generate PDF diproses via background queue

### F-05 · Histori Laporan

- [ ] Pengguna dapat melihat dan mengunduh laporan dari **bulan-bulan sebelumnya** tanpa perlu menyusun ulang
- [ ] Laporan yang sudah digenerate disimpan sebagai file PDF permanen di arsip

---

## Entitas Data Terkait

Lihat [Model Data](../06-data-model.md) untuk skema lengkap.

| Entitas | Keterangan |
|---------|-----------|
| `LaporanBulanan` | Hasil generate laporan per periode dan bidang |
| `Agenda` | Sumber data kegiatan (dari [Modul Agenda](./03a-agenda-absensi.md)) |
| `Struk` | Sumber data keuangan terverifikasi (dari [Modul Keuangan](./03d-keuangan.md)) |
| `DokumentasiKegiatan` | Cuplikan foto yang disertakan (dari [Modul Dokumentasi](./03h-dokumentasi.md)) |

---

## Modul yang Berintegrasi

| Modul | Jenis Integrasi |
|-------|----------------|
| [Agenda & Absensi](./03a-agenda-absensi.md) | **Sumber utama** data kegiatan dan kehadiran |
| [Keuangan Kegiatan](./03d-keuangan.md) | Ringkasan struk terverifikasi disertakan dalam laporan |
| [Dokumentasi Kegiatan](./03h-dokumentasi.md) | Cuplikan foto kegiatan disertakan otomatis |

---

## Catatan Implementasi

- **Trigger generate:** Manual oleh Sekretaris/Superadmin; tidak auto-generate setiap akhir bulan (untuk menghindari laporan tidak akurat jika data belum lengkap)
- **Kondisi keuangan:** Laporan menyertakan disclaimer jika ada struk yang belum diverifikasi Bendahara di periode tersebut
- **Generate PDF:** Diproses via [Laravel Queue](../05-architecture.md); Sekretaris mendapat notifikasi saat PDF selesai

---

> [← Surat-Menyurat](./03b-surat-menyurat.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Keuangan Kegiatan →](./03d-keuangan.md)
