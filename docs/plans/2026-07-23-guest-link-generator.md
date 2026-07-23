# Rencana Implementasi: Generator Link Undangan

**Tujuan:** Membuat halaman baru yang memungkinkan pengguna untuk membuat dan menyalin pesan undangan yang telah dipersonalisasi dengan nama tamu.

**Arsitektur:** Fitur ini akan dibuat sebagai halaman HTML statis baru dengan JavaScript di sisi klien untuk menangani semua logika. Tidak ada perubahan di sisi server.

**Tumpukan Teknologi:** HTML, CSS, JavaScript (Vanilla)

---

### Task 1: Buat File Halaman Baru

- [ ] **Langkah 1: Buat file HTML baru**

  Buat file baru dengan nama `tamu.html` di root direktori proyek.

  **Isi `tamu.html`:**
  ```html
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generator Link Undangan</title>
    <style>
      body { font-family: sans-serif; padding: 20px; }
      .container { max-width: 600px; margin: auto; }
      input, textarea, button { width: 100%; margin-bottom: 10px; padding: 10px; box-sizing: border-box; }
      textarea { height: 250px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Generator Pesan Undangan</h1>
      <label for="guestName">Nama Tamu:</label>
      <input type="text" id="guestName" placeholder="Contoh: Budi dan Keluarga">

      <button id="generateButton">Buat Pesan Undangan</button>

      <label for="guestMessage">Pesan Undangan:</label>
      <textarea id="guestMessage" readonly></textarea>

      <button id="copyButton">Salin Pesan</button>
    </div>

    <script>
      // Logika JavaScript akan ditambahkan di sini
    </script>
  </body>
  </html>
  ```

- [ ] **Langkah 2: Commit perubahan**
  ```bash
  git add tamu.html
  git commit -m "feat: add initial structure for guest link generator page"
  ```

### Task 2: Implementasikan Logika JavaScript

- [ ] **Langkah 1: Tambahkan logika untuk membuat pesan**

  Modifikasi bagian `<script>` di `tamu.html`.

  ```javascript
  const guestNameInput = document.getElementById('guestName');
  const generateButton = document.getElementById('generateButton');
  const guestMessageTextarea = document.getElementById('guestMessage');
  const copyButton = document.getElementById('copyButton');

  // Ganti dengan nama mempelai yang sebenarnya
  const namaMempelaiPria = "Romeo";
  const namaMempelaiWanita = "Juliet";

  generateButton.addEventListener('click', () => {
    const guestName = guestNameInput.value.trim();
    if (!guestName) {
      alert('Silakan masukkan nama tamu terlebih dahulu.');
      return;
    }

    const baseUrl = window.location.origin + window.location.pathname.replace('tamu.html', 'index.html');
    const invitationLink = `${baseUrl}?to=${encodeURIComponent(guestName)}`;

    const message = `Assalamualaikum warahmatullahi wabarakatuh.

Dengan hormat, izinkan saya mengundang Bapak/Ibu/Saudara/i ${guestName} untuk menghadiri acara pernikahan kami:

${namaMempelaiPria} & ${namaMempelaiWanita}

Untuk info selengkapnya dari acara, silahkan kunjungi link berikut ini :

${invitationLink}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Wassalamualaikum warahmatullahi wabarakatuh.`;

    guestMessageTextarea.value = message;
  });
  ```

- [ ] **Langkah 2: Implementasikan fungsi salin**

  Tambahkan kode berikut di dalam tag `<script>` yang sama.

  ```javascript
  copyButton.addEventListener('click', () => {
    if (!guestMessageTextarea.value) {
      alert('Tidak ada pesan untuk disalin. Buat pesan terlebih dahulu.');
      return;
    }
    navigator.clipboard.writeText(guestMessageTextarea.value)
      .then(() => {
        alert('Pesan berhasil disalin ke clipboard!');
      })
      .catch(err => {
        console.error('Gagal menyalin pesan: ', err);
        alert('Gagal menyalin pesan.');
      });
  });
  ```

- [ ] **Langkah 3: Commit perubahan**
  ```bash
  git add tamu.html
  git commit -m "feat: implement guest message generation and copy logic"
  ```
