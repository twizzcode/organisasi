# Dashboard Organisasi

Dashboard organisasi dengan Next.js (App Router) fullstack, Better Auth
(email/password), Neon Postgres, dan Drizzle ORM.

## Fitur (tahap saat ini)

- **Autentikasi** — sign-up & sign-in email + password via Better Auth.
- **Approval** — user baru berstatus `pending` hingga diaktifkan ketua.
- **Role** — `ketua` (akses penuh) dan `staff` (lihat data departemennya).
- **Departemen** — CRUD departemen (khusus ketua).
- **Kelola Staff** — setujui pendaftaran, tetapkan departemen, ubah role.

> Fitur **program kerja per departemen** belum diimplementasikan (menunggu tahap berikutnya).

## Stack

| Bagian   | Teknologi                                   |
| -------- | ------------------------------------------- |
| Framework| Next.js 16 (App Router, Turbopack) + React 19 |
| Auth     | Better Auth                                 |
| Database | Neon Postgres (`@neondatabase/serverless`)  |
| ORM      | Drizzle ORM + drizzle-kit                   |
| UI       | Tailwind CSS v4 + shadcn/ui (Base UI)       |
| Validasi | Zod                                         |

## Struktur Data

- `departments` — departemen organisasi.
- `user` — tabel Better Auth + kolom custom:
  - `role` — `ketua` | `staff` (default `staff`)
  - `status` — `pending` | `active` (default `pending`)
  - `department_id` — relasi ke departemen (1 staff = 1 departemen)
- `session`, `account`, `verification` — tabel bawaan Better Auth.

## Menjalankan

### 1. Install dependencies

```bash
npm install
```

### 2. Konfigurasi environment

Salin `.env.example` menjadi `.env` lalu isi:

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
BETTER_AUTH_SECRET="<string-acak-panjang>"
BETTER_AUTH_URL="http://localhost:3000"
```

Buat secret dengan:

```bash
openssl rand -base64 32
```

### 3. Migrasi database

```bash
npm run db:generate   # generate file SQL (sudah dilakukan, ada di /drizzle)
npm run db:migrate    # terapkan ke Neon
```

### 4. Buat akun ketua pertama

```bash
npm run db:seed
```

Default kredensial (bisa diubah via env seed):

- Email: `ketua@organisasi.com`
- Password: `password123`

Env opsional: `SEED_KETUA_NAME`, `SEED_KETUA_EMAIL`, `SEED_KETUA_PASSWORD`.

### 5. Jalankan dev server

```bash
npm run dev
```

Buka http://localhost:3000.

## Alur Penggunaan

1. Ketua login dengan akun hasil seed.
2. Buat departemen di menu **Departemen**.
3. Staff mendaftar di `/sign-up` → masuk sebagai `pending`.
4. Ketua buka **Kelola Staff**, tetapkan departemen, lalu **Aktifkan**.
5. Staff login dan hanya melihat data departemennya.

## Skrip

| Skrip              | Fungsi                                  |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Dev server                              |
| `npm run build`    | Build produksi                          |
| `npm run lint`     | ESLint                                  |
| `npm run db:generate` | Generate migrasi Drizzle             |
| `npm run db:migrate`  | Terapkan migrasi                     |
| `npm run db:push`     | Push schema langsung (dev)           |
| `npm run db:studio`   | Drizzle Studio                       |
| `npm run db:seed`     | Seed ketua pertama + departemen contoh |

## Otorisasi

Logika akses terpusat di `src/lib/guards.ts`:

- `requireAuth()` — harus login.
- `requireActiveUser()` — harus login & aktif.
- `requireKetua()` — harus role ketua.
- `assertDepartmentAccess()` / `canAccessDepartment()` — ketua lolos semua,
  staff hanya departemennya.

Setiap server action memanggil guard ini, jadi otorisasi tidak hanya di UI.

## Menambah fitur departemen berikutnya

Pola yang dipakai (mis. program kerja):

1. Tambah tabel dengan kolom `departmentId` (FK ke `departments`).
2. Buat server action di `src/server/actions/*` + validasi Zod.
3. Panggil `requireActiveUser()` lalu `assertDepartmentAccess()`.
4. Query di `src/server/queries/*`, filter berdasarkan departemen untuk staff.
5. Halaman `src/app/dashboard/<fitur>/`.
# organisasi
# organisasi
