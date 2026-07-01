# Modul 6.7 — Jenjang Kaderisasi & Rapor Kader

> **Organia** · PRD v1.0 · 30 Juni 2026
> [← Manajemen Pengguna](./03f-manajemen-pengguna.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Dokumentasi Kegiatan →](./03h-dokumentasi.md)

---

## Deskripsi

Pelengkap dari [Modul Data Kader & Keluarga](./03e-kader-keluarga.md). Modul ini fokus pada **pemantauan perkembangan setiap kader** dalam jenjang kaderisasi organisasi — sehingga kemajuan tiap individu dapat dipantau dari waktu ke waktu, bukan sekadar tercatat sebagai anggota biasa.

**Peran yang dapat mengakses:** Kaderisasi (full), Ketua (view), Superadmin (full)

---

## Deskripsi Kebutuhan

Modul ini menjawab pertanyaan penting:
> *"Kader kita sudah sampai mana? Siapa yang belum mengikuti pelatihan wajib? Siapa yang siap naik jenjang?"*

---

## Kebutuhan Fungsional

### F-01 · Definisi Jenjang Kaderisasi Organisasi

- [ ] Kaderisasi dapat **menetapkan jenjang kaderisasi** yang berlaku di organisasi, contoh:
  - Kader Dasar
  - Kader Menengah
  - Kader Lanjut
- [ ] Untuk setiap jenjang, dapat didefinisikan **syarat kenaikan jenjang**, contoh:
  - "Wajib mengikuti Pelatihan Dasar Organisasi"
  - "Minimal hadir 80% kegiatan bulanan"
  - "Sudah menyelesaikan modul X"
- [ ] Jenjang dan syarat dapat diedit seiring perubahan kebijakan organisasi

### F-02 · Riwayat Pelatihan Kader

- [ ] Sistem mencatat **riwayat pelatihan/kegiatan kaderisasi** yang pernah diikuti setiap kader
- [ ] Riwayat pelatihan **terhubung langsung dengan data Agenda** di [Modul Agenda & Absensi](./03a-agenda-absensi.md) yang ditandai sebagai agenda kaderisasi
- [ ] Pelatihan yang dihadiri kader (berdasarkan data absensi) otomatis masuk ke riwayat pelatihannya
- [ ] Kaderisasi dapat juga menambahkan pelatihan eksternal (di luar agenda sistem) secara manual

### F-03 · Rapor Perkembangan Kader

- [ ] Sistem menghasilkan **ringkasan perkembangan per kader** ("rapor kader") yang menampilkan:
  - Jenjang kaderisasi saat ini
  - Pelatihan yang **sudah** diikuti (beserta tanggal)
  - Pelatihan yang **belum** diikuti (beserta status wajib/tidak wajib)
  - Rekomendasi langkah berikutnya untuk naik jenjang
- [ ] Rapor dapat dilihat oleh Kaderisasi dan Ketua

### F-04 · Rekap Jenjang Seluruh Anggota

- [ ] Kaderisasi dan Ketua dapat melihat **rekap jenjang kaderisasi seluruh anggota** untuk kebutuhan perencanaan program pembinaan:
  - Berapa kader di setiap jenjang
  - Siapa saja yang siap naik jenjang (sudah memenuhi semua syarat)
  - Siapa yang belum mengikuti pelatihan tertentu

---

## Entitas Data Terkait

Lihat [Model Data](../06-data-model.md) untuk skema lengkap.

| Entitas | Keterangan |
|---------|-----------|
| `JenjangKaderisasi` | Daftar jenjang kaderisasi dan syarat kenaikannya |
| `Kader` | Profil kader dengan jenjang saat ini (dari [Modul Data Kader](./03e-kader-keluarga.md)) |
| `RiwayatPelatihanKader` | Relasi kader dengan agenda pelatihan yang pernah diikuti |
| `Agenda` | Data agenda yang ditandai sebagai kegiatan kaderisasi |

---

## Modul yang Berintegrasi

| Modul | Jenis Integrasi |
|-------|----------------|
| [Data Kader & Keluarga](./03e-kader-keluarga.md) | **Modul induk**: data profil kader berasal dari sini |
| [Agenda & Absensi](./03a-agenda-absensi.md) | Agenda kaderisasi → otomatis masuk riwayat pelatihan kader yang hadir |

---

## Catatan Implementasi

- **Auto-rekam riwayat:** Saat agenda bertipe "kaderisasi" selesai, sistem membaca daftar hadir dan otomatis mencatat pelatihan tersebut ke riwayat kader yang hadir — via event/listener Laravel
- **Fleksibilitas syarat:** Syarat kenaikan jenjang disimpan sebagai struktur yang dapat dikonfigurasi (bukan hardcode), agar dapat disesuaikan tanpa deployment baru
- **Tampilan rapor:** Diimplementasikan sebagai halaman detail kader dengan progress indicator visual (progress bar / checklist per syarat)

---

> [← Manajemen Pengguna](./03f-manajemen-pengguna.md) | [← Index Modul](./03-modules-index.md) | [Selanjutnya: Dokumentasi Kegiatan →](./03h-dokumentasi.md)
