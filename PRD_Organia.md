# ORGANIA

## Sistem Informasi Manajemen Organisasi & Kaderisasi

| Field | Detail |
|-------|--------|
| Nama Produk | Organia (working title) |
| Jenis Dokumen | Product Requirements Document (PRD) |
| Versi | 1.0 |
| Tanggal | 30 Juni 2026 |
| Disusun oleh | Abdullah Fikri Harahap |
| Status | Draft awal — untuk pengembangan & portfolio |

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Latar Belakang & Masalah](#2-latar-belakang--masalah)
3. [Tujuan Produk](#3-tujuan-produk)
4. [Target Pengguna & Peran (Role)](#4-target-pengguna--peran-role)
5. [Lingkup Produk (Scope)](#5-lingkup-produk-scope)
6. [Modul & Kebutuhan Fungsional (10 modul)](#6-modul--kebutuhan-fungsional)
7. [Kebutuhan Non-Fungsional](#7-kebutuhan-non-fungsional)
8. [Arsitektur & Stack Teknologi](#8-arsitektur--stack-teknologi)
9. [Model Data (Entitas Utama)](#9-model-data-entitas-utama)
10. [Alur Pengguna Utama (User Flow)](#10-alur-pengguna-utama-user-flow)
11. [Metrik Keberhasilan](#11-metrik-keberhasilan)
12. [Risiko & Mitigasi](#12-risiko--mitigasi)
13. [Roadmap Pengembangan](#13-roadmap-pengembangan)
14. [Lampiran](#14-lampiran)

---

## 1. Ringkasan Eksekutif

Organia adalah sistem informasi manajemen organisasi berbasis web yang dirancang untuk membantu organisasi kemasyarakatan, ormas, atau organisasi kader (seperti organisasi sayap, yayasan, atau lembaga sejenis) mengelola operasional administratifnya secara digital — mulai dari penjadwalan agenda dan absensi berbasis QR code, pembuatan surat massal dengan tanda tangan digital, pelaporan kegiatan bulanan otomatis, hingga pendataan kader beserta keluarganya dengan notifikasi jenjang pendidikan anak.

Produk ini dibangun untuk dua tujuan sekaligus: menyelesaikan masalah administratif nyata yang dihadapi pengurus organisasi (yang umumnya masih bekerja manual lewat WhatsApp, Excel, dan dokumen Word terpisah), dan menjadi portofolio teknis yang menunjukkan kemampuan pengembangan full-stack, desain sistem multi-peran (role-based access control), serta integrasi pemrosesan dokumen berbasis OCR.

## 2. Latar Belakang & Masalah

Organisasi kemasyarakatan dan organisasi kader pada umumnya menjalankan administrasi secara manual dan tersebar di berbagai alat yang tidak saling terhubung, sehingga menimbulkan beberapa masalah berikut:

- **Absensi rapat/kegiatan** masih dicatat manual di kertas atau Google Form sederhana yang tidak terhubung dengan data agenda dan tidak fleksibel formatnya.
- **Pembuatan surat** (undangan, surat tugas, surat keputusan) dilakukan satu per satu secara manual di Word, rawan kesalahan format dan penomoran, serta sulit diarsipkan secara rapi.
- **Laporan bulanan** ke pengurus pusat/wilayah disusun ulang dari awal setiap bulan karena data kegiatan tidak otomatis terekap.
- **Bukti pengeluaran** (struk/kwitansi) kegiatan sering hilang atau rusak sebelum sempat direkap, padahal wajib diserahkan sebagai bukti fisik ke pengurus pusat.
- **Data kader dan keluarganya** (termasuk jenjang pendidikan anak) tidak tercatat secara terpusat, sehingga organisasi kehilangan momentum untuk memberi perhatian atau program pada momen penting seperti anak kader masuk SD, SMP, SMA, atau kuliah.
- **Hak akses informasi** tidak terstruktur — semua pengurus sering mengakses dokumen yang sama tanpa pembedaan kewenangan sesuai jabatan.

## 3. Tujuan Produk

### 3.1 Tujuan Bisnis/Organisasi

- Mendigitalkan proses administrasi inti organisasi (agenda, absensi, surat, laporan) dalam satu platform terpadu.
- Mengurangi waktu pengurus dalam menyusun laporan bulanan dan surat-menyurat secara manual.
- Menyediakan basis data kader dan keluarga yang akurat dan dapat dipantau dari waktu ke waktu, termasuk notifikasi jenjang pendidikan anak kader.
- Menyediakan arsip digital yang rapi untuk kebutuhan audit dan pelaporan ke pengurus pusat.

### 3.2 Tujuan Personal (Portofolio)

- Menunjukkan kemampuan merancang sistem multi-role dengan kebutuhan akses yang berlapis dan sensitif (data pribadi anggota dan keluarga).
- Menunjukkan kemampuan integrasi pemrosesan dokumen (OCR) dengan pertimbangan biaya operasional yang realistis.
- Menghasilkan studi kasus produk nyata yang dapat dipresentasikan dalam proses rekrutmen kerja remote.

## 4. Target Pengguna & Peran (Role)

Sistem menggunakan kontrol akses berbasis peran (role-based access control). Setiap peran memiliki kewenangan dan tampilan dashboard yang berbeda sesuai tanggung jawabnya.

| Peran | Tanggung Jawab Utama | Akses Khusus |
|-------|---------------------|--------------|
| **Superadmin** | Mengelola seluruh sistem, pengguna, dan pengaturan organisasi | Akses penuh ke semua modul, manajemen pengguna & periode kepengurusan |
| **Ketua** | Mengawasi seluruh kegiatan dan menyetujui surat/laporan penting | Lihat semua modul, approval surat & laporan, lihat ringkasan lintas bidang |
| **Sekretaris** | Mengelola agenda, surat-menyurat, dan arsip | Modul agenda, absensi, surat (buat & kelola), arsip surat masuk/keluar |
| **Bendahara** | Mengelola pencatatan pengeluaran kegiatan & bukti struk | Modul keuangan kegiatan: input & verifikasi struk, laporan keuangan per kegiatan |
| **Kaderisasi** | Mengelola data kader dan jenjang pelatihan | Modul data kader, riwayat pelatihan, notifikasi pendidikan anak (lihat & kelola) |
| **BIPEKA** | Mengelola kegiatan & data terkait perempuan dan ketahanan keluarga | Modul agenda khusus bidang BIPEKA, data keluarga kader (akses terbatas sesuai relevansi) |

> **Catatan kebijakan akses:** Karena sistem menyimpan data pribadi termasuk data anak-anak, setiap peran hanya dapat mengakses data yang relevan dengan tanggung jawabnya. Bendahara, misalnya, tidak memiliki akses ke data anak kader, namun tetap dapat melihat data kegiatan yang relevan dengan pengeluaran yang dicatatnya.

## 5. Lingkup Produk (Scope)

### 5.1 Termasuk dalam Lingkup (In Scope) — Versi 1.0

- Manajemen agenda/kegiatan organisasi dengan format kolom absensi yang dapat disesuaikan.
- Generate QR code untuk absensi yang dapat dibagikan dan diisi peserta secara mandiri.
- Pembuatan surat secara massal (bulk) dengan opsi tanda tangan digital atau dikosongkan untuk ditandatangani manual.
- Penomoran surat otomatis dan pengarsipan surat masuk/keluar.
- Laporan akhir bulan otomatis berdasarkan rekap agenda dan kegiatan yang telah dilaksanakan.
- Modul keuangan kegiatan: input bukti struk/kwitansi dengan ekstraksi data otomatis berbasis OCR, verifikasi & edit manual sebelum disimpan, dan ekspor bukti dalam bentuk PDF gabungan.
- Manajemen data kader dan anggota keluarga, dengan notifikasi otomatis saat anak kader memasuki jenjang pendidikan baru (SD/SMP/SMA/Kuliah).
- Kontrol akses berbasis peran (Superadmin, Ketua, Sekretaris, Bendahara, Kaderisasi, BIPEKA).

### 5.2 Di Luar Lingkup (Out of Scope) — Versi 1.0

- Pengelolaan iuran/kas anggota (sengaja tidak disertakan pada versi awal sesuai keputusan produk).
- Aplikasi mobile native (versi awal berbasis web responsif).
- Integrasi pembayaran online.
- Multi-tenant penuh untuk banyak organisasi berbeda (dipertimbangkan untuk versi mendatang sebagai potensi model SaaS).

## 6. Modul & Kebutuhan Fungsional

### 6.1 Modul Agenda & Absensi

**Deskripsi:** Modul untuk membuat agenda rapat atau kegiatan apa pun, lengkap dengan QR code absensi yang formatnya dapat disesuaikan sesuai kebutuhan kegiatan.

**Kebutuhan Fungsional:**

- Pengguna (Sekretaris/Ketua/Superadmin) dapat membuat agenda baru dengan judul, deskripsi, tanggal, waktu, lokasi, dan bidang penyelenggara.
- Pengguna dapat menentukan kolom data absensi secara bebas (contoh: nama, jabatan, nomor HP, asal cabang, atau kolom kustom lain sesuai kebutuhan kegiatan).
- Pengguna dapat menyimpan susunan kolom sebagai template untuk dipakai ulang pada kegiatan serupa.
- Sistem menghasilkan QR code unik per agenda yang dapat dibagikan melalui tautan atau gambar.
- Peserta mengisi form absensi melalui pemindaian QR tanpa perlu login/akun.
- QR code dapat diberi masa berlaku (aktif hanya pada rentang waktu kegiatan).
- Sekretaris dapat menambahkan absensi susulan secara manual dengan catatan alasan.
- Sistem menampilkan rekap kehadiran per agenda secara real-time dan dapat diunduh sebagai file Excel/PDF.

### 6.2 Modul Surat-Menyurat (Bulk & Tanda Tangan Digital)

**Deskripsi:** Modul untuk membuat surat secara massal dari template, dengan opsi tanda tangan digital otomatis atau dibiarkan kosong untuk ditandatangani secara fisik.

**Kebutuhan Fungsional:**

- Pengguna dapat membuat template surat (undangan, surat tugas, surat keputusan, surat keterangan, dll) dengan placeholder data dinamis.
- Pengguna dapat membuat surat secara massal dengan mengisi/mengimpor daftar penerima sekaligus (contoh: 30 surat undangan untuk 30 kader berbeda dalam satu proses).
- Sistem memberikan nomor surat otomatis sesuai format penomoran organisasi yang dapat dikonfigurasi (nomor urut/kode bidang/bulan/tahun).
- Pengguna dapat memilih opsi tanda tangan digital (gambar tanda tangan tersimpan milik pejabat berwenang) atau membiarkan kolom tanda tangan kosong untuk dicetak dan ditandatangani manual.
- Seluruh surat yang dibuat otomatis tersimpan dalam arsip surat keluar, dapat dicari berdasarkan nomor, tanggal, jenis, atau penerima.
- Modul pencatatan surat masuk dengan disposisi ke bidang terkait dan status tindak lanjut.
- Surat dapat diunduh dalam format PDF, siap cetak atau kirim digital.

### 6.3 Modul Laporan Akhir Bulan

**Deskripsi:** Modul yang menghasilkan laporan bulanan secara otomatis berdasarkan rekap seluruh agenda dan kegiatan yang telah dilaksanakan dalam periode tersebut.

**Kebutuhan Fungsional:**

- Sistem secara otomatis merangkum seluruh agenda/kegiatan dalam rentang bulan yang dipilih, termasuk jumlah kehadiran dan dokumentasi terkait.
- Laporan dapat digenerate per bidang (Kaderisasi, BIPEKA, dll) maupun laporan gabungan untuk Ketua/Superadmin.
- Laporan menyertakan ringkasan keuangan kegiatan (rekap struk yang telah diverifikasi Bendahara) bila relevan.
- Laporan dapat diunduh dalam format PDF siap kirim ke pengurus pusat/wilayah.
- Pengguna dapat melihat histori laporan bulan-bulan sebelumnya tanpa perlu menyusun ulang.

### 6.4 Modul Keuangan Kegiatan (Bendahara)

**Deskripsi:** Modul pencatatan bukti pengeluaran kegiatan (struk/kwitansi) dengan bantuan ekstraksi data otomatis berbasis OCR, sebagai pengganti pencatatan manual yang rawan kehilangan bukti fisik.

**Kebutuhan Fungsional:**

- Bendahara dapat mengunggah foto atau hasil pindai struk/kwitansi langsung dari perangkat.
- Sistem melakukan ekstraksi otomatis menggunakan OCR (Tesseract) untuk membaca nominal, tanggal transaksi, dan nama vendor/toko dari gambar struk.
- Hasil ekstraksi ditampilkan dalam form yang dapat diperiksa dan diedit oleh Bendahara sebelum disimpan, untuk memastikan kesesuaian dengan struk asli.
- Sistem menampilkan indikator keyakinan rendah (low-confidence warning) apabila hasil ekstraksi OCR meragukan, agar Bendahara melakukan pengecekan lebih teliti.
- Setiap struk dapat dikaitkan dengan agenda/kegiatan tertentu sehingga total pengeluaran per kegiatan terekap otomatis.
- Foto struk asli tetap disimpan sebagai arsip permanen meskipun datanya sudah diekstrak.
- Bendahara dapat mengekspor seluruh bukti struk dalam satu periode menjadi satu file PDF gabungan, lengkap dengan keterangan tanggal, nominal, dan kegiatan terkait di setiap halaman, untuk diserahkan ke pengurus pusat.

### 6.5 Modul Data Kader & Keluarga

**Deskripsi:** Modul sistem informasi kader yang mencatat data kader beserta anggota keluarganya, dengan fitur notifikasi otomatis saat anak kader memasuki jenjang pendidikan baru.

**Kebutuhan Fungsional:**

- Pengguna (Kaderisasi/Superadmin) dapat mendata profil kader: data diri, jenjang kaderisasi, riwayat pelatihan yang pernah diikuti, dan status keanggotaan.
- Pengguna dapat mendata anggota keluarga kader, termasuk data anak dengan tanggal lahir dan riwayat pendidikan (jenjang sekolah, nama sekolah, tahun masuk).
- Sistem secara otomatis menghitung perkiraan waktu anak kader memasuki jenjang pendidikan berikutnya (TK, SD, SMP, SMA, Perguruan Tinggi) berdasarkan usia, dan mengirimkan notifikasi kepada Kaderisasi/Ketua menjelang waktu tersebut.
- Pengguna dapat mencatat secara manual saat anak benar-benar memasuki jenjang pendidikan tertentu (nama sekolah, tanggal masuk), sehingga data tetap akurat meski ada penyesuaian dari estimasi otomatis.
- Sistem menyediakan pencarian dan filter data kader (berdasarkan wilayah, jenjang kaderisasi, status, dll).
- Akses ke data keluarga dan anak dibatasi hanya untuk peran yang relevan (Kaderisasi, Ketua, Superadmin, serta BIPEKA pada data yang relevan dengan programnya).

### 6.6 Modul Manajemen Pengguna & Struktur Organisasi/Periodisasi (Superadmin)

- Superadmin dapat menambah, mengedit, menonaktifkan akun pengguna dan menetapkan peran masing-masing.
- Sistem mendukung periodisasi kepengurusan (contoh: periode 2024–2027), sehingga riwayat siapa menjabat di periode mana tetap tersimpan saat terjadi pergantian pengurus.
- Data dan laporan dari periode sebelumnya tetap dapat diakses (read-only) meskipun kepengurusan telah berganti.
- Superadmin dapat menyusun struktur organisasi (bagan kepengurusan) per periode, termasuk bidang-bidang di bawah Ketua, dan menampilkannya sebagai referensi internal maupun di halaman publik.

### 6.7 Modul Jenjang Kaderisasi & Rapor Kader

**Deskripsi:** Pelengkap dari Modul Data Kader, modul ini fokus pada pemantauan perkembangan setiap kader dalam jenjang kaderisasi organisasi, sehingga kemajuan tiap individu dapat dipantau dari waktu ke waktu, bukan sekadar tercatat sebagai anggota.

**Kebutuhan Fungsional:**

- Kaderisasi dapat menetapkan jenjang kaderisasi yang berlaku di organisasi (contoh: Kader Dasar, Kader Menengah, Kader Lanjut) beserta syarat kenaikan jenjang.
- Sistem mencatat riwayat pelatihan/kegiatan kaderisasi yang pernah diikuti setiap kader, terhubung dengan data Agenda yang relevan.
- Sistem menghasilkan ringkasan perkembangan per kader (semacam rapor kader) yang menampilkan jenjang saat ini, pelatihan yang sudah/belum diikuti, dan rekomendasi langkah berikutnya.
- Kaderisasi dan Ketua dapat melihat rekap jenjang kaderisasi seluruh anggota untuk kebutuhan perencanaan program pembinaan.

### 6.8 Modul Dokumentasi Kegiatan

**Deskripsi:** Modul untuk menyimpan dan mengelola dokumentasi visual (foto/video) setiap kegiatan, terhubung langsung dengan data Agenda terkait.

**Kebutuhan Fungsional:**

- Pengguna dapat mengunggah foto/video dokumentasi pada agenda yang telah/sedang berlangsung.
- Dokumentasi tersimpan dalam galeri per agenda dan dapat diberi keterangan singkat.
- Laporan akhir bulan secara otomatis dapat menyertakan cuplikan dokumentasi dari kegiatan-kegiatan terkait, sehingga laporan ke pengurus pusat lebih informatif tanpa perlu menyusun manual.

### 6.9 Modul Notifikasi Terpusat

**Deskripsi:** Modul yang memusatkan seluruh pengingat dan notifikasi sistem dalam satu mekanisme, mencakup namun tidak terbatas pada notifikasi jenjang pendidikan anak kader.

**Kebutuhan Fungsional:**

- Sistem mengirimkan notifikasi untuk: estimasi jenjang pendidikan anak kader, pengingat agenda mendatang, surat masuk yang perlu ditindaklanjuti, dan pengingat verifikasi struk yang belum diperiksa.
- Notifikasi dapat dikirim melalui in-app notification, dan secara opsional melalui WhatsApp (menggunakan penyedia API pihak ketiga) atau email.
- Pengguna dapat mengatur preferensi notifikasi mana yang ingin diterima sesuai perannya.

### 6.10 Modul Halaman Publik & Profil Organisasi

**Deskripsi:** Halaman publik opsional yang menampilkan profil organisasi, struktur pengurus, dan kalender kegiatan secara terbuka untuk masyarakat, sebagai bentuk transparansi organisasi.

**Kebutuhan Fungsional:**

- Sistem menampilkan profil organisasi, visi-misi, dan struktur kepengurusan periode aktif yang dapat diakses publik tanpa login.
- Sistem dapat menampilkan kalender kegiatan publik (agenda yang ditandai sebagai terbuka untuk umum).
- Superadmin dapat mengaktifkan/menonaktifkan halaman publik ini sesuai kebijakan organisasi.

## 7. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
|-------|-----------|
| **Keamanan & Privasi** | Data pribadi kader dan anak wajib dienkripsi saat disimpan; akses dibatasi ketat sesuai peran; log aktivitas untuk audit |
| **Performa** | Proses OCR dan generate PDF berjalan di background queue agar tidak membebani permintaan utama, mengingat keterbatasan resource VPS |
| **Ketersediaan** | Target uptime wajar untuk skala organisasi kecil-menengah (bukan kebutuhan high-availability enterprise) |
| **Kompatibilitas** | Web responsif, dapat diakses dari desktop maupun perangkat mobile (terutama untuk fitur scan QR absensi & upload struk) |
| **Skalabilitas Biaya** | Seluruh pemrosesan AI/OCR menggunakan solusi gratis (Tesseract, self-hosted) untuk menghindari biaya API yang membengkak seiring pertumbuhan pengguna |
| **Auditabilitas** | Setiap surat, struk, dan laporan memiliki jejak siapa membuat/mengubah dan kapan |

## 8. Arsitektur & Stack Teknologi

### 8.1 Pendekatan Arsitektur

Sistem dibangun dengan pendekatan API-first: backend menyediakan REST API yang dikonsumsi oleh frontend SPA terpisah. Pendekatan ini dipilih agar lebih mencerminkan praktik arsitektur modern (backend dan frontend dapat dikembangkan, diuji, dan di-deploy secara independen), sekaligus memperkuat nilai portofolio teknis.

| Komponen | Pilihan Teknologi |
|----------|-------------------|
| **Backend** | Laravel (REST API only, autentikasi via Laravel Sanctum) |
| **Frontend** | React + TypeScript (SPA terpisah) |
| **Database** | PostgreSQL |
| **Background Job** | Laravel Queue (database driver, dapat ditingkatkan ke Redis bila diperlukan) |
| **OCR Struk** | Tesseract OCR (self-hosted) + Intervention Image untuk preprocessing gambar |
| **Generate PDF** | Spatie Laravel PDF / DomPDF |
| **Generate QR Code** | Simple QR Code (Laravel) |
| **Penyimpanan File** | Laravel Filesystem (lokal/VPS, dengan opsi migrasi ke object storage di masa depan) |
| **Hosting** | VPS milik sendiri (sumber daya terbatas, sehingga proses berat dijalankan via queue worker) |

## 9. Model Data (Entitas Utama)

Berikut entitas inti yang menjadi dasar perancangan skema database. Detail kolom akan disusun lebih lanjut pada tahap desain database.

- **Users** — akun pengguna sistem dengan relasi ke Role dan Periode Kepengurusan
- **Roles & Permissions** — daftar peran dan hak akses per modul
- **PeriodeKepengurusan** — periode jabatan organisasi (mulai/akhir, status aktif)
- **Agenda** — data kegiatan/rapat (judul, waktu, lokasi, bidang, status)
- **TemplateAbsensi** — susunan kolom absensi yang dapat dipakai ulang
- **Absensi** — data kehadiran per agenda, menyimpan data sesuai kolom template yang dipilih (format fleksibel/JSON)
- **TemplateSurat** — template surat dengan placeholder dinamis
- **Surat** — surat yang dihasilkan (nomor, jenis, status tanda tangan, file PDF, relasi ke penerima)
- **SuratMasuk** — pencatatan surat masuk beserta status disposisi
- **Struk** — bukti pengeluaran kegiatan (file gambar, hasil ekstraksi OCR, status verifikasi, relasi ke Agenda)
- **LaporanBulanan** — hasil generate laporan per periode dan bidang
- **Kader** — profil kader (data diri, jenjang kaderisasi, riwayat pelatihan)
- **AnggotaKeluarga** — data keluarga kader, termasuk anak dengan tanggal lahir dan riwayat pendidikan
- **RiwayatPendidikanAnak** — catatan jenjang sekolah anak (jenjang, nama sekolah, tahun masuk)
- **NotifikasiSistem** — notifikasi terjadwal (jenjang pendidikan anak, pengingat agenda, dll)
- **JenjangKaderisasi** — daftar jenjang kaderisasi dan syarat kenaikannya
- **RiwayatPelatihanKader** — relasi kader dengan agenda pelatihan yang pernah diikuti
- **DokumentasiKegiatan** — file foto/video yang terhubung dengan Agenda
- **StrukturOrganisasi** — bagan kepengurusan per periode

## 10. Alur Pengguna Utama (User Flow)

### 10.1 Alur Pembuatan Agenda & Absensi

1. Sekretaris membuat agenda baru dan memilih/menyusun template kolom absensi.
2. Sistem menghasilkan QR code unik untuk agenda tersebut.
3. Sekretaris membagikan QR code kepada calon peserta (cetak, layar, atau tautan digital).
4. Peserta memindai QR dan mengisi form absensi sesuai kolom yang ditentukan.
5. Sekretaris memantau rekap kehadiran secara real-time dan dapat menambahkan absensi susulan bila diperlukan.

### 10.2 Alur Pencatatan Struk oleh Bendahara

1. Bendahara mengunggah foto struk/kwitansi dan mengaitkannya dengan agenda terkait.
2. Sistem memproses gambar melalui OCR di background queue.
3. Hasil ekstraksi (nominal, tanggal, vendor) ditampilkan dalam form untuk diperiksa.
4. Bendahara memeriksa dan mengedit data bila ada ketidaksesuaian, lalu menyimpan.
5. Data tersimpan dengan status terverifikasi, foto asli tetap diarsipkan.

### 10.3 Alur Notifikasi Pendidikan Anak Kader

1. Kaderisasi mendata anak kader beserta tanggal lahirnya saat awal pencatatan.
2. Sistem menghitung estimasi waktu anak memasuki jenjang pendidikan berikutnya.
3. Sistem mengirimkan notifikasi kepada Kaderisasi/Ketua menjelang waktu tersebut tiba.
4. Kaderisasi memperbarui data secara manual begitu anak benar-benar masuk ke jenjang/sekolah tertentu.

## 11. Metrik Keberhasilan

| Metrik | Target Indikatif |
|--------|------------------|
| Waktu penyusunan laporan bulanan | Berkurang signifikan dibanding proses manual sebelumnya |
| Tingkat penggunaan QR absensi | Mayoritas agenda organisasi menggunakan absensi digital |
| Kelengkapan arsip struk | Bukti pengeluaran tidak ada yang hilang karena tersimpan digital sejak awal |
| Akurasi data pendidikan anak | Notifikasi terkirim sesuai waktu tanpa keterlambatan pencatatan |
| Adopsi pengguna per peran | Seluruh peran (Ketua s.d. BIPEKA) aktif menggunakan modul masing-masing |

## 12. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Akurasi OCR rendah pada struk buram/pudar | Data keuangan tidak akurat | Verifikasi manual wajib sebelum simpan; indikator low-confidence; preprocessing gambar |
| Kebocoran data pribadi kader/anak | Pelanggaran privasi, hilangnya kepercayaan | RBAC ketat per modul; enkripsi data sensitif; log akses |
| Resource VPS terbatas saat proses OCR/PDF massal | Sistem lambat/down saat beban tinggi | Proses berat dijalankan via queue worker, bukan permintaan langsung |
| Waktu pengembangan solo developer terbatas | Proyek molor dari target 3–6 bulan | Prioritaskan modul inti dahulu (agenda, absensi, surat) sebelum modul lanjutan |

## 13. Roadmap Pengembangan

Roadmap indikatif untuk jangka waktu 3–6 bulan, dikerjakan secara konsisten paruh waktu.

| Fase | Fokus | Output |
|------|-------|--------|
| **Fase 1 (Bulan 1–2)** | Fondasi: autentikasi, RBAC, struktur organisasi/periodisasi, modul Agenda & Absensi QR | Backend API + Frontend dasar berjalan, agenda & absensi fungsional |
| **Fase 2 (Bulan 2–3)** | Modul Surat-Menyurat (bulk, tanda tangan digital, arsip) & Dokumentasi Kegiatan | Surat dapat digenerate massal & diarsipkan; galeri dokumentasi per agenda berjalan |
| **Fase 3 (Bulan 3–4)** | Modul Keuangan Kegiatan (OCR struk) & Laporan Bulanan | Struk dapat diunggah & diverifikasi, laporan otomatis tergenerate |
| **Fase 4 (Bulan 4–5)** | Modul Data Kader & Keluarga, Jenjang Kaderisasi/Rapor Kader, Notifikasi Terpusat | Data kader lengkap, rapor kader tersedia, notifikasi (pendidikan anak, dll) berjalan otomatis |
| **Fase 5 (Bulan 5–6)** | Halaman Publik, penyempurnaan, dokumentasi portofolio, deploy demo publik | Profil organisasi publik aktif, studi kasus, README, demo live siap dipresentasikan |

## 14. Lampiran

### 14.1 Keputusan Produk yang Disepakati

- Fitur pengelolaan iuran/kas anggota sengaja tidak disertakan pada versi 1.0 — ini satu-satunya modul yang sengaja dikecualikan dari saran awal.
- Seluruh modul tambahan yang disarankan (jenjang kaderisasi/rapor kader, dokumentasi kegiatan, notifikasi terpusat, halaman publik, struktur organisasi & periodisasi) disepakati untuk dimasukkan ke versi 1.0.
- OCR struk menggunakan solusi gratis (Tesseract self-hosted), bukan API berbayar, demi keberlanjutan biaya operasional jangka panjang.
- Stack teknologi dipilih dengan mempertimbangkan keseimbangan antara kecepatan pengembangan (Laravel, sudah dikuasai) dan nilai jual portofolio (React + TypeScript, API-first architecture).

### 14.2 Hal yang Perlu Didiskusikan Lebih Lanjut

- Detail skema database final per entitas (kolom, tipe data, relasi).
- Desain API endpoint lengkap (REST resource per modul).
- Wireframe/UI design untuk dashboard per peran.
- Strategi deployment & domain untuk demo publik.
