# Diskusiin — Aplikasi Forum Diskusi

Aplikasi forum diskusi yang dibangun dengan **React** dan **Redux (Redux Toolkit)**,
memanfaatkan [Dicoding Forum API](https://forum-api.dicoding.dev/v1).

## Menjalankan proyek

```bash
npm install
npm run dev       # menjalankan mode pengembangan
npm run build      # build produksi ke folder dist/
npm run lint       # menjalankan ESLint
```

## Stack

- **React 18** (di-render dengan `react-dom`, dibangun dengan Vite)
- **Redux Toolkit** (`createSlice`, `createAsyncThunk`) untuk state management
- **React Router v6** untuk navigasi antar halaman
- **ESLint** dengan basis **Google JavaScript Style Guide** (`eslint-config-google`)
  ditambah `eslint-plugin-react` untuk kaidah JSX
- **React.StrictMode** aktif di `src/main.jsx`

## Struktur folder

```
src/
├─ components/     # komponen UI reusable (tidak menyimpan state dari API)
├─ pages/          # satu komponen per halaman/route
├─ states/         # Redux slices, dikelompokkan per domain
│  ├─ authUser/
│  ├─ isPreload/
│  ├─ threads/
│  ├─ threadDetail/
│  ├─ users/
│  ├─ leaderboards/
│  └─ shared/      # helper vote & alert slice lintas domain
├─ store/          # konfigurasi Redux store
├─ utils/          # api.js (satu-satunya tempat pemanggilan fetch) + helper lain
└─ styles/         # design tokens & stylesheet global
```

## Kriteria yang dipenuhi

**Fungsionalitas**
- Registrasi & login akun
- Melihat daftar thread beserta kategori, waktu, jumlah komentar, dan info pembuat
- Melihat detail thread beserta komentar
- Membuat thread & komentar baru (mewajibkan login)
- Loading indicator pada setiap proses pengambilan data

**Bugs highlighting**
- Konfigurasi ESLint (`.eslintrc.json`) berbasis Google Style Guide
- `React.StrictMode` dibungkus di root render

**Arsitektur**
- Seluruh state dari API disimpan di Redux store; hanya form (input terkontrol)
  yang mengelola state-nya sendiri
- Semua pemanggilan REST API terpusat di `src/utils/api.js` — dipanggil lewat
  Redux thunk, bukan langsung di dalam `useEffect`/lifecycle komponen
- Pemisahan folder UI (`components`, `pages`) dan state (`states`)
- Komponen modular & reusable (`Avatar`, `VoteControl`, `ThreadCard`, dst.)

**Fitur unggulan (saran submission)**
- ✅ Vote pada thread & komentar dengan **optimistic update** + rollback saat gagal,
  serta indikasi visual (warna) saat pengguna sudah vote
- ✅ Halaman leaderboard (nama, avatar, skor)
- ✅ Filter daftar thread berdasarkan kategori (murni di sisi front-end)

## Catatan implementasi vote

Karena API hanya menyediakan endpoint terpisah untuk up-vote, down-vote, dan
neutral-vote, aplikasi ini membandingkan status vote pengguna saat ini dengan
tombol yang diklik (`src/states/shared/voteHelper.js`) untuk menentukan aksi:
mengklik tombol yang sama dengan vote aktif akan menetralkan vote tersebut.
Perubahan diterapkan ke Redux store terlebih dahulu (optimistic), baru
kemudian dikonfirmasi ke API; jika API gagal, state dikembalikan ke kondisi semula.
