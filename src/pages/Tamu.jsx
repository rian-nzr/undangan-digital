import React, { useState } from 'react';

const Tamu = () => {
  const [guestName, setGuestName] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');

  const handleGenerateMessage = () => {
    if (!guestName.trim()) {
      alert('Silakan masukkan nama tamu terlebih dahulu.');
      return;
    }

    const baseUrl = window.location.origin;
    const invitationLink = `${baseUrl}?to=${encodeURIComponent(guestName)}`;

    // Ganti dengan nama mempelai yang sebenarnya
    const namaMempelaiPria = "Romeo";
    const namaMempelaiWanita = "Juliet";

    const message = `Assalamualaikum warahmatullahi wabarakatuh.

Dengan hormat, izinkan saya mengundang Bapak/Ibu/Saudara/i ${guestName} untuk menghadiri acara pernikahan kami:

${namaMempelaiPria} & ${namaMempelaiWanita}

Untuk info selengkapnya dari acara, silahkan kunjungi link berikut ini :

${invitationLink}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Wassalamualaikum warahmatullahi wabarakatuh.`;

    setGeneratedMessage(message);
  };

  const handleCopyMessage = () => {
    if (!generatedMessage) {
      alert('Tidak ada pesan untuk disalin. Buat pesan terlebih dahulu.');
      return;
    }
    navigator.clipboard.writeText(generatedMessage)
      .then(() => {
        alert('Pesan berhasil disalin ke clipboard!');
      })
      .catch(err => {
        console.error('Gagal menyalin pesan: ', err);
        alert('Gagal menyalin pesan.');
      });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Generator Pesan Undangan</h1>
      
      <label htmlFor="guestName">Nama Tamu:</label>
      <input
        type="text"
        id="guestName"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        placeholder="Contoh: Budi dan Keluarga"
        style={{ width: '100%', marginBottom: '10px', padding: '10px', boxSizing: 'border-box' }}
      />

      <button onClick={handleGenerateMessage} style={{ width: '100%', marginBottom: '10px', padding: '10px' }}>
        Buat Pesan Undangan
      </button>

      {generatedMessage && (
        <>
          <label htmlFor="guestMessage">Pesan Undangan:</label>
          <textarea
            id="guestMessage"
            value={generatedMessage}
            readOnly
            style={{ width: '100%', height: '250px', marginBottom: '10px', padding: '10px', boxSizing: 'border-box' }}
          />
          <button onClick={handleCopyMessage} style={{ width: '100%', padding: '10px' }}>
            Salin Pesan
          </button>
        </>
      )}
    </div>
  );
};

export default Tamu;
