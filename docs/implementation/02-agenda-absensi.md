# Fase 2: Agenda & Absensi QR Code

> **Tujuan:** Sekretaris dapat membuat agenda, mengatur kolom form absensi dinamis (JSON), men-generate QR Code, dan peserta dapat mengisi absensi secara mandiri tanpa login.
>
> **Referensi PRD:** [03a-agenda-absensi.md](../prd/03a-agenda-absensi.md)

---

## 📅 2.1 Model & Migrasi Database

- [ ] 2.1.1 Buat migration & model `Agenda`:
  - Kolom: `judul`, `deskripsi`, `tanggal_mulai`, `tanggal_selesai`, `lokasi`, `bidang_penyelenggara`, `status` (draft/aktif/selesai), `is_publik`, `uuid_qr` (unique, untuk URL).
- [ ] 2.1.2 Buat migration & model `TemplateAbsensi`:
  - Kolom: `nama_template`, `skema_kolom` (tipe JSONB).
- [ ] 2.1.3 Buat migration & model `Absensi`:
  - Kolom: `agenda_id`, `data_kehadiran` (tipe JSONB), `waktu_hadir`, `ditambahkan_oleh` (nullable, jika admin manual).

## ⚙️ 2.2 Backend API: Agenda (Private)

- [ ] 2.2.1 Buat `AgendaController`:
  - `GET /api/agendas` (list agenda per role: Sekretaris/Superadmin lihat semua, BIPEKA lihat bidangnya).
  - `POST /api/agendas` (buat agenda).
  - `PUT /api/agendas/{id}` (edit).
  - `DELETE /api/agendas/{id}`.
- [ ] 2.2.2 Buat endpoint pengelolaan `TemplateAbsensi` (CRUD sederhana).
- [ ] 2.2.3 Implementasikan library QR Code (misal: `simplesoftwareio/simple-qrcode`).
- [ ] 2.2.4 Buat endpoint `GET /api/agendas/{id}/qr` yang mengembalikan URL gambar QR Code (mengarah ke frontend absensi publik menggunakan `uuid_qr`).

## 📱 2.3 Backend API: Absensi (Publik & Private)

- [ ] 2.3.1 Buat `AbsensiPublikController` (Tanpa middleware auth):
  - `GET /api/public/agenda/{uuid_qr}`: Mengembalikan data agenda dan skema kolom (TemplateAbsensi terkait) jika status aktif.
  - `POST /api/public/agenda/{uuid_qr}/absen`: Submit data absensi dari peserta, validasi struktur data dengan skema, simpan ke tabel `Absensi` (sebagai JSON).
- [ ] 2.3.2 Buat Endpoint Rekap Kehadiran (Private, Sekretaris):
  - `GET /api/agendas/{id}/absensi` (Lihat siapa yang hadir, data JSON di-flatten).
  - `POST /api/agendas/{id}/absensi/manual` (Sekretaris tambah peserta manual).
- [ ] 2.3.3 Buat Endpoint Export (Private):
  - `GET /api/agendas/{id}/absensi/export` (Download rekap jadi Excel/CSV).

## 🖥️ 2.4 Frontend: Manajemen Agenda (Private)

- [ ] 2.4.1 Buat halaman Daftar Agenda (`/agendas`).
- [ ] 2.4.2 Buat Form Tambah/Edit Agenda.
- [ ] 2.4.3 Buat Form Pembuatan/Pemilihan "Template Kolom Absensi".
  - UI untuk menambah input (Nama, Jabatan, dll) dan menyimpannya sebagai skema.
- [ ] 2.4.4 Halaman Detail Agenda:
  - Tampilkan QR Code besar yang bisa di-download.
  - Tampilkan tabel rekap absensi real-time.
  - Tombol export Excel.
  - Tombol tambah absen manual.

## 🌐 2.5 Frontend: Form Absensi Publik (Tanpa Login)

- [ ] 2.5.1 Buat route publik khusus: `/absen/:uuid_qr` (Bukan di bawah Auth Guard).
- [ ] 2.5.2 Buat UI Form dinamis:
  - Saat page load, ambil skema form dari `GET /api/public/agenda/{uuid_qr}`.
  - Render input (text, select, dll) secara dinamis berdasarkan skema.
- [ ] 2.5.3 Handle proses submit ke `POST /api/public/agenda/{uuid_qr}/absen`.
- [ ] 2.5.4 Tampilkan pesan sukses ("Terima kasih, kehadiran Anda telah dicatat") atau error (jika agenda sudah ditutup/kadaluarsa).

---

> **Langkah Selanjutnya:** Jika rekap absen per agenda selesai, lanjut ke [Fase 3: Surat-Menyurat](./03-surat-menyurat.md).
