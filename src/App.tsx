import { useState, useEffect, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { Filters } from "./components/Filters";
import { KPIs } from "./components/KPIs";
import { DataTable } from "./components/DataTable";
import { Charts } from "./components/Charts";
import { WordAnalysis } from "./components/WordAnalysis";
import { MapView } from "./components/MapView";
import { CardView } from "./components/CardView";
import { CommentsView } from "./components/CommentsView"; // ✅ Componente nuevo
import {
  BarChart3,
  Table,
  Type,
  Map,
  MessageSquare as Comment, // ✅ Icono correcto
} from "lucide-react";
import {
  loadMunicipiosDataPontevedra,
  RegistroTuristicoPontevedra,
} from "./data/pontevedra";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [municipiosTolima, setMunicipiosTolima] = useState<
    RegistroTuristicoPontevedra[]
  >([]);
  const [activeView, setActiveView] = useState<
    "informacion" | "graficas" | "words" | "mapa" | "comentarios"
  >("informacion");

  // ======== FILTROS ========
  const [selectedTipos, setSelectedTipos] = useState<string[]>([]);
  const [selectedCaminos, setSelectedCaminos] = useState<string[]>([]);
  const [calificacionRange, setCalificacionRange] = useState<[number, number]>([
    1, 5,
  ]);
  const [opinionesRange, setOpinionesRange] = useState<[number, number]>([
    0, 6637,
  ]);

  const [viewFormat, setViewFormat] = useState<"tabla" | "cards">("cards");

  // Cargar datos XLSX
  useEffect(() => {
    loadMunicipiosDataPontevedra().then(setMunicipiosTolima);
  }, []);

  // ======== HELPERS ========
  const unique = (arr: string[]) => [...new Set(arr.filter(Boolean))].sort();
  const splitByPipe = (s?: string) =>
    (s ?? "")
      .split("|")
      .map((t) => t.trim())
      .filter(Boolean);
  const toNumberSafe = (v: any) => {
    if (v == null) return NaN;
    const s = String(v).trim();
    if (!s) return NaN;
    const first = s.split("/")[0]; // "4,5/5"
    const normalized = first.replace(/\./g, "").replace(/,/g, ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : NaN;
  };
  const parseOpiniones = (v: any) => {
    if (typeof v === "number") return v;
    const m = String(v ?? "").match(/[\d.,]+/);
    return m ? toNumberSafe(m[0]) : NaN;
  };

  const getTipo = (r: any): string => r.tipo ?? "";

  // ======== OPCIONES DISPONIBLES ========
  const availableTipos = useMemo(
    () =>
      [...new Set((municipiosTolima as any[]).map(getTipo).filter(Boolean))].sort(),
    [municipiosTolima]
  );

  const availableCaminos = useMemo(
    () =>
      unique(
        (municipiosTolima as any[]).flatMap(
          (r) =>
            (r.caminos_list as string[] | undefined) ??
            splitByPipe(r.situacion_caminos_de_santiago)
        )
      ),
    [municipiosTolima]
  );

  // ======== FILTRADO DE DATOS ========
  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return (municipiosTolima as any[]).filter((r) => {
      const matchesSearch =
        term === "" ||
        Object.values(r).some((v) =>
          String(v ?? "").toLowerCase().includes(term)
        );

      const tipo = getTipo(r);
      const matchesTipo =
        selectedTipos.length === 0 || selectedTipos.includes(tipo);

      const caminos =
        (r.caminos_list as string[] | undefined) ??
        splitByPipe(r.situacion_caminos_de_santiago);
      const matchesCamino =
        selectedCaminos.length === 0 ||
        selectedCaminos.every((c) => caminos.includes(c));

      const califNum = Number.isFinite(r?.calificacion_num)
        ? Number(r.calificacion_num)
        : toNumberSafe(r?.calificacion);
      const matchesCalificacion =
        !Number.isFinite(califNum) ||
        (califNum >= calificacionRange[0] && califNum <= calificacionRange[1]);

      const opinNum = Number.isFinite(r?.opiniones_num)
        ? Number(r.opiniones_num)
        : parseOpiniones(r?.num_opiniones);
      const matchesOpiniones =
        !Number.isFinite(opinNum) ||
        (opinNum >= opinionesRange[0] && opinNum <= opinionesRange[1]);

      return (
        matchesSearch &&
        matchesTipo &&
        matchesCamino &&
        matchesCalificacion &&
        matchesOpiniones
      );
    });
  }, [
    municipiosTolima,
    searchTerm,
    selectedTipos,
    selectedCaminos,
    calificacionRange,
    opinionesRange,
  ]);

  // ======== KPIs ========
  const uniqueTipos = useMemo(
    () => new Set(filteredData.map((r: any) => getTipo(r))).size,
    [filteredData]
  );
  const totalRecords = filteredData.length;

  // ======== DESCARGA CSV ========
  const handleDownloadCSV = (all: boolean = false) => {
    const dataToExport = all ? municipiosTolima : filteredData;
    if (!dataToExport || dataToExport.length === 0) {
      alert("No hay datos para descargar.");
      return;
    }

    const headers = Object.keys(dataToExport[0]);
    const rows = dataToExport.map((row) =>
      headers
        .map((key) => {
          const cell = row[key] ?? "";
          const safe = String(cell).replace(/"/g, '""');
          return `"${safe}"`;
        })
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = all
      ? "datos_observatorio_completo.csv"
      : "datos_observatorio_filtrado.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // ======== RENDER ========
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30">
      <Navbar />

      <Filters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTipos={selectedTipos}
        onTiposChange={setSelectedTipos}
        availableTipos={availableTipos}
        selectedCaminos={selectedCaminos}
        onCaminosChange={setSelectedCaminos}
        availableCaminos={availableCaminos}
        calificacionRange={calificacionRange}
        onCalificacionRangeChange={setCalificacionRange}
        opinionesRange={opinionesRange}
        onOpinionesRangeChange={setOpinionesRange}
      />

      <KPIs
        totalRecords={totalRecords}
        uniqueCategories={uniqueTipos}
        uniqueSources={availableCaminos.length}
      />
      {/* Imagen institucional */}
      <div className="flex justify-center my-8">
        <img
          src="/images/logoPontevedra.jpg"
          alt="Logos institucionales - Xunta de Galicia, Gobierno de España, Unión Europea, Concello de Pontevedra"
          className="max-w-[900px] w-full object-contain opacity-90"
        />
      </div>
      <div className="flex justify-center mt-6 mb-4">
        <div className="flex bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-sm overflow-hidden">
          <button
            onClick={() => setActiveView("informacion")}
            className={`flex items-center gap-2 px-6 py-2 transition-all ${
              activeView === "informacion"
                ? "bg-emerald-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Table className="w-4 h-4" />
            Información
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
          <button
            onClick={() => setActiveView("comentarios")}
            className={`flex items-center gap-2 px-6 py-2 transition-all ${
              activeView === "comentarios"
                ? "bg-emerald-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Comment className="w-4 h-4" />
            Comentarios
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {activeView === "informacion" && (
          <>
            <div className="flex flex-wrap items-center justify-between bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm p-4 mt-6 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewFormat("cards")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all ${
                    viewFormat === "cards"
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Type className="w-4 h-4" />
                  Ver como Cards
                </button>
                <button
                  onClick={() => setViewFormat("tabla")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all ${
                    viewFormat === "tabla"
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Table className="w-4 h-4" />
                  Ver como Tabla
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadCSV(false)}
                  className="flex items-center gap-2 bg-gray-200 text-gray-800 px-5 py-2 rounded-xl shadow hover:bg-gray-300 transition-all"
                >
                  Descargar CSV
                </button>
              </div>
            </div>

            {viewFormat === "tabla" && <DataTable data={filteredData as any[]} />}
            {viewFormat === "cards" && <CardView data={filteredData as any[]} />}
          </>
        )}

        {activeView === "graficas" && <Charts data={filteredData as any[]} />}
        {activeView === "words" && <WordAnalysis data={filteredData as any[]} />}
        {activeView === "mapa" && <MapView data={filteredData as any[]} selectedTipos={selectedTipos} selectedCaminos={selectedCaminos} calificacionRange={calificacionRange} opinionesRange={opinionesRange} searchTerm={searchTerm} />}
        {activeView === "comentarios" && <CommentsView data={filteredData as any[]} />}
      </div>
    </div>
  );
}

export default App;
