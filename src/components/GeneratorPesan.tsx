import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const GeneratorPesan = () => {
  const [guestName, setGuestName] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleGenerateMessage = () => {
    if (!guestName.trim()) {
      alert('Silakan masukkan nama tamu terlebih dahulu.');
      return;
    }

    const baseUrl = window.location.origin;
    const invitationLink = `${baseUrl}?to=${encodeURIComponent(guestName)}`;

    const namaMempelaiPria = "Afrizal";
    const namaMempelaiWanita = "Maida Ulfa";

    const message = `Assalamualaikum warahmatullahi wabarakatuh.

Dengan hormat, izinkan saya mengundang Bapak/Ibu/Saudara/i ${guestName} untuk menghadiri acara pernikahan kami:

${namaMempelaiPria} & ${namaMempelaiWanita}

Untuk info selengkapnya dari acara, silahkan kunjungi link berikut ini :

${invitationLink}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Wassalamualaikum warahmatullahi wabarakatuh.`;

    setGeneratedMessage(message);
    setIsCopied(false); // Reset status copy saat pesan baru dibuat
  };

  const handleCopyMessage = () => {
    if (!generatedMessage) {
      alert('Tidak ada pesan untuk disalin. Buat pesan terlebih dahulu.');
      return;
    }
    navigator.clipboard.writeText(generatedMessage)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset setelah 2 detik
      })
      .catch(err => {
        console.error('Gagal menyalin pesan: ', err);
        alert('Gagal menyalin pesan.');
      });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleExportToCsv = () => {
    if (!uploadedFile) {
      alert("Silakan pilih file .txt terlebih dahulu.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      const names = fileContent.split('\n').filter(name => name.trim() !== '');

      if (names.length === 0) {
        alert("File kosong atau tidak berisi nama yang valid.");
        return;
      }

      const baseUrl = window.location.origin;
      let csvContent = "Nama Tamu,Link Undangan,Pesan Lengkap\n";

      const namaMempelaiPria = "Afrizal";
      const namaMempelaiWanita = "Maida Ulfa";

      names.forEach(name => {
        const trimmedName = name.trim();
        const invitationLink = `${baseUrl}?to=${encodeURIComponent(trimmedName)}`;
        
        const message = `Assalamualaikum warahmatullahi wabarakatuh.\n\nDengan hormat, izinkan saya mengundang Bapak/Ibu/Saudara/i ${trimmedName} untuk menghadiri acara pernikahan kami:\n\n${namaMempelaiPria} & ${namaMempelaiWanita}\n\nUntuk info selengkapnya dari acara, silahkan kunjungi link berikut ini :\n\n${invitationLink}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\n\nWassalamualaikum warahmatullahi wabarakatuh.`;

        // Escape double quotes in message for CSV
        const escapedMessage = message.replace(/"/g, '""');

        csvContent += `"${trimmedName}","${invitationLink}","${escapedMessage}"\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "daftar_link_undangan.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    reader.readAsText(uploadedFile);
  };

  return (
    <section id="generator-pesan-section" className="w-full px-6 py-20 bg-editorial-ivory text-center border-t border-editorial-charcoal/10">
      <div className="max-w-xl mx-auto">
        {/* === GENERATOR TUNGGAL === */}
        <div>
          <span className="font-script text-3xl text-editorial-accent block mb-1">Bagikan Undangan</span>
          <h2 className="font-serif text-3xl font-light text-editorial-charcoal tracking-wide">Generator Pesan Pribadi</h2>
          <p className="text-xs text-editorial-accent mt-3 leading-relaxed tracking-wide">
            Ketik nama tamu di bawah ini untuk membuat link dan pesan undangan khusus untuk mereka.
          </p>

          <div className="mt-8">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Tulis nama tamu di sini..."
              className="font-serif text-lg font-light text-editorial-charcoal block w-full border-b border-editorial-charcoal/20 bg-transparent py-3 px-2 mb-4 text-center outline-none placeholder:text-editorial-accent/50 focus:border-editorial-accent"
            />
            <button
              onClick={handleGenerateMessage}
              className="bg-editorial-charcoal hover:bg-editorial-accent text-white font-medium text-xs py-3 px-8 tracking-[0.2em] uppercase transition-all duration-300 w-full"
            >
              Buat Pesan
            </button>
          </div>

          {generatedMessage && (
            <div className="mt-8 text-left">
              <textarea
                value={generatedMessage}
                readOnly
                className="w-full h-64 p-4 text-xs bg-white border border-editorial-charcoal/10 font-mono resize-none outline-none"
              />
              <button
                onClick={handleCopyMessage}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-3 px-8 tracking-[0.2em] uppercase transition-all duration-300 w-full flex items-center justify-center gap-2 mt-2"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* === DIVIDER === */}
        <div className="my-20 border-t border-dashed border-editorial-charcoal/20"></div>

        {/* === GENERATOR MASSAL (BULK) === */}
        <div>
          <span className="font-script text-3xl text-editorial-accent block mb-1">Untuk Banyak Tamu</span>
          <h2 className="font-serif text-3xl font-light text-editorial-charcoal tracking-wide">Export ke Excel (CSV)</h2>
          <p className="text-xs text-editorial-accent mt-3 leading-relaxed tracking-wide">
            Upload file .txt yang berisi daftar nama (satu nama per baris) untuk menghasilkan file Excel dengan link undangan unik.
          </p>
          <div className="mt-8">
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-white file:text-editorial-charcoal hover:file:bg-gray-50 border"
            />
            <button
              onClick={handleExportToCsv}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-3 px-8 tracking-[0.2em] uppercase transition-all duration-300 w-full"
            >
              Proses dan Export ke CSV
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
