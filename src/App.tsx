import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  MapPin, 
  Heart, 
  Gift, 
  Check, 
  Copy, 
  Volume2, 
  VolumeX, 
  Compass, 
  Mail, 
  ChevronDown 
} from "lucide-react";
import { GayoLogo } from "./components/GayoLogo";
import { CoffeeBranch, CoffeeBean, VintageWave } from "./components/CoffeeDecoration";
import { Countdown } from "./components/Countdown";
import { AudioPlayer } from "./components/AudioPlayer";
import { Guestbook } from "./components/Guestbook";
import { Gallery } from "./components/Gallery";
import { GeneratorPesan } from "./components/GeneratorPesan";

export default function App() {
  // Page states
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [guestName, setGuestName] = useState("Tamu Undangan");
  const [currentPage, setCurrentPage] = useState("invitation");
  const invitationAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Clipboard copy feedback states
  const [copiedBSI, setCopiedBSI] = useState(false);
  const [copiedBankAceh, setCopiedBankAceh] = useState(false);

  // Parse URL guest name (e.g. ?to=Bapak+John+Doe)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to") || params.get("recipient") || params.get("kepada");
    if (to) {
      setGuestName(to.replace(/\+/g, " "));
    }

    const page = params.get("page");
    if (page === "generator") {
      setCurrentPage("generator");
      setIsCoverOpen(true); // Langsung buka halaman, lewati cover
    } else if (page === "admin") {
      setCurrentPage("admin");
      setIsCoverOpen(true); // Langsung buka halaman, lewati cover
    }
  }, []);

  // Handle open cover
  const handleOpenInvitation = () => {
    setIsCoverOpen(true);
    setIsPlayingMusic(true);
    invitationAudioRef.current?.play().catch(() => {
      setIsPlayingMusic(false);
    });
    
    // Smooth scroll down slightly to main screen
    setTimeout(() => {
      document.getElementById("mempelai-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const copyToClipboard = (text: string, type: "BSI" | "BankAceh") => {
    navigator.clipboard.writeText(text);
    if (type === "BSI") {
      setCopiedBSI(true);
      setTimeout(() => setCopiedBSI(false), 2000);
    } else {
      setCopiedBankAceh(true);
      setTimeout(() => setCopiedBankAceh(false), 2000);
    }
  };

  // Google Calendar integration url
  const gCalUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Resepsi+Pernikahan+Afrizal+%26+Maida+Ulfa+(Tung+Dara+Baro)&dates=20260905T030000Z/20260905T100000Z&details=Dengan+memohon+ridha+Allah+SWT%2C+kami+bermaksud+menyelenggarakan+resepsi+pernikahan+anak+kami+Insya+Allah+akan+kami+laksanakan+pada+Sabtu%2C+5+September+2026.&location=Desa+lingka+kuta%2C+Kec.+gandapura%2C+Kab%2C+Bireuen%2C+Aceh";

  if (currentPage === "generator") {
    return <GeneratorPesan />;
  }

  if (currentPage === "admin") {
    return <Guestbook adminMode={true} />;
  }

  return (
    <div id="digital-invitation-root" className="min-h-screen bg-editorial-ivory flex flex-col items-center select-none text-editorial-charcoal overflow-x-hidden antialiased">
      
      {/* Floating Audio Widget */}
      <AudioPlayer
        isPlaying={isPlayingMusic}
        setIsPlaying={setIsPlayingMusic}
        audioRef={invitationAudioRef}
        isVisible={isCoverOpen}
      />

      <AnimatePresence mode="wait">
        {/* FULL SCREEN ENTRANCE COVER (STOPS SCROLLING) */}
        {!isCoverOpen && (
          <motion.div
            key="cover-screen"
            id="invitation-cover"
            className="fixed inset-0 z-50 flex flex-col justify-between items-center bg-editorial-ivory p-8 text-center select-none overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100vh" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Background hairline lines in cover */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="absolute top-12 left-12 w-32 h-32 border-t border-l border-editorial-charcoal/20" />
              <div className="absolute top-12 right-12 w-32 h-32 border-t border-r border-editorial-charcoal/20" />
              <div className="absolute bottom-12 left-12 w-32 h-32 border-b border-l border-editorial-charcoal/20" />
              <div className="absolute bottom-12 right-12 w-32 h-32 border-b border-r border-editorial-charcoal/20" />
              {/* Hairline grid lines */}
              <div className="absolute inset-x-12 top-12 border-t border-editorial-charcoal/10" />
              <div className="absolute inset-x-12 bottom-12 border-b border-editorial-charcoal/10" />
              <div className="absolute inset-y-12 left-12 border-l border-editorial-charcoal/10" />
              <div className="absolute inset-y-12 right-12 border-r border-editorial-charcoal/10" />
            </div>

            {/* Delicate Branch Decorations */}
            <CoffeeBranch className="absolute -top-12 -left-12 w-48 h-48 rotate-45 opacity-25" />
            <CoffeeBranch className="absolute -bottom-12 -right-12 w-48 h-48 -rotate-135 opacity-25" />
            
            {/* Scattered coffee beans (delicate outline sketches) */}
            <div className="absolute top-1/4 right-16 opacity-15">
              <CoffeeBean size={26} rotate={15} />aaa
            </div>
            <div className="absolute bottom-1/4 left-16 opacity-15">
              <CoffeeBean size={30} rotate={110} />
            </div>

            {/* Header branding */}
            <motion.div 
              className="mt-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <GayoLogo />
            </motion.div>

            {/* Names & Main Cover info */}
            <div className="max-w-md w-full flex flex-col items-center">
              <motion.span 
                className="text-[10px] uppercase tracking-[0.4em] font-medium text-editorial-accent block mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Undangan Pernikahan
              </motion.span>
              
              <motion.h1 
                className="font-serif text-4xl md:text-5xl font-light text-editorial-charcoal tracking-wide"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Afrizal <span className="font-script text-5xl block my-3 text-editorial-accent">&</span> Maida Ulfa
              </motion.h1>

              <motion.div 
                className="my-5 flex items-center justify-center gap-2 text-[10px] font-medium tracking-[0.25em] text-editorial-charcoal border-y border-editorial-charcoal/10 py-2.5 px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span>SABTU, 5 SEPTEMBER 2026</span>
              </motion.div>

              {/* Guest name display box */}
              <motion.div 
                id="guest-invitation-box"
                className="mt-8 bg-white border border-editorial-charcoal/10 rounded-none p-6 w-full text-center relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <span className="text-[9px] uppercase tracking-[0.25em] text-editorial-accent block mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</span>
                <input
                  id="guest-name-input"
                  type="text"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  aria-label="Nama tamu undangan"
                  placeholder="Masukkan nama tamu"
                  className="font-serif text-xl font-light text-editorial-charcoal block w-full border-b border-editorial-charcoal/10 bg-transparent pb-3 mb-3 text-center outline-none placeholder:text-editorial-accent/50 focus:border-editorial-accent"
                />
                <p className="text-[9px] text-editorial-accent/80 tracking-wider">
                  *Tanpa Mengurangi Rasa Hormat, Kami Mengundang Anda Untuk Hadir.
                </p>
              </motion.div>
            </div>

            {/* Open trigger */}
            <motion.div 
              className="mb-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <button
                id="open-invitation-button"
                onClick={handleOpenInvitation}
                className="bg-editorial-charcoal hover:bg-editorial-accent text-white font-medium text-xs py-4 px-8 tracking-[0.2em] uppercase border border-editorial-charcoal transition-all duration-300 flex items-center gap-3 cursor-pointer rounded-none hover:shadow-lg"
              >
                <Mail className="w-4 h-4 stroke-[1.5]" />
                Buka Undangan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN INVITATION CONTENT (SCROLLABLE) */}
      {isCoverOpen && (
        <div id="main-invitation-content" className="w-full max-w-4xl flex flex-col items-center bg-editorial-ivory relative">
          
          {/* Section 1: Hero / Welcome */}
          <section id="hero-welcome-section" className="min-h-screen w-full flex flex-col justify-center items-center px-8 py-24 text-center relative overflow-hidden border-b border-editorial-charcoal/10 bg-[#F4F2EB]">
            {/* Elegant Background patterns */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <VintageWave className="absolute top-1/4 left-0 w-full" />
              <VintageWave className="absolute bottom-1/4 left-0 w-full rotate-180" />
            </div>

            <CoffeeBranch className="absolute -top-6 -left-6 w-56 h-56 rotate-45 opacity-20" />
            <CoffeeBranch className="absolute top-1/3 -right-6 w-48 h-48 -rotate-90 opacity-20" />
            <CoffeeBranch className="absolute -bottom-6 -left-6 w-52 h-52 -rotate-45 opacity-20" />

            {/* Scattered Coffee Beans floating */}
            <div className="absolute top-20 right-16 opacity-10">
              <CoffeeBean size={24} rotate={35} />
            </div>
            <div className="absolute bottom-32 left-10 opacity-10">
              <CoffeeBean size={30} rotate={115} />
            </div>
            <div className="absolute bottom-20 right-10 opacity-10">
              <CoffeeBean size={26} rotate={75} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-6 max-w-lg z-10"
            >
              <GayoLogo className="mb-4" />
              
              <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-editorial-accent block">
                Walimatul 'Ursy
              </span>
              
              <h1 className="font-serif text-3xl md:text-4xl font-light text-editorial-charcoal tracking-wide leading-none">
                Undangan Pernikahan
              </h1>
              
              <div className="inline-block px-5 py-2 border border-editorial-charcoal/25 bg-editorial-ivory font-serif text-xs font-medium text-editorial-charcoal italic my-3 tracking-wider">
                "Tung Dara Baro"
              </div>

              {/* Romantic Quranic / Coffee Quote */}
              <div id="wedding-quote-box" className="p-8 bg-editorial-ivory border border-editorial-charcoal/10 rounded-none mt-6 relative text-center">
                <Heart className="w-4 h-4 text-editorial-accent mx-auto mb-4 animate-pulse" />
                <p className="font-serif text-[13px] italic text-editorial-charcoal leading-relaxed">
                  "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
                </p>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-editorial-accent font-bold mt-3">
                  — QS. Ar-Rum: 21 —
                </span>

                <div className="border-t border-editorial-charcoal/10 mt-5 pt-4">
                  <p className="font-serif text-xs italic text-editorial-accent leading-relaxed">
                    "Cinta itu seperti secangkir kopi Gayo, hangat, pekat, dan memberikan kebahagiaan dalam setiap langkah kehidupan."
                  </p>
                </div>
              </div>

              {/* Large central ampersand decoration */}
              <div className="pt-12 flex flex-col items-center">
                <span className="font-script text-6xl text-editorial-charcoal/80 leading-none block">
                  Afrizal & Maida
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-editorial-accent block mt-4">
                  Gulir ke bawah untuk detail acara
                </span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="mt-3 text-editorial-accent cursor-pointer"
                  onClick={() => document.getElementById("mempelai-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <ChevronDown className="w-5 h-5 mx-auto" />
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* Section 2: Mempelai (Bride & Groom) */}
          <section id="mempelai-section" className="w-full px-6 py-24 bg-editorial-ivory relative overflow-hidden border-t border-b border-editorial-charcoal/10 flex flex-col items-center">
            
            {/* Background elements */}
            <div className="absolute top-10 right-0 opacity-5 pointer-events-none">
              <svg width="400" height="400" viewBox="0 0 100 100" fill="none" stroke="#2d2d2d">
                <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="38" />
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-xl mb-16"
            >
              <span className="font-script text-3xl text-editorial-accent block mb-1">Mempelai Bahagia</span>
              <h2 className="font-serif text-3xl font-light text-editorial-charcoal tracking-wide">Assalamualaikum Wr. Wb.</h2>
              <p className="text-xs text-editorial-accent mt-4 leading-relaxed tracking-wide">
                Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud untuk menyelenggarakan resepsi pernikahan anak-anak kami, yang Insya Allah akan dilaksanakan pada:
              </p>
            </motion.div>

            {/* Mempelai Cards (Afrizal & Maida Ulfa) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl px-2">
              
              {/* Groom Card: Afrizal */}
              <motion.div
                id="mempelai-pria"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white border border-editorial-charcoal/10 rounded-none p-8 text-center flex flex-col justify-between items-center relative overflow-hidden group hover:border-editorial-charcoal/30 transition-all duration-300"
              >
                {/* Hairline top decoration */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-editorial-charcoal/20" />
                
                {/* Visual Portrait frame representing minimal editorial layout */}
                <div className="w-44 h-56 bg-[#F4F2EB] border border-editorial-charcoal/10 flex items-center justify-center mb-6 relative overflow-hidden shadow-xs">
                  <img 
                    src="/1.jpg" 
                    alt="Afrizal" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-2 border border-dashed border-white/20 pointer-events-none" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-3xl font-light text-editorial-charcoal">Afrizal</h3>
                  <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-editorial-accent block">
                    Mempelai Pria
                  </span>
                  
                  <div className="border-t border-editorial-charcoal/10 pt-4 mt-4">
                    <p className="text-[10px] uppercase tracking-wider text-editorial-accent">Putra tercinta dari keluarga:</p>
                    <p className="font-serif text-base font-medium text-editorial-charcoal mt-1.5">Alm. Tgk Zuhdi</p>
                    <p className="font-serif text-sm text-editorial-accent">dan Ibu Azizah</p>
                  </div>
                </div>
              </motion.div>

              {/* Bride Card: Maida Ulfa */}
              <motion.div
                id="mempelai-wanita"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white border border-editorial-charcoal/10 rounded-none p-8 text-center flex flex-col justify-between items-center relative overflow-hidden group hover:border-editorial-charcoal/30 transition-all duration-300"
              >
                {/* Hairline top decoration */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-editorial-charcoal/20" />
                
                {/* Visual Portrait frame */}
                <div className="w-44 h-56 bg-[#F4F2EB] border border-editorial-charcoal/10 flex items-center justify-center mb-6 relative overflow-hidden shadow-xs">
                  <img 
                    src="2.jpg" 
                    alt="Maida Ulfa" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-2 border border-dashed border-white/20 pointer-events-none" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-3xl font-light text-editorial-charcoal">Maida Ulfa</h3>
                  <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-editorial-accent block">
                    Mempelai Wanita
                  </span>
                  
                  <div className="border-t border-editorial-charcoal/10 pt-4 mt-4">
                    <p className="text-[10px] uppercase tracking-wider text-editorial-accent">Putri tercinta dari keluarga:</p>
                    <p className="font-serif text-base font-medium text-editorial-charcoal mt-1.5">Alm.M YUSUF </p>
                    <p className="font-serif text-sm text-editorial-accent">dan Ibu Rukiah</p>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Editorial connection message */}
            <div className="mt-14 text-center max-w-sm">
              <p className="font-serif text-xs italic text-editorial-accent leading-relaxed">
                "Seperti racikan kopi Gayo Zenith yang penuh ketelitian, demikian pula dua takdir dipersatukan dalam ikatan pernikahan yang agung."
              </p>
            </div>
          </section>

          {/* Section 3: Event Details & Countdown */}
          <section id="waktu-section" className="w-full px-6 py-24 bg-[#F4F2EB] relative overflow-hidden flex flex-col items-center border-b border-editorial-charcoal/10">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full">
              <VintageWave />
            </div>

            <CoffeeBranch className="absolute -bottom-10 -right-10 w-48 h-48 -rotate-135 opacity-20" />
            <CoffeeBranch className="absolute top-1/4 -left-10 w-40 h-40 rotate-45 opacity-20" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-xl mb-8"
            >
              <span className="font-script text-3xl text-editorial-accent block mb-1">Momen Kebahagiaan</span>
              <h2 className="font-serif text-3xl font-light text-editorial-charcoal tracking-wide">Hari & Waktu Acara</h2>
              <p className="text-xs text-editorial-accent mt-3 leading-relaxed tracking-wide">
                Kami sangat mengharapkan kehadiran Bapak/Ibu/Saudara/i untuk menyaksikan dan memberikan doa restu di hari bahagia kami.
              </p>
            </motion.div>

            {/* Countdown widget */}
            <Countdown targetDateStr="2026-09-05T10:00:00" />

            {/* Wedding Card Details */}
            <motion.div
              id="event-detail-card"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-xl bg-white border border-editorial-charcoal/10 rounded-none p-8 md:p-10 mt-8 text-center relative"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-editorial-charcoal/30" />
              
              <div className="flex justify-center mb-6">
                <Calendar className="w-10 h-10 text-editorial-charcoal bg-[#F4F2EB] p-2 border border-editorial-charcoal/10 rounded-none" />
              </div>

              <h3 className="font-serif text-2xl font-light text-editorial-charcoal tracking-wide mb-6">
                Resepsi Pernikahan (Tung Dara Baro)
              </h3>

              <div id="resep-details-list" className="space-y-4 text-xs text-editorial-charcoal max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-2 border-b border-editorial-charcoal/10 pb-3.5 text-left">
                  <span className="font-medium uppercase tracking-[0.2em] text-[10px] text-editorial-accent">HARI / TANGGAL</span>
                  <span className="col-span-2 font-serif text-sm text-editorial-charcoal">: Sabtu, 5 September 2026</span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-b border-editorial-charcoal/10 pb-3.5 text-left">
                  <span className="font-medium uppercase tracking-[0.2em] text-[10px] text-editorial-accent">PUKUL</span>
                  <span className="col-span-2 font-serif text-sm text-editorial-charcoal">: 10.00 WIB - Selesai</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pb-1 text-left">
                  <span className="font-medium uppercase tracking-[0.2em] text-[10px] text-editorial-accent">ALAMAT</span>
                  <span className="col-span-2 font-serif text-sm text-editorial-charcoal leading-relaxed">
                    : Desa Lingka Kuta, Kec. Gandapura, Kab. Bireuen, Aceh
                  </span>
                </div>
              </div>

              {/* Family credits */}
              <div id="hormati-kami" className="border-t border-editorial-charcoal/10 mt-8 pt-8 grid grid-cols-2 gap-6 text-xs">
                <div className="text-left pl-2 md:pl-6 border-r border-editorial-charcoal/10">
                  <span className="font-medium uppercase tracking-[0.15em] text-[10px] text-editorial-accent block mb-2">Hormat Kami</span>
                  <p className="font-serif font-medium text-editorial-charcoal text-sm">Alm. Tgk Zuhdi</p>
                  <p className="font-serif text-editorial-accent text-xs">Ibu Azizah</p>
                </div>
                <div className="text-left pl-4 md:pl-8">
                  <span className="font-medium uppercase tracking-[0.15em] text-[10px] text-editorial-accent block mb-2">Turut Mengundang</span>
                  <p className="font-serif font-medium text-editorial-charcoal text-sm">Seluruh Keluarga Besar</p>
              
                </div>
              </div>

              {/* Calendar button */}
              <div className="mt-10">
                <a
                  id="add-to-calendar-button"
                  href={gCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-editorial-charcoal hover:bg-editorial-accent text-white font-medium text-xs py-4 px-8 tracking-[0.15em] uppercase border border-editorial-charcoal rounded-none transition-all duration-300 cursor-pointer hover:shadow-lg"
                >
                  <Calendar className="w-4 h-4 stroke-[1.5]" />
                  Simpan Agenda di Google Calendar
                </a>
              </div>
            </motion.div>
          </section>

          {/* Section: Galeri Foto */}
          <section id="galeri-section" className="w-full px-6 py-24 bg-white relative overflow-hidden flex flex-col items-center border-b border-editorial-charcoal/10">
            <CoffeeBranch className="absolute -bottom-10 -left-10 w-44 h-44 rotate-45 opacity-20" />
            <Gallery />
          </section>

          {/* Section 4: Map & Route Navigation */}
          <section id="lokasi-section" className="w-full px-6 py-24 bg-[#FAF9F6] relative overflow-hidden flex flex-col items-center border-b border-editorial-charcoal/10">
            
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-xl mb-12"
            >
              <span className="font-script text-3xl text-editorial-accent block mb-1">Lokasi Acara</span>
              <h2 className="font-serif text-3xl font-light text-editorial-charcoal tracking-wide">Peta Petunjuk Lokasi</h2>
              <p className="text-xs text-editorial-accent mt-3 leading-relaxed tracking-wide">
                Gunakan peta interaktif di bawah ini untuk melihat detail lokasi atau membuka navigasi arah langsung ke lokasi resepsi di Desa Lingka Kuta.
              </p>
            </motion.div>
            {/* Embedded Interactive Google Map */}
            <motion.div
              id="google-maps-frame-container"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="w-full max-w-2xl bg-white border border-editorial-charcoal/10 p-3 rounded-none shadow-xs overflow-hidden"
            >
              <div className="rounded-none overflow-hidden h-[320px] md:h-[400px] w-full relative bg-editorial-ivory border border-editorial-charcoal/5">
                <iframe
                  id="google-maps-iframe"
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3973.136733816317!2d96.89065687498285!3d5.24120539473669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwMTQnMjguMyJOIDk2wrA1MyczNS42IkU!5e0!3m2!1sid!2sid!4v1784643497506!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  title="Google Maps Location - Desa Lingka Kuta"
                />
              </div>
            </motion.div>

            {/* Directions Links buttons */}
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <a
                id="google-maps-app-link"
                href="https://maps.app.goo.gl/6ybnhqRyhM3Mthot9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-editorial-charcoal hover:bg-editorial-accent text-white font-medium text-xs py-4 px-8 tracking-[0.15em] uppercase border border-editorial-charcoal rounded-none transition-all duration-300 cursor-pointer hover:shadow-lg"
              >
                <Compass className="w-4 h-4 stroke-[1.5]" />
                Navigasi Google Maps
              </a>
            </div>
          </section>

          {/* Section 5: Digital Gifts (Amplop Digital / Kado) */}
          <section id="kado-section" className="w-full px-6 py-20 bg-coffee-100 relative overflow-hidden flex flex-col items-center">
            
            <div className="absolute bottom-0 left-0 w-full rotate-180">
              <VintageWave />
            </div>

            <CoffeeBranch className="absolute -top-10 -left-10 w-48 h-48 rotate-45 opacity-20" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-xl mb-12"
            >
              <span className="font-script text-3xl text-editorial-accent block mb-1">Berbagi Kasih</span>
              <h2 className="font-serif text-3xl font-light text-editorial-charcoal tracking-wide">Kado Digital</h2>
              <p className="text-xs text-editorial-accent mt-3 leading-relaxed tracking-wide">
                Doa restu Anda adalah kado terindah bagi kami. Namun bagi Anda yang ingin memberikan tanda kasih secara digital, kami menyediakan opsi transfer bank berikut:
              </p>
            </motion.div>

            {/* Bank Transfer Cards Grid */}
            <div className="gap-6 w-full max-w-2xl px-2">
              

              {/* Card 2: BSI (Bank Syariah Indonesia) */}
              <motion.div
                id="gift-bank-bsi"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="bg-white border border-editorial-charcoal/10 rounded-none p-6 relative overflow-hidden shadow-xs"
              >
                {/* Visual badge */}
                <div className="flex justify-between items-start mb-6">
                  <div className="text-sky-700 font-bold text-[9px] uppercase tracking-[0.2em] border border-sky-700/20 px-3 py-1 bg-sky-50 rounded-none">
                    BANK SYARIAH INDONESIA (BSI)
                  </div>
                  <Gift className="w-4 h-4 text-editorial-accent stroke-[1.5]" />
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-editorial-accent font-semibold">Nomor Rekening</p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-light text-editorial-charcoal tracking-wide">724.285.3948 </span>
                    <button
                      id="copy-bsi-button"
                      onClick={() => copyToClipboard("7242853948 ", "BSI")}
                      className="p-1.5 text-editorial-accent hover:text-editorial-charcoal bg-[#F4F2EB] hover:bg-[#EAE7DC] border border-editorial-charcoal/10 rounded-none cursor-pointer transition-colors"
                      title="Salin No Rekening"
                    >
                      {copiedBSI ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-editorial-accent">Atas Nama: <b className="font-serif font-medium text-editorial-charcoal text-lg">An Afrizal</b></p>
                </div>
              </motion.div>

            </div>
          </section>

          {/* Section 6: Guestbook / Buku Tamu */}
          <section id="buku-tamu-section" className="w-full px-2 py-24 bg-[#FAF9F6] relative overflow-hidden border-b border-editorial-charcoal/10">
            <Guestbook />
          </section>

          {/* Section 7: Footer */}
          <footer id="wedding-footer" className="w-full px-6 py-20 bg-editorial-charcoal text-[#FAF9F6] text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
              <VintageWave className="absolute top-1/4 left-0 w-full" />
              <VintageWave className="absolute bottom-1/4 left-0 w-full" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6 max-w-sm mx-auto z-10 relative"
            >
              <GayoLogo light={true} />
              
              <p className="text-xs text-gray-400 leading-relaxed pt-2 tracking-wide font-light">
                Merupakan kehormatan serta kebahagiaan yang mendalam bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu bagi kedua mempelai.
              </p>

              <div className="font-script text-3xl text-editorial-accent block pt-4">
                Sampai Jumpa di Hari Bahagia Kami!
              </div>

              <div className="border-t border-white/10 pt-8 mt-8 text-[9px] text-gray-500 tracking-[0.2em] uppercase">
                <p>© 2026 AFRIZAL & MAIDA ULFA</p>
                <p className="mt-1 font-mono tracking-wider lowercase">Gayo Zenith Wedding Digital Invitation • Bireuen, Aceh</p>
              </div>
            </motion.div>
          </footer>

        </div>
      )}

    </div>
  );
}
