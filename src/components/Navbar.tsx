import { Mountain } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center gap-3">
            <Mountain className="w-7 h-7 text-emerald-600" />
            <h1 className="text-2xl font-semibold text-gray-800">
              Página web Pontevedra (Web Scraping y Análisis de Redes Sociales)
            </h1>
          </div>
        </div>
      </div>
    </nav>
  );
}
