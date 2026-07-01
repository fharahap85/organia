# Fase 11: Polish, Testing & Deployment

> **Tujuan:** Menyempurnakan antarmuka, menambal bug (bug-fixing), melengkapi dokumentasi API (sebagai portofolio), dan men-deploy aplikasi (Backend & Frontend) ke VPS.

---

## 💅 11.1 Polish UI/UX

- [ ] 11.1.1 Lakukan review keseluruhan tampilan:
  - Pastikan semua modal/dialog memiliki animasi transisi yang halus.
  - Perbaiki warna/contrast yang kurang jelas.
  - Pastikan loading state (spinner/skeleton) muncul saat memanggil API lama (terutama fungsi Queue).
- [ ] 11.1.2 Pastikan aplikasi bersifat *Responsive* (bisa diakses via HP, terutama fitur absen QR dan Upload Struk yang sering dipakai di lapangan).
- [ ] 11.1.3 Cek semua form, pastikan ada validasi Error Message (baik dari sisi React maupun dari response Error 422 Laravel).

## 🧪 11.2 Pengujian (Testing)

- [ ] 11.2.1 Tulis unit tests (Pest / PHPUnit) untuk fungsi krusial backend:
  - Perhitungan Estimasi Jenjang Pendidikan Anak.
  - Auto-generate Nomor Surat.
  - Eksekusi Laporan Bulanan (pastikan query sum/hitung akurat).
- [ ] 11.2.2 Pengujian role/RBAC: Login menggunakan setiap peran (Ketua, Sekretaris, dll) dan pastikan mereka TIDAK BISA mengakses modul yang dilarang.
- [ ] 11.2.3 Pengujian End-to-End absensi publik: Coba scan QR code dari HP, submit, pastikan data terekap di dashboard.

## 📖 11.3 Dokumentasi API & Portofolio

- [ ] 11.3.1 Generate dokumentasi API (gunakan package seperti `scribe` atau Swagger/Postman export). Ini penting untuk menunjukkan kemampuan API design di portofolio.
- [ ] 11.3.2 Buat `README.md` utama repository:
  - Cara instalasi local.
  - Penjelasan arsitektur.
  - Link dokumentasi API.

## 🚀 11.4 Deployment ke VPS (Production)

- [ ] 11.4.1 Setup VPS (Ubuntu/Linux). Install Nginx, PostgreSQL, PHP-FPM, Node.js (untuk build frontend jika diperlukan).
- [ ] 11.4.2 Setup Git pull atau CI/CD (GitHub Actions) dari repo ke server.
- [ ] 11.4.3 Setup Supervisor / Systemd untuk daemon Worker Queue (`php artisan queue:work`). Ini sangat krusial agar OCR dan generate surat massal bisa jalan di background.
- [ ] 11.4.4 Setup Laravel Scheduler (`php artisan schedule:run` diaktifkan via Linux Cron).
- [ ] 11.4.5 Konfigurasi Nginx:
  - Blok pertama untuk serve static file Frontend (React SPA).
  - Blok kedua untuk mem-proxy request API `/api` ke Backend (Laravel).
- [ ] 11.4.6 Install SSL (Let's Encrypt).
- [ ] 11.4.7 Uji coba akhir di environment production.

---

🎉 **SELAMAT! Anda telah menyelesaikan pengembangan sistem Organia!** 🎉
