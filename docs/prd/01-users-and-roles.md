# 01 — Target Pengguna & Peran (Role)

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Overview](./00-overview.md) | [← Index](../README.md) | [Selanjutnya: Scope →](./02-scope.md)

---

## Sistem Role-Based Access Control (RBAC)

Organia menggunakan **kontrol akses berbasis peran (RBAC)**. Setiap peran memiliki kewenangan dan tampilan dashboard yang berbeda sesuai tanggung jawabnya.

Pengelolaan akun pengguna dilakukan oleh **Superadmin** melalui [Modul Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md).

---

## Daftar Peran

### 👑 Superadmin
| Field | Detail |
|-------|--------|
| **Tanggung Jawab** | Mengelola seluruh sistem, pengguna, dan pengaturan organisasi |
| **Akses Khusus** | Akses penuh ke semua modul; manajemen pengguna & periode kepengurusan |
| **Modul Utama** | [Manajemen Pengguna & Struktur Organisasi](./03-modules/03f-manajemen-pengguna.md) |

---

### 🏛️ Ketua
| Field | Detail |
|-------|--------|
| **Tanggung Jawab** | Mengawasi seluruh kegiatan dan menyetujui surat/laporan penting |
| **Akses Khusus** | Lihat semua modul; approval surat & laporan; lihat ringkasan lintas bidang |
| **Modul Utama** | [Laporan Bulanan](./03-modules/03c-laporan-bulanan.md), [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |

---

### 📝 Sekretaris
| Field | Detail |
|-------|--------|
| **Tanggung Jawab** | Mengelola agenda, surat-menyurat, dan arsip |
| **Akses Khusus** | Modul agenda, absensi, surat (buat & kelola), arsip surat masuk/keluar |
| **Modul Utama** | [Agenda & Absensi](./03-modules/03a-agenda-absensi.md), [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) |

---

### 💰 Bendahara
| Field | Detail |
|-------|--------|
| **Tanggung Jawab** | Mengelola pencatatan pengeluaran kegiatan & bukti struk |
| **Akses Khusus** | Modul keuangan kegiatan: input & verifikasi struk, laporan keuangan per kegiatan |
| **Modul Utama** | [Keuangan Kegiatan (OCR Struk)](./03-modules/03d-keuangan.md) |
| **Pembatasan** | ⚠️ Tidak memiliki akses ke data anak kader |

---

### 🎓 Kaderisasi
| Field | Detail |
|-------|--------|
| **Tanggung Jawab** | Mengelola data kader dan jenjang pelatihan |
| **Akses Khusus** | Modul data kader, riwayat pelatihan, notifikasi pendidikan anak (lihat & kelola) |
| **Modul Utama** | [Data Kader & Keluarga](./03-modules/03e-kader-keluarga.md), [Jenjang Kaderisasi](./03-modules/03g-jenjang-kaderisasi.md) |

---

### 👩‍👧 BIPEKA
| Field | Detail |
|-------|--------|
| **Tanggung Jawab** | Mengelola kegiatan & data terkait perempuan dan ketahanan keluarga |
| **Akses Khusus** | Modul agenda khusus bidang BIPEKA; data keluarga kader (akses terbatas sesuai relevansi) |
| **Modul Utama** | [Agenda & Absensi](./03-modules/03a-agenda-absensi.md), [Data Kader & Keluarga](./03-modules/03e-kader-keluarga.md) |

---

## Matriks Akses Modul per Peran

| Modul | Superadmin | Ketua | Sekretaris | Bendahara | Kaderisasi | BIPEKA |
|-------|:----------:|:-----:|:----------:|:---------:|:----------:|:------:|
| [Agenda & Absensi](./03-modules/03a-agenda-absensi.md) | ✅ Full | ✅ View | ✅ Full | ⬜ | ⬜ | ✅ Bidang |
| [Surat-Menyurat](./03-modules/03b-surat-menyurat.md) | ✅ Full | ✅ Approve | ✅ Full | ⬜ | ⬜ | ⬜ |
| [Laporan Bulanan](./03-modules/03c-laporan-bulanan.md) | ✅ Full | ✅ View | ✅ Generate | ⬜ | ⬜ | ⬜ |
| [Keuangan Kegiatan](./03-modules/03d-keuangan.md) | ✅ Full | ✅ View | ⬜ | ✅ Full | ⬜ | ⬜ |
| [Data Kader & Keluarga](./03-modules/03e-kader-keluarga.md) | ✅ Full | ✅ View | ⬜ | ⬜ | ✅ Full | ✅ Terbatas |
| [Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md) | ✅ Full | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| [Jenjang Kaderisasi](./03-modules/03g-jenjang-kaderisasi.md) | ✅ Full | ✅ View | ⬜ | ⬜ | ✅ Full | ⬜ |
| [Dokumentasi](./03-modules/03h-dokumentasi.md) | ✅ Full | ✅ View | ✅ Upload | ✅ View | ⬜ | ✅ Bidang |
| [Notifikasi](./03-modules/03i-notifikasi.md) | ✅ Full | ✅ Terima | ✅ Terima | ✅ Terima | ✅ Terima | ✅ Terima |
| [Halaman Publik](./03-modules/03j-halaman-publik.md) | ✅ Kelola | ✅ View | ✅ View | ⬜ | ⬜ | ⬜ |

---

## Kebijakan Akses Data Sensitif

> ⚠️ **Catatan Penting:** Karena sistem menyimpan data pribadi termasuk **data anak-anak**, setiap peran hanya dapat mengakses data yang relevan dengan tanggung jawabnya.

Contoh implementasi kebijakan:
- **Bendahara** → tidak memiliki akses ke data anak kader, namun dapat melihat data kegiatan yang relevan dengan pengeluaran yang dicatatnya
- **BIPEKA** → dapat mengakses data keluarga kader hanya pada aspek yang relevan dengan program perempuan dan ketahanan keluarga
- **Sekretaris** → tidak mengakses data keuangan detail, hanya agenda dan surat

Detail teknis RBAC diimplementasikan pada [Modul Manajemen Pengguna](./03-modules/03f-manajemen-pengguna.md) dan diperkuat pada level [arsitektur backend](./05-architecture.md).

---

> [← Overview](./00-overview.md) | [← Index](../README.md) | [Selanjutnya: Scope →](./02-scope.md)
