# 04 — Kebutuhan Non-Fungsional

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Modul Fungsional](./03-modules/03-modules-index.md) | [← Index](../README.md) | [Selanjutnya: Arsitektur & Stack →](./05-architecture.md)

---

## Ringkasan

Kebutuhan non-fungsional mendefinisikan **kualitas dan batasan** sistem Organia — bukan *apa* yang dilakukan sistem, melainkan *seberapa baik* sistem melakukannya. Kebutuhan ini berdampak pada seluruh modul dan harus dipertimbangkan dalam setiap keputusan arsitektur dan implementasi.

---

## 7.1 Keamanan & Privasi

**Prioritas: Sangat Tinggi** — sistem menyimpan data pribadi termasuk data anak-anak.

| Aspek | Kebutuhan | Implementasi |
|-------|-----------|--------------|
| Enkripsi data sensitif | Data pribadi kader dan anak wajib dienkripsi saat disimpan | Enkripsi di level aplikasi Laravel; sensitif field di-cast dengan `encrypted` |
| Kontrol akses | Akses dibatasi ketat sesuai peran (RBAC) | Middleware Laravel per endpoint; lihat [Peran & Akses](./01-users-and-roles.md) |
| Audit trail | Log aktivitas untuk keperluan audit | Catat siapa membuat/mengubah surat, struk, laporan, dan data kader |
| Autentikasi | Login aman dengan token | Laravel Sanctum (SPA token); bcrypt untuk password |
| Proteksi endpoint API | Tidak ada endpoint data privat yang dapat diakses tanpa autentikasi | Middleware `auth:sanctum` pada semua route privat |

Lihat juga kebijakan akses data sensitif di [Modul Data Kader & Keluarga](./03-modules/03e-kader-keluarga.md#f-06--kontrol-akses-data-keluarga).

---

## 7.2 Performa

**Konteks:** Sistem di-hosting di VPS milik sendiri dengan **resource terbatas**.

| Aspek | Kebutuhan |
|-------|-----------|
| Proses berat via queue | Proses OCR dan generate PDF berjalan di **background queue** agar tidak memblokir permintaan HTTP utama |
| Target response time | API endpoint standar (CRUD) ≤ 1 detik untuk penggunaan normal |
| Proses OCR | Tidak ada waktu maksimum ketat — user mendapat notifikasi saat selesai |
| Optimasi query | Hindari N+1 queries; gunakan Eager Loading di Laravel |
| Pagination | Daftar data panjang (kader, surat, struk) wajib dipaginasi |

Lihat [Arsitektur & Stack](./05-architecture.md) untuk detail implementasi background queue.

---

## 7.3 Ketersediaan (Availability)

| Aspek | Kebutuhan |
|-------|-----------|
| Target uptime | Wajar untuk skala organisasi kecil-menengah (**bukan** kebutuhan high-availability enterprise) |
| Toleransi downtime | Singkat (maintenance malam hari dapat diterima) |
| Backup data | Backup database harian otomatis ke lokasi terpisah |

---

## 7.4 Kompatibilitas

| Platform | Kebutuhan |
|----------|-----------|
| Desktop | Mendukung browser modern (Chrome, Firefox, Edge) |
| Mobile | Web **responsif** — terutama untuk: scan QR absensi & upload foto struk dari lapangan |
| Resolusi minimum | 360px lebar (smartphone standar) |
| Browser | Tidak perlu mendukung browser lama (IE11, dll) |

> Aplikasi mobile native (iOS/Android) **tidak termasuk** scope v1.0. Lihat [Scope](./02-scope.md#52-di-luar-lingkup-out-of-scope--versi-10).

---

## 7.5 Skalabilitas Biaya

| Komponen | Pendekatan |
|----------|-----------|
| OCR | Tesseract self-hosted — **gratis**, tidak ada biaya per-request |
| PDF generate | DomPDF/Spatie — **gratis**, library open source |
| Notifikasi WhatsApp | API pihak ketiga berbayar, tapi **opsional** dan dikendalikan pengguna |
| Storage | Lokal VPS — biaya tetap, tidak bergantung volume file |
| Database | PostgreSQL self-hosted — **gratis** |

> Keputusan memilih Tesseract vs API OCR berbayar didokumentasikan di [Modul Keuangan](./03-modules/03d-keuangan.md#keputusan-teknis-tesseract-vs-api-berbayar) dan [Lampiran](./10-appendix.md).

---

## 7.6 Auditabilitas

Setiap aksi penting dalam sistem harus meninggalkan jejak yang dapat ditelusuri:

| Entitas | Yang Dicatat |
|---------|-------------|
| Surat | Siapa membuat, kapan, nomor berapa, siapa approve |
| Struk | Siapa upload, kapan, hasil OCR awal vs data final yang diverifikasi |
| Laporan | Siapa generate, kapan, periode apa |
| Data kader/anak | Siapa mengakses, kapan (audit log akses data sensitif) |
| Pengguna & peran | Siapa Superadmin yang mengubah, kapan, dari peran apa ke apa |

---

## 7.7 Maintainability (untuk Solo Developer)

| Aspek | Pendekatan |
|-------|-----------|
| Kode | Ikuti konvensi Laravel & React best practices; komentar pada logika kompleks |
| API | REST API yang terdokumentasi (minimal via Postman collection atau OpenAPI) |
| Deployment | Setup sederhana yang dapat dijalankan seorang diri |
| Testing | Unit test untuk logika kritis (kalkulasi estimasi pendidikan, OCR pipeline) |

---

> [← Modul Fungsional](./03-modules/03-modules-index.md) | [← Index](../README.md) | [Selanjutnya: Arsitektur & Stack →](./05-architecture.md)
