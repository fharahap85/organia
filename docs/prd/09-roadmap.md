# 09 — Roadmap Pengembangan

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Metrik & Risiko](./08-metrics-risks.md) | [← Index](../README.md) | [Selanjutnya: Lampiran →](./10-appendix.md)

---

## Konteks

Roadmap indikatif untuk **3–6 bulan pengembangan** yang dikerjakan secara konsisten paruh waktu oleh satu developer (solo). Pengembangan diprioritaskan dari modul paling inti (fondasi) hingga modul lanjutan.

---

## Peta 5 Fase

```
Bulan 1     Bulan 2     Bulan 3     Bulan 4     Bulan 5     Bulan 6
│───────────│───────────│───────────│───────────│───────────│
│  Fase 1   │  Fase 2   │  Fase 3   │  Fase 4   │  Fase 5   │
│ Fondasi   │  Surat &  │ Keuangan  │  Kader &  │  Publik & │
│ & Agenda  │  Dokumen  │ & Laporan │  Notif    │  Polish   │
│───────────│───────────│───────────│───────────│───────────│
```

---

## Detail Per Fase

### 🏗️ Fase 1 — Fondasi (Bulan 1–2)

**Fokus:** Autentikasi, RBAC, struktur organisasi/periodisasi, modul Agenda & Absensi QR

| Deliverable | Modul |
|------------|-------|
| Setup project: Laravel API + React SPA | [Arsitektur](./05-architecture.md) |
| Autentikasi (login, logout, token) | [Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md) |
| RBAC: roles, permissions, middleware | [Pengguna & Peran](./01-users-and-roles.md) |
| Manajemen pengguna & periodisasi | [Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md) |
| Struktur organisasi per periode | [Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md) |
| Modul Agenda (CRUD + QR absensi) | [Agenda & Absensi](./03-modules/03a-agenda-absensi.md) |
| Template kolom absensi kustom | [Agenda & Absensi](./03-modules/03a-agenda-absensi.md) |
| Pengisian absensi publik (tanpa login) | [Agenda & Absensi](./03-modules/03a-agenda-absensi.md) |

**Output:** Backend API + Frontend dasar berjalan; agenda & absensi fungsional end-to-end

---

### ✉️ Fase 2 — Surat-Menyurat & Dokumentasi (Bulan 2–3)

**Fokus:** Modul Surat (bulk, TTD digital, arsip) & Dokumentasi Kegiatan

| Deliverable | Modul |
|------------|-------|
| Template surat & placeholder dinamis | [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |
| Bulk letter generation (generate massal) | [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |
| Penomoran surat otomatis | [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |
| Tanda tangan digital & ekspor PDF | [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |
| Arsip surat masuk & keluar + disposisi | [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |
| Upload & galeri dokumentasi per agenda | [Dokumentasi Kegiatan](./03-modules/03h-dokumentasi.md) |

**Output:** Surat dapat digenerate massal & diarsipkan; galeri dokumentasi per agenda berjalan

---

### 💰 Fase 3 — Keuangan & Laporan (Bulan 3–4)

**Fokus:** Modul Keuangan Kegiatan (OCR struk) & Laporan Bulanan

| Deliverable | Modul |
|------------|-------|
| Upload struk + integrasi OCR Tesseract | [Keuangan Kegiatan](./03-modules/03d-keuangan.md) |
| Preprocessing gambar (Intervention Image) | [Keuangan Kegiatan](./03-modules/03d-keuangan.md) |
| Form verifikasi + low-confidence warning | [Keuangan Kegiatan](./03-modules/03d-keuangan.md) |
| Ekspor PDF gabungan struk per periode | [Keuangan Kegiatan](./03-modules/03d-keuangan.md) |
| Auto-generate laporan bulanan (PDF) | [Laporan Bulanan](./03-modules/03c-laporan-bulanan.md) |
| Laporan per bidang & gabungan | [Laporan Bulanan](./03-modules/03c-laporan-bulanan.md) |
| Histori laporan bulan sebelumnya | [Laporan Bulanan](./03-modules/03c-laporan-bulanan.md) |

**Output:** Struk dapat diunggah & diverifikasi; laporan otomatis tergenerate

---

### 🎓 Fase 4 — Kader, Kaderisasi & Notifikasi (Bulan 4–5)

**Fokus:** Modul Data Kader & Keluarga, Jenjang Kaderisasi/Rapor Kader, Notifikasi Terpusat

| Deliverable | Modul |
|------------|-------|
| Input profil kader & data keluarga | [Data Kader & Keluarga](./03-modules/03e-kader-keluarga.md) |
| Data anak & riwayat pendidikan | [Data Kader & Keluarga](./03-modules/03e-kader-keluarga.md) |
| Estimasi otomatis jenjang pendidikan | [Data Kader & Keluarga](./03-modules/03e-kader-keluarga.md) |
| Definisi jenjang kaderisasi & syarat | [Jenjang Kaderisasi](./03-modules/03g-jenjang-kaderisasi.md) |
| Riwayat pelatihan & rapor kader | [Jenjang Kaderisasi](./03-modules/03g-jenjang-kaderisasi.md) |
| In-app notification (bell + histori) | [Notifikasi Terpusat](./03-modules/03i-notifikasi.md) |
| Notif jenjang pendidikan anak | [Notifikasi Terpusat](./03-modules/03i-notifikasi.md) |
| Notif pengingat agenda, struk, surat masuk | [Notifikasi Terpusat](./03-modules/03i-notifikasi.md) |
| Opsional: WhatsApp/email notification | [Notifikasi Terpusat](./03-modules/03i-notifikasi.md) |

**Output:** Data kader lengkap, rapor kader tersedia, notifikasi berjalan otomatis

---

### 🌐 Fase 5 — Halaman Publik & Finalisasi (Bulan 5–6)

**Fokus:** Halaman Publik, penyempurnaan UX, dokumentasi portofolio, deploy demo publik

| Deliverable | Modul |
|------------|-------|
| Halaman publik: profil & visi-misi | [Halaman Publik](./03-modules/03j-halaman-publik.md) |
| Struktur kepengurusan di halaman publik | [Halaman Publik](./03-modules/03j-halaman-publik.md) |
| Kalender agenda publik | [Halaman Publik](./03-modules/03j-halaman-publik.md) |
| Polish UI/UX seluruh modul | — |
| Testing & bug fixing komprehensif | — |
| Dokumentasi API (Postman/OpenAPI) | [Arsitektur](./05-architecture.md) |
| README portofolio & studi kasus | — |
| Deploy demo live ke domain publik | [Arsitektur](./05-architecture.md) |

**Output:** Profil organisasi publik aktif; studi kasus, README, demo live siap dipresentasikan

---

## Prioritas Jika Waktu Terbatas

Jika deadline maju atau waktu lebih terbatas dari ekspektasi, urutan pengurangan scope:

1. ✅ **Wajib selesai:** Fase 1 + Fase 2 (fondasi, agenda, surat)
2. 🔶 **Sebaiknya selesai:** Fase 3 (keuangan & laporan)
3. 🟡 **Dapat ditunda:** Fase 4 (kader & notifikasi) — bisa MVP dulu tanpa rapor kader
4. 🟢 **Opsional:** Fase 5 (halaman publik) — dapat di-skip untuk portofolio internal

---

> [← Metrik & Risiko](./08-metrics-risks.md) | [← Index](../README.md) | [Selanjutnya: Lampiran →](./10-appendix.md)
