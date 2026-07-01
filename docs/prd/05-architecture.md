# 05 — Arsitektur & Stack Teknologi

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Non-Fungsional](./04-non-functional.md) | [← Index](../README.md) | [Selanjutnya: Model Data →](./06-data-model.md)

---

## 8.1 Pendekatan Arsitektur

Organia dibangun dengan pendekatan **API-first**:

> Backend menyediakan **REST API** yang dikonsumsi oleh **frontend SPA** terpisah. Backend dan frontend dapat dikembangkan, diuji, dan di-deploy secara independen.

### Alasan Pemilihan

| Pertimbangan | Penjelasan |
|---|---|
| **Arsitektur modern** | Mencerminkan praktik industri saat ini (microservices-ready, separation of concerns) |
| **Nilai portofolio** | Menunjukkan kemampuan merancang sistem dengan API yang terstruktur dan SPA frontend |
| **Fleksibilitas masa depan** | API yang sama dapat digunakan oleh mobile app di masa mendatang |
| **Developer experience** | Frontend dan backend dapat dikerjakan secara lebih mandiri |

---

## 8.2 Stack Teknologi

### Backend

| Komponen | Pilihan | Keterangan |
|----------|---------|-----------|
| **Framework** | **Laravel** | REST API only; dipilih karena sudah dikuasai developer, ekosistem lengkap |
| **Autentikasi** | **Laravel Sanctum** | Token-based auth untuk SPA; lebih ringan dari Passport |
| **Database** | **PostgreSQL** | Relasional; dipilih karena lebih robust untuk data kompleks dibanding MySQL |
| **Background Job** | **Laravel Queue** (database driver) | Untuk proses OCR, generate PDF, kirim notifikasi; dapat ditingkatkan ke Redis bila diperlukan |
| **Scheduled Tasks** | **Laravel Scheduler** | Untuk cek estimasi jenjang pendidikan anak, kirim pengingat agenda |

### Frontend

| Komponen | Pilihan | Keterangan |
|----------|---------|-----------|
| **Framework** | **React + TypeScript** | SPA terpisah dari backend; TypeScript untuk type safety dan nilai portofolio |
| **Build Tool** | Vite | Lebih cepat dari CRA; standar modern |
| **State Management** | TBD (TanStack Query / Zustand) | Untuk caching API response dan state global |

### Pemrosesan Dokumen

| Komponen | Pilihan | Keterangan |
|----------|---------|-----------|
| **OCR Struk** | **Tesseract OCR** (self-hosted) | Gratis, tidak ada biaya per-request; lihat keputusan di [Keuangan Kegiatan](./03-modules/03d-keuangan.md) |
| **Image Preprocessing** | **Intervention Image** (Laravel) | Brightness, contrast, deskew sebelum OCR untuk meningkatkan akurasi |
| **Generate PDF** | **Spatie Laravel PDF / DomPDF** | Untuk surat, laporan bulanan, ekspor struk gabungan |
| **Generate QR Code** | **Simple QR Code** (Laravel) | Untuk QR absensi per agenda |

### Infrastruktur

| Komponen | Pilihan | Keterangan |
|----------|---------|-----------|
| **Hosting** | **VPS milik sendiri** | Resource terbatas → proses berat wajib via queue worker |
| **Penyimpanan File** | **Laravel Filesystem** (lokal/VPS) | Untuk foto struk, dokumentasi kegiatan, file PDF; opsi migrasi ke object storage di masa depan |
| **Web Server** | Nginx + PHP-FPM | Standar untuk Laravel di VPS |

---

## 8.3 Diagram Arsitektur Tinggi

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                       │
│  ┌──────────────────────┐  ┌───────────────────────┐ │
│  │   React SPA (Admin)  │  │  Browser (QR Absensi) │ │
│  │   TypeScript + Vite  │  │  (tanpa login)        │ │
│  └──────────┬───────────┘  └──────────┬────────────┘ │
└─────────────┼──────────────────────────┼─────────────┘
              │ HTTPS / REST API         │ HTTPS
┌─────────────▼──────────────────────────▼─────────────┐
│                  BACKEND (Laravel)                    │
│  ┌────────────────────┐  ┌──────────────────────────┐ │
│  │  REST API Endpoints│  │   Laravel Scheduler      │ │
│  │  (Sanctum Auth)    │  │  (cron: cek pendidikan,  │ │
│  └────────┬───────────┘  │   pengingat agenda)      │ │
│           │              └──────────────┬────────────┘ │
│  ┌────────▼───────────────────────────▼────────────┐  │
│  │              Laravel Queue Worker                │  │
│  │  OCR Struk | Generate PDF | Kirim Notifikasi     │  │
│  └────────┬──────────────────────────┬─────────────┘  │
└───────────┼──────────────────────────┼────────────────┘
            │                          │
┌───────────▼──────┐       ┌───────────▼──────────────┐
│   PostgreSQL DB  │       │   Local Filesystem (VPS)  │
│                  │       │   Foto struk, PDF, QR,    │
│                  │       │   Dokumentasi kegiatan    │
└──────────────────┘       └──────────────────────────┘
```

---

## 8.4 Pertimbangan Deployment

- **VPS tunggal:** Backend Laravel + Queue Worker + PostgreSQL + Nginx dijalankan pada satu VPS
- **Frontend:** Dapat di-serve dari VPS yang sama (sebagai static files via Nginx) atau dari CDN/hosting terpisah
- **Queue worker:** Dijalankan sebagai daemon (supervisord) agar restart otomatis jika crash
- **Backup:** Cron job harian untuk backup PostgreSQL ke lokasi terpisah

---

## Keterkaitan dengan Dokumen Lain

- [Kebutuhan Non-Fungsional](./04-non-functional.md) — justifikasi keputusan queue untuk performa
- [Model Data](./06-data-model.md) — skema database PostgreSQL
- [Modul Keuangan](./03-modules/03d-keuangan.md) — detail OCR Tesseract
- [Modul Surat-Menyurat](./03-modules/03b-surat-menyurat.md) — detail generate PDF

---

> [← Non-Fungsional](./04-non-functional.md) | [← Index](../README.md) | [Selanjutnya: Model Data →](./06-data-model.md)
