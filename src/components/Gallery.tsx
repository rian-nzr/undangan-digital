import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { CoffeeBranch } from "./CoffeeDecoration";

interface GalleryImage {
  id: number;
  url: string;
  caption: string;
  category: string;
  spanClass?: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 0,
    url: "/ARSK7666.jpg",
    caption: "Langkah Pertama Menuju Keabadian",
    category: "Mempelai",
    spanClass: "md:col-span-1 md:row-span-2",
  },
  {
    id: 1,
    url: "/ARSK7119.jpg",
    caption: "Momen Janji Suci",
    category: "Akad",
    spanClass: "md:col-span-1",
  },
  {
    id: 2,
    url: "/ARSK7844.jpg",
    caption: "Ikatan Suci Dua Cincin",
    category: "Detail",
    spanClass: "md:col-span-1",
  },
  {
    id: 3,
    url: "/ARSK7585.jpg",
    caption: "Meja Jamuan Penuh Rasa Syukur",
    category: "Detail",
    spanClass: "md:col-span-2",
  },
  {
    id: 4,
    url: "/ARSK8309.jpg",
    caption: "Detail Gaun yang Anggun",
    category: "Detail",
    spanClass: "md:col-span-1 md:row-span-2",
  },
  {
    id: 5,
    url: "/ARSK7579.jpg",
    caption: "Kehangatan Alam Gayo yang Syahdu",
    category: "Latar Belakang",
    spanClass: "md:col-span-1",
  },
  {
    id: 6,
    url: "/ARSK7127.jpg",
    caption: "Cinta Sehangat Kopi Pagi",
    category: "Mempelai",
    spanClass: "md:col-span-1",
  },
  {
    id: 7,
    url: "/ARSK7783.jpg",
    caption: "Kenangan indah yang selalu bersama",
    category: "Mempelai",
    spanClass: "md:col-span-2",
  },
];

export function Gallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % GALLERY_IMAGES.length);
    }
  };

  const handlePrev = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
  };

  return (
    <div id="wedding-gallery-container" className="w-full flex flex-col items-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl mb-12 px-4"
      >
        <span className="font-script text-3xl text-editorial-accent block mb-1">Galeri Momen</span>
        <h2 className="font-serif text-3xl font-light text-editorial-charcoal tracking-wide">Kisah & Kenangan</h2>
        <p className="text-xs text-editorial-accent mt-3 leading-relaxed tracking-wide">
          Setiap senyuman, kehangatan, dan janji suci kami abadikan dalam lembaran kenangan indah yang takkan pernah pudar.
        </p>
      </motion.div>

      {/* Bento Grid layout */}
      <div className="w-full max-w-4xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]">
          {GALLERY_IMAGES.map((img) => (
            <motion.div
              key={img.id}
              className={`relative overflow-hidden cursor-pointer group bg-[#F4F2EB] border border-editorial-charcoal/10 ${
                img.spanClass || ""
              }`}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: img.id * 0.05 }}
              onClick={() => setSelectedIdx(img.id)}
            >
              {/* Image */}
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.97] group-hover:brightness-[0.9]"
                referrerPolicy="no-referrer"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-editorial-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#FAF9F6] mb-1 font-semibold opacity-75">
                  {img.category}
                </span>
                <p className="font-serif text-sm text-[#FAF9F6] italic leading-snug">
                  {img.caption}
                </p>
                <div className="absolute top-4 right-4 bg-white/20 p-2 border border-white/10 text-white rounded-none">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Minimal Border Frame inside */}
              <div className="absolute inset-2 border border-white/10 pointer-events-none group-hover:border-white/30 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            id="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-editorial-charcoal/95 backdrop-blur-sm flex flex-col justify-between items-center p-4 md:p-8"
          >
            {/* Top Bar */}
            <div className="w-full max-w-5xl flex justify-between items-center text-white/75 border-b border-white/10 pb-4">
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono">
                Momen {selectedIdx + 1} dari {GALLERY_IMAGES.length}
              </span>
              <button
                id="close-lightbox-btn"
                onClick={() => setSelectedIdx(null)}
                className="p-2 hover:text-white transition-colors cursor-pointer border border-white/10 hover:bg-white/5"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Central Stage */}
            <div className="w-full max-w-4xl flex-1 flex justify-between items-center my-4 relative">
              {/* Left Arrow */}
              <button
                id="prev-lightbox-btn"
                onClick={handlePrev}
                className="absolute left-0 md:-left-16 z-10 p-3 text-white/50 hover:text-white transition-colors cursor-pointer border border-white/10 hover:bg-white/5 rounded-none"
              >
                <ChevronLeft className="w-6 h-6 stroke-[1.5]" />
              </button>

              {/* Main Image */}
              <div className="w-full h-full flex items-center justify-center p-2 max-h-[70vh]">
                <motion.img
                  key={selectedIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={GALLERY_IMAGES[selectedIdx].url}
                  alt={GALLERY_IMAGES[selectedIdx].caption}
                  className="max-w-full max-h-full object-contain border border-white/10 p-1 bg-white/5"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Arrow */}
              <button
                id="next-lightbox-btn"
                onClick={handleNext}
                className="absolute right-0 md:-right-16 z-10 p-3 text-white/50 hover:text-white transition-colors cursor-pointer border border-white/10 hover:bg-white/5 rounded-none"
              >
                <ChevronRight className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Bottom Bar Caption */}
            <div className="w-full max-w-xl text-center pb-4 text-[#FAF9F6]">
              <motion.div
                key={selectedIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-1.5"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] text-editorial-accent font-semibold">
                  {GALLERY_IMAGES[selectedIdx].category}
                </span>
                <p className="font-serif text-lg italic font-light">
                  "{GALLERY_IMAGES[selectedIdx].caption}"
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
