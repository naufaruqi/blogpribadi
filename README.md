# blogpribadi

Blog pribadi yang dibangun dengan Astro dan dipublikasikan melalui GitHub Pages.

## Menjalankan secara lokal

```sh
npm ci
npm run dev
```

## Deploy ke GitHub Pages

Workflow GitHub Actions di `.github/workflows/deploy.yml` akan membangun dan
mempublikasikan situs setiap kali ada push ke branch `main` atau `master`.

1. Push project ini ke repository GitHub.
2. Buka **Settings → Pages** pada repository.
3. Pilih **GitHub Actions** sebagai Build and deployment source.
4. Buka tab **Actions** untuk memantau proses deploy.

Untuk repository project biasa, konfigurasi Astro otomatis menggunakan nama
repository sebagai base path di GitHub Actions. URL situsnya akan berbentuk
`https://<username>.github.io/<nama-repository>/`. Saat dijalankan lokal, base
path tetap `/`.

Perintah `npm run build` membuat hasil situs di folder `dist/`.
