
---
title: "Mengapa Website Berjalan di Lokal, tetapi Bisa Gagal di GitHub Pages?"
description: "Memahami perbedaan alamat lokal dan alamat publikasi, serta fungsi base path dalam membangun website Astro di GitHub Pages."
pubDate: 2026-11-15
category: "Technology"
draft: false
---

# Mengapa Website Berjalan di Lokal, tetapi Bisa Gagal di GitHub Pages?

Ada pengalaman menarik ketika pertama kali membangun website: halaman berhasil dibuka di komputer sendiri, tampilannya sudah sesuai harapan, dan semua tautan seolah bekerja dengan baik. Namun, setelah dipublikasikan, beberapa bagian justru tidak ditemukan.

Ada halaman yang menampilkan error 404. Ada gambar yang tidak muncul. Bahkan, tautan navigasi yang sebelumnya berfungsi tiba-tiba membawa pengunjung ke alamat yang salah.

Masalah seperti ini sering kali bukan disebabkan oleh desain atau isi halaman. Salah satu penyebabnya adalah perbedaan jalur alamat ketika website dijalankan secara lokal dan ketika dipublikasikan.

Dalam pengembangan website menggunakan Astro dan GitHub Pages, saya menemukan satu konsep yang penting dipahami: **base path**.

## Website Memiliki Lebih dari Satu Lingkungan

Ketika menjalankan perintah `npm run dev`, kita sedang menjalankan server pengembangan di komputer sendiri.

Website dapat diakses melalui alamat lokal, misalnya:

`http://localhost:4321/`

Alamat tersebut hanya digunakan untuk mengakses website selama proses pengembangan.

Setelah website dibangun dan dipublikasikan melalui GitHub Pages, alamatnya dapat berubah. Misalnya:

`https://username.github.io/muhamad-ihsan/`

Perhatikan bahwa alamat publikasi tersebut memiliki tambahan `/muhamad-ihsan/` setelah nama domain.

Tambahan jalur ini bukan sekadar bagian dari nama alamat. Jalur tersebut menentukan lokasi halaman dan aset website yang harus diminta oleh browser.

Jika kode masih menganggap bahwa website berada langsung di root domain, browser mungkin akan mencari berkas pada lokasi yang keliru.

## Memahami User Site dan Project Site

GitHub Pages menyediakan dua jenis website.

Pertama, **user site**. Website ini menggunakan repository dengan nama khusus sesuai akun GitHub, yaitu:

`username.github.io`

Alamat publikasinya:

`https://username.github.io/`

Kedua, **project site**. Website ini berasal dari repository proyek biasa, misalnya:

`muhamad-ihsan`

Alamat publikasinya:

`https://username.github.io/muhamad-ihsan/`

Perbedaan ini penting karena website yang diterbitkan sebagai project site berada di dalam subdirektori, bukan langsung di root domain.

Dengan kata lain, browser perlu mengetahui bahwa halaman utama website berada di bawah jalur `/muhamad-ihsan/`.

## Mengenal Site dan Base dalam Astro

Astro menyediakan konfigurasi `site` dan `base` untuk mengatur alamat publikasi.

Keduanya memiliki fungsi berbeda.

- `site` menentukan URL akhir website yang dipublikasikan. Astro menggunakannya, antara lain, untuk menghasilkan URL kanonis dan sitemap.
- `base` menentukan jalur dasar tempat halaman dan aset website disajikan.

Sebagai contoh, konfigurasi untuk project site dapat ditulis seperti berikut:

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://username.github.io",
  base: "/muhamad-ihsan",
  trailingSlash: "always",
});
```

Pada contoh tersebut:

- Domain website adalah `https://username.github.io`.
- Jalur dasar website adalah `/muhamad-ihsan/`.
- Halaman utama berada di bawah jalur dasar tersebut.

Jika menggunakan user site dengan repository `username.github.io`, jalur dasarnya berbeda:

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://username.github.io",
  base: "/",
  trailingSlash: "always",
});
```

Jadi, konfigurasi `base` perlu disesuaikan dengan lokasi publikasi website.

## Menggunakan BASE_URL agar Tautan Lebih Fleksibel

Menuliskan jalur repository secara langsung pada setiap tautan bukanlah pendekatan yang baik.

Bayangkan kita memiliki banyak halaman:

- Home
- Writing
- Knowledge
- Education
- Technology
- Projects

Jika nama repository berubah, kita harus memperbaiki banyak alamat secara manual.

Astro menyediakan variabel:

`import.meta.env.BASE_URL`

Variabel ini berisi jalur dasar yang ditentukan melalui konfigurasi `base`.

Kita dapat menggunakannya di komponen:

```astro
---
const base = import.meta.env.BASE_URL;
---

<nav>
  <a href={base}>Home</a>
  <a href={`${base}writing/`}>Writing</a>
  <a href={`${base}knowledge/`}>Knowledge</a>
  <a href={`${base}education/`}>Education</a>
</nav>
```

Dengan `trailingSlash: "always"`, nilai `BASE_URL` memiliki garis miring di bagian akhir. Karena itu, kita dapat menambahkan nama halaman tanpa harus menulis ulang jalur repository.

Pendekatan yang sama dapat digunakan untuk aset yang alamatnya ditulis secara langsung, misalnya gambar di dalam folder `public`:

```astro
---
const base = import.meta.env.BASE_URL;
---

<img
  src={`${base}images/profile.jpg`}
  alt="Foto profil"
/>
```

Dengan cara ini, alamat gambar mengikuti jalur dasar website.

## Mengapa Tautan dengan Garis Miring di Depan Bisa Bermasalah?

Perhatikan dua contoh berikut:

```html
<a href="/writing/">Writing</a>
```

dan:

```astro
---
const base = import.meta.env.BASE_URL;
---

<a href={`${base}writing/`}>Writing</a>
```

Contoh pertama menggunakan jalur absolut dari root domain.

Ketika website diterbitkan sebagai project site, browser dapat mencari halaman pada:

`https://username.github.io/writing/`

Padahal lokasi yang diinginkan adalah:

`https://username.github.io/muhamad-ihsan/writing/`

Contoh kedua menggunakan jalur dasar yang disediakan Astro. Karena itu, tautan dapat mengikuti lokasi publikasi yang telah dikonfigurasi.

Kesalahan kecil pada satu karakter garis miring dapat menghasilkan alamat yang berbeda.

## Menguji Website Sebelum Dipublikasikan

Membangun website tidak berhenti ketika halaman berhasil ditampilkan di komputer sendiri.

Kita juga perlu memastikan bahwa hasil build memiliki struktur alamat yang benar.

Ada beberapa pemeriksaan sederhana yang dapat dilakukan:

1. Periksa konfigurasi `site`, `base`, dan `trailingSlash`.
2. Periksa tautan navigasi pada setiap komponen.
3. Periksa alamat gambar dan aset yang ditulis secara langsung.
4. Jalankan `npm run build` untuk memastikan proses build berhasil.
5. Periksa hasil website dan gunakan Developer Tools pada browser untuk menemukan permintaan berkas yang menghasilkan error 404.
6. Setelah deploy, buka kembali halaman utama dan beberapa halaman internal melalui alamat publikasi.

Satu hal yang perlu diingat: keberhasilan proses build belum tentu menjamin seluruh tautan yang ditulis secara manual sudah benar. Karena itu, pemeriksaan pada website hasil publikasi tetap diperlukan.

## Memahami Lingkungan adalah Bagian dari Belajar Pemrograman

Ketika sebuah website tidak berjalan sebagaimana mestinya, kita mungkin tergoda untuk langsung mengganti kode atau mencoba berbagai konfigurasi.

Namun, persoalan tersebut kadang bukan terletak pada komponen atau logika program. Bisa jadi, kita belum memahami lingkungan tempat program tersebut dijalankan.

Website memiliki konteks alamat, jalur berkas, konfigurasi, dan lingkungan publikasi. Semuanya saling berhubungan.

Dari pengalaman membangun website menggunakan Astro dan GitHub Pages, saya belajar bahwa memahami satu konsep kecil seperti `base` dapat membantu kita memahami cara kerja sebuah aplikasi web secara lebih menyeluruh.

Belajar pemrograman bukan hanya tentang menulis kode yang berhasil dijalankan. Kita juga perlu memahami mengapa kode tersebut bekerja, di mana ia dijalankan, dan bagaimana ia berinteraksi dengan lingkungan di sekitarnya.

Sebab, sebuah program yang baik bukan hanya program yang berjalan di komputer pembuatnya, melainkan juga program yang dapat bekerja sebagaimana mestinya ketika digunakan di lingkungan yang dituju.

## Referensi

- [Astro Documentation — Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/)
- [Astro Documentation — Environment Variables](https://docs.astro.build/en/guides/environment-variables/)
- [GitHub Docs — What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
