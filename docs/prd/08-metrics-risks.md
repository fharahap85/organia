# 08 — Metrik Keberhasilan & Risiko

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← User Flow](./07-user-flows.md) | [← Index](../README.md) | [Selanjutnya: Roadmap →](./09-roadmap.md)

---

## 11. Metrik Keberhasilan

Metrik berikut digunakan untuk mengevaluasi apakah Organia berhasil memecahkan masalah yang diidentifikasi di [Latar Belakang](./00-overview.md#2-latar-belakang--masalah).

| Metrik | Target Indikatif | Cara Ukur |
|--------|-----------------|-----------|
| **Waktu penyusunan laporan bulanan** | Berkurang signifikan dibanding proses manual sebelumnya | Perbandingan waktu sebelum & sesudah adopsi |
| **Tingkat penggunaan QR absensi** | Mayoritas agenda organisasi menggunakan absensi digital | % agenda yang menggunakan [QR absensi](./03-modules/03a-agenda-absensi.md) |
| **Kelengkapan arsip struk** | Bukti pengeluaran tidak ada yang hilang karena tersimpan digital sejak awal | % pengeluaran kegiatan yang memiliki struk terupload di [Modul Keuangan](./03-modules/03d-keuangan.md) |
| **Akurasi data pendidikan anak** | Notifikasi terkirim sesuai waktu tanpa keterlambatan pencatatan | Ketepatan waktu notifikasi vs. data aktual di [Data Kader](./03-modules/03e-kader-keluarga.md) |
| **Adopsi pengguna per peran** | Seluruh peran (Ketua s.d. BIPEKA) aktif menggunakan modul masing-masing | Login aktif per peran dalam 30 hari terakhir |

---

## 12. Risiko & Mitigasi

### Analisis Risiko

| # | Risiko | Dampak | Kemungkinan | Mitigasi |
|---|--------|--------|-------------|---------|
| **R-01** | Akurasi OCR rendah pada struk buram/pudar | Data keuangan tidak akurat, merugikan pertanggungjawaban keuangan | Sedang-Tinggi | • Verifikasi manual **wajib** sebelum data disimpan <br>• Indikator low-confidence visual <br>• Preprocessing gambar (brightness, contrast, deskew) <br>• Foto asli selalu tersimpan sebagai referensi |
| **R-02** | Kebocoran data pribadi kader/anak | Pelanggaran privasi, hilangnya kepercayaan anggota | Rendah (jika dikelola baik) | • RBAC ketat per modul (lihat [Pengguna & Peran](./01-users-and-roles.md)) <br>• Enkripsi data sensitif at-rest <br>• Log akses untuk data keluarga <br>• Audit trail semua perubahan |
| **R-03** | Resource VPS terbatas saat proses OCR/PDF massal | Sistem lambat atau down saat beban tinggi | Sedang | • Proses berat dijalankan via **queue worker**, bukan permintaan langsung <br>• Queue berjalan di background, tidak memblokir API response <br>• Dapat ditingkatkan ke Redis queue driver bila diperlukan |
| **R-04** | Waktu pengembangan solo developer terbatas | Proyek molor dari target 3–6 bulan | Tinggi | • Prioritaskan modul inti dahulu sesuai [Roadmap 5 Fase](./09-roadmap.md) <br>• Fase 1–2 fokus pada fitur yang paling dibutuhkan (agenda, absensi, surat) <br>• Modul lanjutan (keuangan, kader, notifikasi) dikerjakan setelah fondasi stabil |

---

## Pemantauan Risiko

Risiko dievaluasi ulang di setiap akhir fase pengembangan ([Roadmap](./09-roadmap.md)):

| Fase | Risiko yang Dievaluasi |
|------|----------------------|
| Akhir Fase 1 | R-04 (apakah timeline masih realistis?) |
| Akhir Fase 2 | R-04, R-02 (apakah RBAC sudah cukup ketat?) |
| Akhir Fase 3 | R-01 (seberapa akurat OCR dengan struk nyata?), R-03 (apakah VPS cukup?) |
| Akhir Fase 4 | R-02 (data kader sensitif sudah terproteksi?), R-04 |
| Akhir Fase 5 | Semua risiko — evaluasi akhir sebelum demo publik |

---

> [← User Flow](./07-user-flows.md) | [← Index](../README.md) | [Selanjutnya: Roadmap →](./09-roadmap.md)
