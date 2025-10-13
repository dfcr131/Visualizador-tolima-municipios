import { useState, useEffect, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { Filters } from "./components/Filters";
import { KPIs } from "./components/KPIs";
import { DataTable } from "./components/DataTable";
import { Charts } from "./components/Charts";
import { loadMunicipiosData, RegistroTuristico } from "./data/municipios";
import { MunicipioGallery } from "./components/MunicipioGallery";
import { WordAnalysis } from "./components/WordAnalysis"; // 👈 nuevo componente
import { BarChart3, Table, Type } from "lucide-react"; // 👈 agregamos ícono de texto para "words"
import { Map } from "lucide-react"; // ícono para el mapa
import { MapView } from "./components/MapView"; // importa el componente


function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedMunicipios, setSelectedMunicipios] = useState<string[]>([]);
  const [municipiosTolima, setMunicipiosTolima] = useState<RegistroTuristico[]>([]);
  const [activeView, setActiveView] = useState<"tabla" | "graficas" | "words" | "mapa">("tabla");

  // Cargar los datos desde Excel
  useEffect(() => {
    loadMunicipiosData().then(setMunicipiosTolima);
  }, []);

  // === Datos para los filtros ===
  const availableCategories = useMemo(
    () => [...new Set(municipiosTolima.map((m) => m.categoría))].sort(),
    [municipiosTolima]
  );

  const availableSources = useMemo(
    () => [...new Set(municipiosTolima.map((m) => m.fuente))].sort(),
    [municipiosTolima]
  );

  const availableMunicipios = useMemo(
    () => [...new Set(municipiosTolima.map((m) => m.municipio))].sort(),
    [municipiosTolima]
  );

  // === Filtros dinámicos ===
  const filteredData = useMemo(() => {
    return municipiosTolima.filter((registro) => {
      const matchesSearch =
        searchTerm === "" ||
        Object.values(registro).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(registro.categoría);

      const matchesSource =
        selectedSources.length === 0 ||
        selectedSources.includes(registro.fuente);

      const matchesMunicipio =
        selectedMunicipios.length === 0 ||
        selectedMunicipios.includes(registro.municipio);

      return matchesSearch && matchesCategory && matchesSource && matchesMunicipio;
    });
  }, [searchTerm, selectedCategories, selectedSources, selectedMunicipios, municipiosTolima]);

  // === KPIs ===
  const uniqueCategories = useMemo(
    () => new Set(filteredData.map((r) => r.categoría)).size,
    [filteredData]
  );

  const uniqueSources = useMemo(
    () => new Set(filteredData.map((r) => r.fuente)).size,
    [filteredData]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30">
      <Navbar />

      <Filters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        selectedSources={selectedSources}
        onSourcesChange={setSelectedSources}
        selectedMunicipios={selectedMunicipios}
        onMunicipiosChange={setSelectedMunicipios}
        availableCategories={availableCategories}
        availableSources={availableSources}
        availableMunicipios={availableMunicipios}
      />

      <KPIs
        totalRecords={filteredData.length}
        uniqueCategories={uniqueCategories}
        uniqueSources={uniqueSources}
      />

      <MunicipioGallery selectedMunicipios={selectedMunicipios} />

      {/* === Navegador de vistas === */}
      <div className="flex justify-center mt-6 mb-4">
        <div className="flex bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-sm overflow-hidden">
          <button
            onClick={() => setActiveView("tabla")}
            className={`flex items-center gap-2 px-6 py-2 transition-all ${
              activeView === "tabla"
                ? "bg-emerald-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Table className="w-4 h-4" />
            Tabla
          </button>
          <button
            onClick={() => setActiveView("graficas")}
            className={`flex items-center gap-2 px-6 py-2 transition-all ${
              activeView === "graficas"
                ? "bg-emerald-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Gráficas
          </button>
          <button
            onClick={() => setActiveView("words")}
            className={`flex items-center gap-2 px-6 py-2 transition-all ${
              activeView === "words"
                ? "bg-emerald-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Type className="w-4 h-4" />
            Análisis de Palabras
          </button>
          <button
            onClick={() => setActiveView("mapa")}
            className={`flex items-center gap-2 px-6 py-2 transition-all ${
              activeView === "mapa"
                ? "bg-emerald-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Map className="w-4 h-4" />
            Mapa
          </button>
        </div>
      </div>

      {/* === Contenido dinámico === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {activeView === "tabla" && <DataTable data={filteredData} />}
        {activeView === "graficas" && <Charts data={filteredData} />}
        {activeView === "words" && <WordAnalysis data={filteredData} />}
        {activeView === "mapa" && <MapView data={filteredData} />}

      </div>
    </div>
  );
}

export default App;
