# Heyfik Builder — Pola Kerja Lengkap

## Aturan Utama

1. **Setiap perubahan = 1 Issue** — jangan gabung banyak hal dalam 1 commit/PR
2. **Test dulu sebelum push** — jalankan lint, typecheck, test backend
3. **Commit kecil & fokus** — satu fitur/fix per commit, judul jelas
4. **PR wajib untuk perubahan besar** — perubahan kecil bisa langsung ke `master`

---

## 0. Sebelum Mulai: Buat Issue

Setiap pekerjaan WAJIB dibuatkan Issue GitHub terlebih dahulu:

```bash
# Buat issue via gh CLI
gh issue create \
  --title "feat: tambah halaman galeri website" \
  --body "**Deskripsi:** Halaman publik untuk lihat semua website user\n**Langkah:**\n1. API endpoint baru\n2. Halaman frontend /explore\n3. Filter industri\n**Acceptance Criteria:**\n- [ ] GET /api/public/websites\n- [ ] Grid responsif\n- [ ] Filter berfungsi"
```

Atau buat via Web GitHub → Issues → New Issue.

### Format Judul Issue
```
feat: <fitur baru>
fix: <perbaikan bug>
chore: <tugas maintenance>
refactor: <refaktor kode>
docs: <dokumentasi>
```

### Format Body Issue
- Deskripsi singkat
- Checklist acceptance criteria
- Link ke referensi (file, gambar, dll)

---

## 1. Git Branching & Merge

1. **Ambil issue → buat branch** dari `master`
   ```bash
   git checkout master && git pull --ff-only
   git checkout -b feat/nama-fitur-#<issue-number>
   ```
2. **Kerjakan perubahan** di branch tsb
3. **Test & lint** (lihat bagian Testing)
4. **Push branch**
   ```bash
   git add . && git commit -m "feat: deskripsi singkat (closes #<issue-number>)"
   git push origin feat/nama-fitur-#<issue-number>
   ```
5. **Buat PR** via GitHub (`gh pr create`) atau Web
   ```bash
   gh pr create \
     --title "feat: deskripsi" \
     --body "Closes #<issue-number>" \
     --base master
   ```
6. **Review** — cek diff, pastikan hanya file relevan
7. **Merge PR** ke `master`
   ```bash
   gh pr merge --squash
   ```
8. **Tarik `master`** setelah merge
   ```bash
   git checkout master && git pull --ff-only
   ```
9. **Hapus branch** remote & lokal
   ```bash
   git branch -D feat/nama-fitur-#<issue-number>
   git push origin --delete feat/nama-fitur-#<issue-number>
   ```

> ⚠️ Pakai `-D` (force delete) karena squash merge bikin commit baru — branch lokal tidak terdeteksi sebagai merged.

> Perubahan kecil (typo, 1 file, non-fungsional) bisa langsung di `master` tanpa issue.

## 2. Deploy & Restart System

### Frontend (styling/UI)
```bash
docker compose up -d --build frontend
```
- Container `heyfik_frontend` otomatis recreates + start
- Nginx di dalam container serve file baru

### Backend (API/logic)
```bash
docker compose up -d --build backend
```
- Container `heyfik_backend` otomatis recreates + start
- PM2 di dalam container handle Node.js process

### Full stack
```bash
docker compose up -d --build
```

### Cek status
```bash
docker compose ps
docker compose logs <service> --tail=50
```

## 3. Testing & Lint (Sebelum Commit)

Sebelum commit/PR, WAJIB menjalankan:

### Backend
```bash
# Unit & integration test
cd backend && npm test

# Lint (jika tersedia)
# cd backend && npx eslint src/
```

### Frontend
```bash
# Build test (vite compile)
cd frontend && npm run build

# E2E test (jika ada)
# cd frontend && npm run test:e2e

# Lint (jika tersedia)
# cd frontend && npx eslint src/
```

### Docker build test
```bash
docker compose up -d --build frontend  # pastikan build lolos
docker compose up -d --build backend   # pastikan backend nyala
```

> **Jika test ada yang merah, FIX DAHULU sebelum commit/PR.**
> Jika tidak ada test untuk kode baru, tambahkan test minimal.

---

## 4. Edit → Build → Deploy Cycle

1. Edit file
2. **Test & lint** lokal
3. **Build & deploy**:
   ```bash
   docker compose up -d --build frontend
   # atau
   docker compose up -d --build backend
   # atau full stack
   docker compose up -d --build
   ```
4. Pastikan build sukses & container sehat (`docker compose ps`)
5. **Commit & push** ke branch
6. **Buat PR** atau merge langsung

> Setiap edit styling harus diikuti rebuild container — Vite build dari dalam Docker, bukan dev server.

## 5. Infrastructure

- **VPS** production — Docker Compose
- **Container names**: `heyfik_db`, `heyfik_redis`, `heyfik_backend`, `heyfik_frontend`
- **Ports**: backend `3001`, frontend `80` (nginx), db `5432`, redis `6379`
- **PM2** inside backend container for Node.js process
- **Nginx** reverse proxy + SSL (di host, bukan container)

## 6. Rebranding (AFH → Heyfik)

Ganti di:
- `index.html` (title, meta)
- `nginx-spa.conf` (server_name)
- `docker-compose.yml` (container names)
- `deploy.yml`
- `.env.example`
- Semua UI pages dengan brand name

## 7. SEO

- `public/robots.txt` + `public/sitemap.xml`
- `@unhead/vue` → `useHead({ title, meta })` di setiap page
- `index.html` embed konten statis landing untuk crawler

### Submit sitemap ke Google Search Console
1. Buka https://search.google.com/search-console → login → pilih property `https://heyfik.net`
2. Verifikasi domain (DNS TXT record atau HTML file) jika belum
3. **Sitemaps** → masukkan `https://heyfik.net/sitemap.xml` → Submit
4. **Request Indexing**: URL Inspection → paste tiap URL → Request Indexing
5. Pantau di **Coverage** report setelah 1-4 minggu

## 8. Pricing Rules

- **Hanya 2 paket real**: Gratis (Rp 0) & Berbayar Pro (Rp 30.000)
- Jangan pernah buat paket fiktif
- Grid: `md:grid-cols-2`
- Comparison table: 8 baris, 2 kolom values
- Referensi data asli: `PricingPage.vue`

## 9. Theme (Emerald + Gold)

| Elemen | Class |
|--------|-------|
| CTA button | `bg-amber-400 text-emerald-900` |
| Background pricing | `bg-emerald-900` |
| Featured card | `ring-2 ring-amber-400` |
| Primary hover | `hover:bg-emerald-700` |
| Secondary text | `text-emerald-200` |

## 10. Rate Card Custom (Negosiasi via WA)

- Tampilkan kartu ketiga "Enterprise" di landing page pricing section
- Tombol "Hubungi via WhatsApp" -> `wa.me/{nomor_admin}`
- Nomor WA admin bisa diatur dari halaman **Admin → Pengaturan**
- Data disimpan di tabel `app_config` key `whatsapp_admin_number`
- Ada public endpoint `GET /api/config/whatsapp_admin_number` (whitelisted)
- Admin: `GET/PUT /api/admin/config/:key` (protected)
- Halaman admin: `AdminSettings.vue` -> `/admin/settings`
- Comparison rows jadi 3 kolom (Gratis, Berbayar Pro, Custom)

### Cara setup nomor WA admin
1. Login sebagai admin
2. Buka menu **Pengaturan** di sidebar admin
3. Masukkan nomor WA (format internasional: 628xxx)
4. Simpan — nomor otomatis muncul di landing page

## 12. Blog System

### Backend
- `blog_posts` table — `id`, `title`, `slug`, `content`, `excerpt`, `cover_image`, `author_name`, `status`, `published_at`
- Admin CRUD: `GET/POST /api/admin/blog`, `PUT/DELETE /api/admin/blog/:id`
- Public: `GET /api/public/blog?page=&limit=`, `GET /api/public/blog/:slug`

### Frontend
- **Admin → Blog**: `AdminBlog.vue` — tabel list + modal form (title, slug, HTML content, cover, author, status draft/published)
- **Landing page**: section blog (3 post terbaru) antara FAQ dan CTA
- **`/blog`**: `BlogPage.vue` — grid semua post dengan pagination
- **`/blog/:slug`**: `BlogDetailPage.vue` — cover image, konten HTML, CTA "Mulai Gratis"

### Cara pakai
1. Admin login → Blog → "Tulis Post Baru"
2. Isi judul, slug (auto), konten HTML, cover, penulis
3. Pilih status "Terbitkan" → langsung muncul di landing & /blog

---

## 13. Halaman Galeri / Jelajahi (/explore)

- Halaman publik menampilkan semua website dengan status `published`
- Filter by industry (toko, resto, jasa, portfolio)
- Pagination (12 per page)
- Setiap kartu: gradient banner (pakai `brand_color`), logo/initial, nama, deskripsi, owner, tombol "Kunjungi"
- Data dari `GET /api/public/websites` (join: websites + domains + templates + users)
- Filter industries dari `GET /api/public/industries`
- Route: `/explore` → `GalleryPage.vue`
- Nav landing page tambah link "Jelajahi"

## 13. Billing Model

| Fitur | Gratis | Berbayar Pro |
|-------|--------|--------------|
| Harga | Rp 0 | Rp 30.000/bln |
| Subdomain | ✅ | ✅ |
| Domain custom | ❌ | ✅ |
| SSL/HTTPS | ✅ | ✅ |
| Hosting | Unlimited | Unlimited |
| Jumlah produk | Maks 10 | Unlimited |
| SEO kustom | ❌ | ✅ |
| Watermark | Ada | ❌ |
| Prioritas approval | ❌ | ✅ |

Midtrans: BCA, Mandiri, BRI, GoPay, OVO, Dana, kartu kredit.

## 14. Communication Style

- Bahasa Indonesia
- Singkat, langsung, tanpa basa-basi
- Format: state + satu baris klarifikasi
