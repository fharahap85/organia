# Modul 6.4 — Keuangan Kegiatan (OCR Struk)

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Laporan Bulanan](./03c-laporan-bulanan.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Data Kader & Keluarga →](./03e-kader-keluarga.md)

---

## Deskripsi

Modul pencatatan bukti pengeluaran kegiatan (struk/kwitansi) dengan bantuan **ekstraksi data otomatis berbasis OCR**, sebagai pengganti pencatatan manual yang rawan kehilangan bukti fisik. Setiap bukti pengeluaran terhubung langsung ke agenda/kegiatan terkait.

**Peran yang dapat mengakses:** Bendahara (full: input & verifikasi), Ketua (view), Superadmin (full)

> ⚠️ **Kebijakan Akses:** Bendahara **tidak memiliki akses** ke data anak kader atau data pribadi kader. Akses Bendahara dibatasi pada data kegiatan yang relevan dengan pengeluaran yang dicatatnya.

---

## Kebutuhan Fungsional

### F-01 · Upload Bukti Struk

- [ ] Bendahara dapat **mengunggah foto atau hasil pindai** struk/kwitansi langsung dari perangkat
- [ ] Mendukung format gambar: JPG, PNG, WEBP, PDF scan
- [ ] Foto asli **disimpan sebagai arsip permanen** meskipun datanya sudah diekstrak
- [ ] Struk dikaitkan dengan **agenda/kegiatan tertentu** saat diunggah

### F-02 · Ekstraksi Data Otomatis (OCR)

- [ ] Sistem melakukan ekstraksi otomatis menggunakan **Tesseract OCR (self-hosted)** untuk membaca:
  - Nominal transaksi
  - Tanggal transaksi
  - Nama vendor/toko
- [ ] Sebelum OCR, sistem melakukan **preprocessing gambar** (brightness, contrast, deskew) via Intervention Image untuk meningkatkan akurasi pembacaan
- [ ] Proses OCR berjalan di **background queue** agar tidak memblokir permintaan pengguna lain

### F-03 · Verifikasi & Edit Manual oleh Bendahara

- [ ] Hasil ekstraksi OCR ditampilkan dalam **form yang dapat diperiksa dan diedit** oleh Bendahara
- [ ] Bendahara wajib memeriksa dan mengkonfirmasi kebenaran data sebelum dapat menyimpan
- [ ] Bendahara dapat mengedit field yang tidak sesuai dengan struk asli

### F-04 · Low-Confidence Warning

- [ ] Sistem menampilkan **indikator keyakinan rendah (low-confidence warning)** apabila hasil ekstraksi OCR meragukan
  - Contoh: gambar buram, huruf terlalu kecil, struk pudar
- [ ] Field dengan keyakinan rendah ditandai secara visual (misalnya highlight kuning) agar Bendahara lebih teliti memeriksa field tersebut

### F-05 · Rekap Pengeluaran Per Kegiatan

- [ ] Setiap struk dikaitkan dengan agenda/kegiatan tertentu sehingga **total pengeluaran per kegiatan terekap otomatis**
- [ ] Bendahara dapat melihat ringkasan pengeluaran per agenda dan per periode

### F-06 · Ekspor PDF Gabungan

- [ ] Bendahara dapat mengekspor **seluruh bukti struk dalam satu periode** menjadi satu file **PDF gabungan**
- [ ] Setiap halaman PDF menyertakan:
  - Gambar struk asli
  - Keterangan: tanggal, nominal, nama vendor
  - Nama kegiatan yang terkait
- [ ] File PDF gabungan ini siap diserahkan ke pengurus pusat sebagai bukti pertanggungjawaban keuangan

---

## Entitas Data Terkait

Lihat [Model Data](../06-data-model.md) untuk skema lengkap.

| Entitas | Keterangan |
|---------|-----------|
| `Struk` | Bukti pengeluaran (file gambar, hasil ekstraksi OCR, status verifikasi, relasi ke Agenda) |
| `Agenda` | Kegiatan yang menjadi konteks pengeluaran (dari [Modul Agenda](./03a-agenda-absensi.md)) |

---

## Modul yang Berintegrasi

| Modul | Jenis Integrasi |
|-------|----------------|
| [Agenda & Absensi](./03a-agenda-absensi.md) | **Wajib**: setiap struk dikaitkan ke agenda tertentu |
| [Laporan Bulanan](./03c-laporan-bulanan.md) | Struk terverifikasi masuk ke ringkasan keuangan laporan |
| [Notifikasi Terpusat](./03i-notifikasi.md) | Pengingat ke Bendahara jika ada struk yang belum diverifikasi |

---

## Keputusan Teknis: Tesseract vs API Berbayar

| Aspek | Tesseract (Dipilih) | API Berbayar (Ditolak) |
|-------|--------------------|-----------------------|
| Biaya | Gratis, self-hosted | Per-request, bisa membengkak |
| Akurasi | Memadai dengan preprocessing | Lebih tinggi (model terlatih khusus struk) |
| Ketergantungan | Tidak ada (offline) | Bergantung layanan pihak ketiga |
| Kontrol data | Data tidak keluar server | Data dikirim ke server eksternal |

> Keputusan ini disepakati di [Lampiran — Keputusan Produk](../10-appendix.md). Mitigasi akurasi OCR rendah ada di [Risiko & Mitigasi](../08-metrics-risks.md).

---

## Catatan Implementasi

- **OCR Stack:** Tesseract + Intervention Image untuk preprocessing
- **Queue:** Proses OCR berjalan via [Laravel Queue](../05-architecture.md); Bendahara mendapat notifikasi saat hasil ekstraksi siap untuk diperiksa
- **Penyimpanan foto:** Laravel Filesystem (lokal VPS), tidak dihapus meski data sudah terverifikasi
- **Akurasi baseline:** Perlu diuji dengan sampel struk nyata; target akurasi nominal ≥ 80% pada kondisi foto jelas

---

> [← Laporan Bulanan](./03c-laporan-bulanan.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Data Kader & Keluarga →](./03e-kader-keluarga.md)
