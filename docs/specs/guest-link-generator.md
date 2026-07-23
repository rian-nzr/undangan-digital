# Desain Fitur: Generator Link Undangan untuk Tamu

## 1. Tujuan

Membuat halaman baru yang memungkinkan pengguna untuk membuat dan menyalin link undangan yang telah dipersonalisasi dengan nama tamu.

## 2. Lokasi

Halaman baru akan dibuat dan dapat diakses melalui route `/tamu`.

## 3. Komponen Antarmuka (UI)

Halaman akan terdiri dari beberapa komponen utama:

- **Input Nama Tamu**: Sebuah kolom input teks (`<input type="text">`) di mana pengguna bisa mengetikkan nama tamu yang ingin diundang.
- **Tombol "Buat Undangan"**: Sebuah tombol (`<button>`) yang ketika diklik akan memicu proses pembuatan pesan undangan.
- **Kotak Teks Pesan Undangan**: Sebuah area teks (`<textarea>`) yang akan menampilkan seluruh pesan undangan yang sudah jadi. Area ini akan bersifat read-only.
- **Tombol "Salin Pesan"**: Sebuah tombol yang berfungsi untuk menyalin seluruh konten dari kotak teks pesan ke clipboard pengguna.

## 4. Alur Kerja Pengguna

1.  Pengguna membuka halaman `/tamu`.
2.  Pengguna memasukkan nama tamu (contoh: "Budi dan Keluarga") ke dalam kolom input yang tersedia.
3.  Pengguna menekan tombol "Buat Undangan".
4.  Aplikasi akan secara dinamis membuat sebuah URL undangan yang menyertakan nama tamu sebagai query parameter (contoh: `https://undangan-kamu.com?to=Budi%20dan%20Keluarga`).
5.  Aplikasi kemudian menampilkan template pesan undangan lengkap di dalam `<textarea>`, di mana nama tamu dan link yang baru dibuat sudah tergabung di dalamnya.
6.  Teks yang akan ditampilkan adalah sebagai berikut:
    ```
    Assalamualaikum warahmatullahi wabarakatuh.

    Dengan hormat, izinkan saya mengundang Bapak/Ibu/Saudara/i [Nama Tamu] untuk menghadiri acara pernikahan kami:

    [Nama Mempelai Pria] & [Nama Mempelai Wanita]

    Untuk info selengkapnya dari acara, silahkan kunjungi link berikut ini :

    [Link Undangan dengan Parameter Nama Tamu]

    Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

    Wassalamualaikum warahmatullahi wabarakatuh.
    ```
7.  Pengguna menekan tombol "Salin Pesan".
8.  Seluruh isi teks dari `<textarea>` akan disalin ke clipboard pengguna.
9.  Aplikasi dapat menampilkan notifikasi singkat (misalnya "Pesan berhasil disalin!") untuk memberikan umpan balik kepada pengguna.

## 5. Implementasi Teknis

-   Fitur ini akan dibangun menggunakan HTML, CSS, dan JavaScript standar.
-   Logika untuk mengambil nama mempelai dan membuat link akan di-handle di sisi klien (menggunakan JavaScript).
-   Fungsi `navigator.clipboard.writeText()` akan digunakan untuk mengimplementasikan fitur "Salin".

Dengan desain ini, pengguna dapat dengan mudah membuat dan menyebarkan undangan yang terasa lebih personal kepada setiap tamu.
