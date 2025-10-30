import { Search, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FiltersProps {
  // Buscador (lo mantenemos)
  searchTerm: string;
  onSearchChange: (value: string) => void;

  // Tipo
  selectedTipos: string[];
  onTiposChange: (values: string[]) => void;
  availableTipos: string[];

  // Camino de Santiago
  selectedCaminos: string[];
  onCaminosChange: (values: string[]) => void;
  availableCaminos: string[];

  // Rango calificación (fijo 1-5)
  calificacionRange: [number, number];
  onCalificacionRangeChange: (range: [number, number]) => void;

  // Rango opiniones (fijo 0-6637)
  opinionesRange: [number, number];
  onOpinionesRangeChange: (range: [number, number]) => void;
}

/* ---------- UI helpers ---------- */
function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  placeholder,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-pointer bg-white hover:border-emerald-400 transition-colors min-h-[42px] flex items-center justify-between"
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          ) : (
            selected.map((value) => (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium"
              >
                {value}
                <X
                  className="w-3 h-3 hover:text-emerald-900 cursor-pointer"
                  onClick={(e) => handleRemove(value, e)}
                />
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">No hay opciones disponibles</div>
          ) : (
            options.map((option) => (
              <div
                key={option}
                onClick={() => handleToggle(option)}
                className="px-4 py-2 hover:bg-emerald-50 cursor-pointer flex items-center gap-2 transition-colors"
              >
                <input type="checkbox" checked={selected.includes(option)} readOnly className="w-4 h-4" />
                <span className="text-sm text-gray-700">{option}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function RangeSelector({
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
  format = (n: number) => `${Math.round(n)}`,
}: {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
  step?: number;
  format?: (n: number) => string;
}) {
  const [local, setLocal] = useState<[number, number]>(value);

  useEffect(() => setLocal(value), [value]);

  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  const handleMin = (v: number) => {
    const next: [number, number] = [clamp(Math.min(v, local[1])), local[1]];
    setLocal(next);
    onChange(next);
  };

  const handleMax = (v: number) => {
    const next: [number, number] = [local[0], clamp(Math.max(v, local[0]))];
    setLocal(next);
    onChange(next);
  };

  // Cálculo del rango activo (posición izquierda y ancho)
  const leftPercent = ((local[0] - min) / (max - min)) * 100;
  const rightPercent = ((local[1] - min) / (max - min)) * 100;
  const widthPercent = rightPercent - leftPercent;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs text-gray-500">{format(local[0])}</span>

        <div className="relative flex-1 h-2 rounded-full bg-gray-200">
          {/* Barra activa corregida */}
          <div
            className="absolute h-2 bg-emerald-400 rounded-full"
            style={{
              left: `${leftPercent}%`,
              width: `${widthPercent}%`,
            }}
          />

          {/* Sliders */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={local[0]}
            onChange={(e) => handleMin(parseFloat(e.target.value))}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={local[1]}
            onChange={(e) => handleMax(parseFloat(e.target.value))}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto"
          />
        </div>

        <span className="text-xs text-gray-500">{format(local[1])}</span>
      </div>

      {/* Entradas numéricas */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={local[0]}
          min={min}
          max={max}
          step={step}
          onChange={(e) => handleMin(parseFloat(e.target.value))}
          className="w-full px-2 py-1 border border-gray-200 rounded"
        />
        <input
          type="number"
          value={local[1]}
          min={min}
          max={max}
          step={step}
          onChange={(e) => handleMax(parseFloat(e.target.value))}
          className="w-full px-2 py-1 border border-gray-200 rounded"
        />
      </div>
    </div>
  );
}

export function Filters({
  searchTerm,
  onSearchChange,
  selectedTipos,
  onTiposChange,
  availableTipos,
  selectedCaminos,
  onCaminosChange,
  availableCaminos,
  calificacionRange,
  onCalificacionRangeChange,
  opinionesRange,
  onOpinionesRangeChange,
}: FiltersProps) {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Detectar dirección del scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Oculta si bajamos, muestra si subimos
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const hasActive =
    searchTerm.trim() !== "" ||
    selectedTipos.length > 0 ||
    selectedCaminos.length > 0 ||
    calificacionRange[0] !== 1 ||
    calificacionRange[1] !== 5 ||
    opinionesRange[0] !== 0 ||
    opinionesRange[1] !== 6637;

  const clearAll = () => {
    onSearchChange("");
    onTiposChange([]);
    onCaminosChange([]);
    onCalificacionRangeChange([1, 5]);
    onOpinionesRangeChange([0, 6637]);
  };

  return (
    <div
      className={`sticky top-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } bg-gradient-to-r from-white/95 via-blue-50/80 to-emerald-50/80 backdrop-blur-md shadow-md border-b border-gray-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Buscar */}
          <div className="bg-white/90 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Nombre, descripción…"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Tipo */}
          <div className="bg-white/90 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <MultiSelectDropdown
              label="Tipo"
              options={availableTipos}
              selected={selectedTipos}
              onChange={onTiposChange}
              placeholder="Café bar, Restaurante, Agencia…"
            />
          </div>

          {/* Camino de Santiago */}
          <div className="bg-white/90 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <MultiSelectDropdown
              label="Camino de Santiago"
              options={availableCaminos}
              selected={selectedCaminos}
              onChange={onCaminosChange}
              placeholder="Portugués, Costa…"
            />
          </div>

          {/* Calificación */}
          <div className="bg-white/90 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <RangeSelector
              label="Calificación (1–5)"
              min={1}
              max={5}
              step={0.1}
              value={calificacionRange}
              onChange={onCalificacionRangeChange}
              format={(n) => n.toFixed(1)}
            />
          </div>

          {/* Opiniones */}
          <div className="bg-white/90 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <RangeSelector
              label="Opiniones (0–6637)"
              min={0}
              max={6637}
              step={1}
              value={opinionesRange}
              onChange={onOpinionesRangeChange}
              format={(n) => `${Math.round(n)}`}
            />
          </div>
        </div>

        {/* Etiquetas activas */}
        {hasActive && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {selectedTipos.map((v) => (
                <span key={v} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  {v}
                </span>
              ))}
              {selectedCaminos.map((v) => (
                <span key={v} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {v}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                Calificación: {calificacionRange[0].toFixed(1)}–{calificacionRange[1].toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
                Opiniones: {Math.round(opinionesRange[0])}–{Math.round(opinionesRange[1])}
              </span>
            </div>
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}