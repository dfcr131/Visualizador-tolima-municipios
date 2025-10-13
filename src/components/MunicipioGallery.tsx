import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface MunicipioGalleryProps {
  selectedMunicipios: string[];
}

export function MunicipioGallery({ selectedMunicipios }: MunicipioGalleryProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 🔁 Auto desplazamiento cada 3 segundos
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const interval = setInterval(() => {
      if (!scrollContainer) return;
      const scrollAmount = scrollContainer.clientWidth * 0.7; // mueve 70% del ancho visible

      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;

      if (scrollContainer.scrollLeft >= maxScrollLeft - 5) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedMunicipios]);

  if (selectedMunicipios.length === 0) return null;

  return (
    <div className="w-full flex justify-center mb-6">
      <div className="w-[90%] bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl shadow-md py-4 px-3">
        <h2 className="text-center text-gray-800 font-semibold mb-3">
          🏞 Galería de {selectedMunicipios.join(", ")}
        </h2>

        {/* Carrusel horizontal */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-scroll scrollbar-hide snap-x snap-mandatory px-1"
          style={{
            scrollBehavior: "smooth",
            width: "100%",
            whiteSpace: "nowrap",
          }}
        >
          {selectedMunicipios.map((municipio) => {
            // Cargamos hasta 6 imágenes por municipio
            const images = Array.from({ length: 8 }, (_, i) => `/images/${municipio}/${i + 1}.jpeg`);
            return images.map((src, index) => (
              <motion.div
                key={`${municipio}-${index}`}
                className="inline-block min-w-[220px] h-[140px] rounded-lg overflow-hidden flex-shrink-0 snap-center"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={src}
                  alt={`${municipio} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </motion.div>
            ));
          })}
        </div>
      </div>
    </div>
  );
}
