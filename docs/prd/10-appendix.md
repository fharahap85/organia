# 10 — Lampiran

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Roadmap](./09-roadmap.md) | [← Index](../README.md)

---

## 14.1 Keputusan Produk yang Disepakati

Keputusan-keputusan berikut telah disepakati selama proses perencanaan produk dan **tidak perlu didiskusikan ulang** kecuali ada perubahan konteks yang signifikan.

### ❌ Fitur yang Dikecualikan dari v1.0

| Keputusan | Alasan | Referensi |
|-----------|--------|-----------|
| **Pengelolaan iuran/kas anggota tidak disertakan** | Ini satu-satunya modul yang sengaja dikecualikan dari saran awal. Kompleksitas fitur keuangan berbasis iuran memerlukan pertimbangan lebih matang (kebijakan denda, kategori iuran, dll) yang dapat memperlambat pengembangan inti | [Scope](../docs/prd/02-scope.md#52-di-luar-lingkup-out-of-scope--versi-10) |

### ✅ Modul Tambahan yang Disepakati Masuk v1.0

Seluruh modul tambahan yang disarankan **disepakati untuk dimasukkan** ke versi 1.0:

| Modul | Nilai yang Ditambahkan |
|-------|----------------------|
| [Jenjang Kaderisasi & Rapor Kader](./03-modules/03g-jenjang-kaderisasi.md) | Dari "sekedar data anggota" menjadi sistem pemantauan perkembangan kader |
| [Dokumentasi Kegiatan](./03-modules/03h-dokumentasi.md) | Laporan bulanan lebih informatif tanpa kerja tambahan |
| [Notifikasi Terpusat](./03-modules/03i-notifikasi.md) | Fitur proaktif yang membedakan Organia dari spreadsheet biasa |
| [Halaman Publik & Profil](./03-modules/03j-halaman-publik.md) | Transparansi organisasi & identitas digital yang bisa ditunjukkan ke stakeholder |
| [Struktur Organisasi & Periodisasi](./03-modules/03f-manajemen-pengguna.md) | Rekam jejak kepengurusan yang terjaga antar periode |

### ⚙️ Keputusan Teknis

| Keputusan | Alasan | Referensi |
|-----------|--------|-----------|
| **OCR menggunakan Tesseract self-hosted**, bukan API berbayar | Keberlanjutan biaya operasional jangka panjang; tidak ada biaya per-request yang membengkak seiring pertumbuhan pengguna | [Modul Keuangan](./03-modules/03d-keuangan.md#keputusan-teknis-tesseract-vs-api-berbayar) |
| **Stack: Laravel (API) + React TypeScript (SPA)** | Keseimbangan antara kecepatan pengembangan (Laravel sudah dikuasai) dan nilai jual portofolio (React + TypeScript, API-first) | [Arsitektur](./05-architecture.md) |
| **API-first architecture** | Mencerminkan praktik industri modern; backend dan frontend independen; API dapat dipakai ulang untuk mobile di masa depan | [Arsitektur](./05-architecture.md#81-pendekatan-arsitektur) |

---

## 14.2 Hal yang Perlu Didiskusikan Lebih Lanjut

Item-item berikut adalah **open questions** yang perlu diselesaikan sebelum atau selama pengembangan fase terkait.

### 🗄️ Database & Data

| Item | Konteks | Prioritas |
|------|---------|-----------|
| **Detail skema database final per entitas** (kolom, tipe data, relasi, indeks) | Dibutuhkan sebelum Fase 1 dimulai | 🔴 Tinggi |
| **Kebijakan enkripsi field sensitif** — field mana saja yang dienkripsi, algoritma apa | Data anak-anak memerlukan kejelasan ini | 🔴 Tinggi |
| **Strategi soft delete** — entitas mana yang soft-delete, mana yang hard-delete | Berpengaruh pada query dan tampilan histori | 🟡 Sedang |

### 🖥️ API & Frontend

| Item | Konteks | Prioritas |
|------|---------|-----------|
| **Desain API endpoint lengkap** (REST resource per modul) | Perlu disusun agar frontend dan backend dapat dikerjakan paralel | 🔴 Tinggi |
| **State management di frontend** — TanStack Query vs Zustand vs kombinasi | Berpengaruh pada arsitektur React SPA | 🟡 Sedang |
| **Wireframe/UI design untuk dashboard per peran** | Membantu keputusan komponen dan layout yang tepat | 🟡 Sedang |

### 🚀 Deployment & Infrastruktur

| Item | Konteks | Prioritas |
|------|---------|-----------|
| **Strategi deployment & domain untuk demo publik** | Diperlukan untuk Fase 5 | 🟢 Rendah |
| **Setup supervisord untuk queue worker** | Diperlukan sejak Fase 3 (OCR struk) | 🟡 Sedang |
| **Strategi backup database** — tool, frekuensi, lokasi backup | Lebih baik disusun sejak awal | 🟡 Sedang |

### 📱 Fitur Opsional

| Item | Konteks | Prioritas |
|------|---------|-----------|
| **Notifikasi WhatsApp** — pilihan penyedia API (Fonnte, Wablas, dll) | Diperlukan jika fitur WhatsApp notification diaktifkan di Fase 4 | 🟢 Rendah |
| **Format laporan bulanan** — template PDF yang diinginkan organisasi | Mempengaruhi implementasi generate PDF di Fase 3 | 🟡 Sedang |

---

## 14.3 Glosarium

| Istilah | Definisi |
|---------|---------|
| **RBAC** | Role-Based Access Control — sistem kontrol akses berdasarkan peran pengguna |
| **OCR** | Optical Character Recognition — teknologi pembacaan teks dari gambar |
| **SPA** | Single Page Application — aplikasi web yang berjalan di satu halaman dengan navigasi dinamis |
| **API-first** | Pendekatan di mana backend dirancang sebagai API yang dapat dikonsumsi berbagai klien |
| **Queue Worker** | Proses background yang menjalankan pekerjaan berat secara asinkron |
| **Kader** | Anggota aktif organisasi yang mengikuti proses kaderisasi |
| **Periodisasi** | Pembagian masa kepengurusan organisasi dalam periode tertentu (contoh: 2024–2027) |
| **BIPEKA** | Bidang Perempuan dan Ketahanan Keluarga — salah satu bidang dalam struktur organisasi |
| **Bulk generation** | Pembuatan banyak surat sekaligus untuk banyak penerima dalam satu proses |
| **Low-confidence warning** | Peringatan visual saat hasil OCR dianggap tidak yakin/meragukan |

---

> [← Roadmap](./09-roadmap.md) | [← Index](../README.md)

---

*PRD Organia v1.0 — Disusun oleh Abdullah Fikri Harahap · 30 Juni 2026*
