import React, { useState, useEffect } from "react";
import { MessageSquare, Users, Check, X, HelpCircle, Settings, Download, Trash2, ArrowRight, ExternalLink, Copy } from "lucide-react";
import { GuestbookEntry } from "../types";

interface GuestbookProps {
  adminMode?: boolean;
}

export const Guestbook: React.FC<GuestbookProps> = ({ adminMode = false }) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"Hadir" | "Tidak Hadir" | "Ragu">("Hadir");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Admin section states
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");
  const [copiedScript, setCopiedScript] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Stats
  const stats = {
    total: entries.length,
    hadir: entries.filter(e => e.status === "Hadir").length,
    tidakHadir: entries.filter(e => e.status === "Tidak Hadir").length,
    ragu: entries.filter(e => e.status === "Ragu").length,
  };

  // Pagination logic
  const pageCount = Math.ceil(entries.length / itemsPerPage);
  const paginatedEntries = entries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/guestbook");
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (err) {
      console.error("Gagal memuat buku tamu:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  // Load once on page open. New entries are added to state immediately after submission.
  useEffect(() => {
    fetchEntries();
    if (adminMode) {
      setShowAdmin(true);
    }
  }, [adminMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Mohon masukkan nama Anda.");
      return;
    }
    if (!message.trim()) {
      setError("Mohon berikan ucapan atau doa restu.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, status, message }),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setEntries((prev) => [newEntry, ...prev]);
        setName("");
        setMessage("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const errData = await response.json();
        setError(errData.error || "Gagal mengirim ucapan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === "gayo2026") {
      setIsAdminAuthenticated(true);
      setAdminError("");
    } else {
      setAdminError("Passcode salah! Silakan coba lagi.");
    }
  };

  const handleSaveSettings = () => {
    setAdminSuccess("");
    setAdminError("Pada Vercel, URL webhook harus diatur melalui Environment Variables, bukan dari halaman undangan.");
  };

  const handleClearGuestbook = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus SEMUA isi buku tamu? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }
    setAdminError("");
    setAdminSuccess("");
    try {
      const response = await fetch("/api/admin/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: adminPasscode }),
      });

      if (response.ok) {
        setEntries([]);
        setAdminSuccess("Buku tamu berhasil dibersihkan!");
      } else {
        const errData = await response.json();
        setAdminError(errData.error || "Gagal membersihkan buku tamu.");
      }
    } catch (err) {
      setAdminError("Gagal membersihkan.");
    }
  };

  const appsScriptCode = `const SHEET_NAME = "Ucapan";
const WEBHOOK_TOKEN = "ISI_TOKEN_SAMA_DENGAN_VERCEL";

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Tanggal", "Nama", "Kehadiran", "Ucapan"]);
  }
  return sheet;
}

function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function authorized(e) {
  return !WEBHOOK_TOKEN || (e.parameter && e.parameter.token === WEBHOOK_TOKEN);
}

function doPost(e) {
  if (!authorized(e)) return response({ success: false, error: "Tidak diizinkan" });

  const data = JSON.parse(e.postData.contents);
  getSheet().appendRow([new Date(data.timestamp), data.name, data.status, data.message]);
  return response({ success: true });
}

function doGet(e) {
  if (!authorized(e)) return response({ success: false, error: "Tidak diizinkan" });
  if (e.parameter.action !== "entries") return response({ success: true });

  const rows = getSheet().getDataRange().getValues().slice(1).reverse();
  const entries = rows.map(function(row) {
    const date = new Date(row[0]);
    return {
      id: String(date.getTime()) + "-" + row[1],
      timestamp: date.toISOString(),
      name: row[1],
      status: row[2],
      message: row[3]
    };
  });

  return response(entries);
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div id="guestbook-component" className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Decorative Title */}
      <div className="text-center mb-8">
        <span className="font-script text-4xl text-editorial-accent block mb-1">Buku Tamu</span>
        <h2 className="font-serif text-3xl font-medium text-editorial-charcoal tracking-tight">Ucapan & Doa Restu</h2>
        <p className="text-xs text-editorial-accent max-w-sm mx-auto mt-2 leading-relaxed">
          Berikan doa terbaik Anda untuk kedua mempelai dan bagikan momen kebahagiaan bersama kami.
        </p>
      </div>

      {/* RSVP Stats Dashboard */}
      <div id="rsvp-stats-grid" className="grid grid-cols-4 gap-2 mb-6 text-center">
        <div className="bg-white border border-editorial-charcoal/10 p-2.5">
          <Users className="w-4 h-4 mx-auto text-editorial-charcoal mb-1" />
          <span className="block font-mono text-lg font-light text-editorial-charcoal leading-none">{stats.total}</span>
          <span className="text-[9px] uppercase tracking-wider text-editorial-accent font-medium">Total</span>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100/40 p-2.5">
          <Check className="w-4 h-4 mx-auto text-emerald-700 mb-1" />
          <span className="block font-mono text-lg font-bold text-emerald-800 leading-none">{stats.hadir}</span>
          <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-medium">Hadir</span>
        </div>
        <div className="bg-rose-50/50 border border-rose-100/40 p-2.5">
          <X className="w-4 h-4 mx-auto text-rose-700 mb-1" />
          <span className="block font-mono text-lg font-bold text-rose-800 leading-none">{stats.tidakHadir}</span>
          <span className="text-[9px] uppercase tracking-wider text-rose-600 font-medium">Absen</span>
        </div>
        <div className="bg-amber-50/50 border border-amber-100/40 p-2.5">
          <HelpCircle className="w-4 h-4 mx-auto text-amber-700 mb-1" />
          <span className="block font-mono text-lg font-bold text-amber-800 leading-none">{stats.ragu}</span>
          <span className="text-[9px] uppercase tracking-wider text-amber-600 font-medium">Ragu</span>
        </div>
      </div>

      {/* RSVP Form and Message Scroll Area */}
      <div className="space-y-6">
        {/* Guestbook Form Card */}
        <div className="bg-white border border-editorial-charcoal/10 p-6 relative">
          <form id="guestbook-rsvp-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="guestbook-name-input" className="block text-xs font-semibold text-editorial-charcoal uppercase tracking-[0.15em] mb-2">
                Nama Lengkap
              </label>
              <input
                id="guestbook-name-input"
                type="text"
                placeholder="Masukkan nama lengkap Anda..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-editorial-ivory border border-editorial-charcoal/10 focus:border-editorial-charcoal rounded-none px-4 py-3 text-sm text-editorial-charcoal placeholder:text-editorial-accent/50 outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-editorial-charcoal uppercase tracking-[0.15em] mb-2.5">
                Konfirmasi Kehadiran
              </label>
              <div id="rsvp-status-selector" className="grid grid-cols-3 gap-2">
                {[
                  { value: "Hadir", label: "Saya Hadir", bg: "bg-editorial-charcoal", text: "text-white" },
                  { value: "Tidak Hadir", label: "Berhalangan", bg: "bg-editorial-charcoal", text: "text-white" },
                  { value: "Ragu", label: "Masih Ragu", bg: "bg-editorial-charcoal", text: "text-white" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatus(option.value as any)}
                    className={`px-3 py-3 border text-xs font-medium cursor-pointer text-center transition-all duration-300 rounded-none ${
                      status === option.value
                        ? `${option.bg} ${option.text} border-transparent`
                        : "bg-white border-editorial-charcoal/10 text-editorial-charcoal hover:bg-editorial-ivory"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="guest-message-input" className="block text-xs font-semibold text-editorial-charcoal uppercase tracking-[0.15em] mb-2">
                Ucapan, Doa Restu & Pesan Hangat
              </label>
              <textarea
                id="guest-message-input"
                rows={4}
                placeholder="Tulis ucapan selamat, doa restu, atau pesan hangat Anda di sini..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-editorial-ivory border border-editorial-charcoal/10 focus:border-editorial-charcoal rounded-none px-4 py-3 text-sm text-editorial-charcoal placeholder:text-editorial-accent/50 outline-none transition-all duration-200 resize-none"
              />
            </div>

            {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
            {success && (
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2">
                Terima kasih! Ucapan Anda telah disimpan dan dimuat secara real-time. 🙏
              </p>
            )}

            <button
              id="submit-rsvp-button"
              type="submit"
              disabled={loading}
              className="w-full bg-editorial-charcoal hover:bg-editorial-accent text-white font-medium text-xs py-3.5 px-4 tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed rounded-none"
            >
              {loading ? "Mengirim..." : "Kirim Ucapan"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Message Feed Card */}
        <div className="bg-white border border-editorial-charcoal/10 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-editorial-charcoal/10">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-editorial-charcoal flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-editorial-accent" />
              Aliran Ucapan ({entries.length})
            </span>
            <span className="text-[9px] uppercase tracking-wider bg-editorial-ivory text-editorial-charcoal border border-editorial-charcoal/10 px-2.5 py-0.5 font-medium animate-pulse">
              Dimuat saat halaman dibuka
            </span>
          </div>

          {fetchLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-editorial-charcoal mx-auto" />
              <p className="text-xs text-editorial-accent mt-3">Memuat ucapan tamu...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-10 text-center text-editorial-accent text-xs italic">
              Belum ada ucapan. Jadilah yang pertama memberikan doa restu! ✨
            </div>
          ) : (
            <div id="guestbook-scroll-box" className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {paginatedEntries.map((entry) => (
                <div
                  key={entry.id}
                  id={`guestbook-entry-${entry.id}`}
                  className="bg-editorial-ivory/50 hover:bg-editorial-ivory border border-editorial-charcoal/10 p-4 transition-all duration-200 relative group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-editorial-charcoal">
                        {entry.name}
                      </h4>
                      <span className="text-[9px] text-editorial-accent">
                        {new Date(entry.timestamp).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* RSVP Badge */}
                    <span
                      className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 border ${
                        entry.status === "Hadir"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : entry.status === "Tidak Hadir"
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {entry.status === "Hadir" ? "Hadir" : entry.status === "Tidak Hadir" ? "Absen" : "Ragu"}
                    </span>
                  </div>
                  <p className="text-xs text-editorial-charcoal leading-relaxed break-words whitespace-pre-line font-serif">
                    {entry.message}
                  </p>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination Controls */}
          {pageCount > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-editorial-charcoal/10">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-xs font-semibold uppercase tracking-wider px-4 py-2 bg-white border border-editorial-charcoal/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <span className="text-xs text-editorial-accent">
                Halaman {currentPage} dari {pageCount}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                disabled={currentPage === pageCount}
                className="text-xs font-semibold uppercase tracking-wider px-4 py-2 bg-white border border-editorial-charcoal/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          )}
        </div>

        {/* Floating Admin Settings Trigger */}
        {adminMode && (
          <div className="flex justify-center pt-2">
            <button
              id="admin-panel-toggle"
              onClick={() => setShowAdmin(!showAdmin)}
              className="text-[10px] uppercase tracking-[0.15em] font-semibold text-editorial-accent hover:text-editorial-charcoal flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              {showAdmin ? "Tutup Pengaturan Backend" : "Pengaturan Google Sheets (Developer)"}
            </button>
          </div>
        )}

        {/* Admin Settings Panel Block */}
        {showAdmin && (
          <div className="bg-editorial-charcoal text-editorial-ivory rounded-none p-5 md:p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-lg font-medium border-b border-white/10 pb-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-editorial-accent" />
              Backend & Google Sheets Admin
            </h3>

            {!isAdminAuthenticated ? (
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  Masukkan passcode administrator pernikahan untuk mengonfigurasi sinkronisasi Google Sheets secara real-time.
                </p>
                <div className="flex gap-2">
                  <input
                    id="admin-passcode-input"
                    type="password"
                    placeholder="Default passcode: gayo2026"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    className="flex-1 bg-black/30 border border-white/10 rounded-none px-4 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-editorial-accent"
                  />
                  <button
                    id="admin-login-button"
                    type="submit"
                    className="bg-editorial-ivory hover:bg-gray-200 text-editorial-charcoal font-semibold px-4 py-2 text-xs transition-colors cursor-pointer rounded-none"
                  >
                    Masuk
                  </button>
                </div>
                {adminError && <p className="text-xs font-semibold text-rose-400">{adminError}</p>}
              </form>
            ) : (
              <div className="space-y-4 text-xs text-gray-200">
                {/* Save Sheet Webhook URL */}
                <div className="space-y-2">
                  <label htmlFor="sheets-url-input" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Status Google Sheets di Vercel
                  </label>
                  <input
                    id="sheets-url-input"
                    type="url"
                    placeholder="Atur GOOGLE_SHEETS_WEBHOOK_URL di Vercel" disabled
                    value=""
                    className="w-full bg-black/30 border border-white/10 rounded-none px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none focus:border-editorial-accent"
                  />
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Masukkan URL Web App Google Apps Script sebagai Environment Variable GOOGLE_SHEETS_WEBHOOK_URL di Vercel. Serverless Function akan meneruskan setiap ucapan ke URL tersebut.
                  </p>
                </div>

                {/* Operations */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    id="save-settings-button"
                    onClick={handleSaveSettings}
                    className="bg-editorial-ivory hover:bg-gray-200 text-editorial-charcoal font-semibold py-2 px-4 text-xs transition-colors cursor-pointer rounded-none"
                  >
                    Info Konfigurasi Vercel
                  </button>
                  <a
                    id="export-csv-button"
                    href="/api/admin/export"
                    download
                    className="bg-black/20 hover:bg-black/30 text-white font-semibold py-2 px-4 text-xs border border-white/10 flex items-center gap-1 rounded-none"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh CSV Buku Tamu
                  </a>
                  <button
                    id="clear-guestbook-button"
                    onClick={handleClearGuestbook}
                    className="bg-rose-950/80 hover:bg-rose-900/90 text-rose-200 border border-rose-900 font-semibold py-2 px-3 text-xs flex items-center gap-1 cursor-pointer ml-auto rounded-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Wipe Buku Tamu
                  </button>
                </div>

                {adminSuccess && <p className="text-xs font-semibold text-emerald-400">{adminSuccess}</p>}
                {adminError && <p className="text-xs font-semibold text-rose-400">{adminError}</p>}

                {/* Google Apps Script Integration Guide */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <span className="font-serif text-sm font-semibold text-white flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4 text-editorial-accent" />
                    Cara Menghubungkan Google Sheets:
                  </span>
                  <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-gray-300">
                    <li>Buat file <b>Google Sheets</b> baru.</li>
                    <li>Klik menu <b>Ekstensi</b> → Pilih <b>Apps Script</b>.</li>
                    <li>Hapus kode bawaan dan tempel kode berikut:</li>
                  </ol>

                  {/* Copy Code snippet */}
                  <div className="relative bg-black/40 rounded-none p-3 border border-white/10 font-mono text-[10px] text-gray-400 select-all whitespace-pre overflow-x-auto max-h-40">
                    <button
                      id="copy-script-button"
                      type="button"
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-black/30 text-white rounded-none cursor-pointer"
                      title="Salin Kode"
                    >
                      {copiedScript ? "Disalin!" : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {appsScriptCode}
                  </div>

                  <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-gray-300" start={4}>
                    <li>Klik ikon <b>Simpan (Save)</b> di atas editor.</li>
                    <li>Klik <b>Terapkan (Deploy)</b> → Pilih <b>Penerapan Baru (New Deployment)</b>.</li>
                    <li>Pilih Jenis Penerapan: <b>Aplikasi Web (Web App)</b>.</li>
                    <li>Konfigurasikan:
                      <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                        <li><b>Jalankan sebagai (Execute as):</b> Saya (email Anda).</li>
                        <li><b>Siapa yang memiliki akses (Who has access):</b> Siapa saja (Anyone).</li>
                      </ul>
                    </li>
                    <li>Klik <b>Terapkan (Deploy)</b>, setujui izin jika diminta Google.</li>
                    <li>Salin URL aplikasi web yang berakhiran <b>/exec</b>, lalu tambahkan sebagai Environment Variable <b>GOOGLE_SHEETS_WEBHOOK_URL</b> di Vercel.</li>
                    <li>Tambahkan Environment Variable <b>GOOGLE_SHEETS_TOKEN</b> dengan nilai yang sama seperti <b>WEBHOOK_TOKEN</b> pada kode di atas.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
