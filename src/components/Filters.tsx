import { Search, ChevronDown, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedSources: string[];
  onSourcesChange: (sources: string[]) => void;
  selectedMunicipios: string[];
  onMunicipiosChange: (municipios: string[]) => void;
  availableCategories: string[];
  availableSources: string[];
  availableMunicipios: string[];
}

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(v => v !== value));
  };

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-pointer bg-white hover:border-emerald-400 transition-colors min-h-[42px] flex items-center justify-between"
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          ) : (
            selected.map(value => (
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
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">No hay opciones disponibles</div>
          ) : (
            options.map(option => (
              <div
                key={option}
                onClick={() => handleToggle(option)}
                className="px-4 py-2 hover:bg-emerald-50 cursor-pointer flex items-center gap-2 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => {}}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function Filters({
  searchTerm,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  selectedSources,
  onSourcesChange,
  selectedMunicipios,
  onMunicipiosChange,
  availableCategories,
  availableSources,
  availableMunicipios,
}: FiltersProps) {
  const hasActiveFilters = selectedCategories.length > 0 || selectedSources.length > 0 || selectedMunicipios.length > 0;

  const clearAllFilters = () => {
    onCategoriesChange([]);
    onSourcesChange([]);
    onMunicipiosChange([]);
  };

 return (
  <div className="sticky top-0 z-50 bg-gradient-to-r from-white/95 via-blue-50/80 to-emerald-50/80 backdrop-blur-md shadow-md border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar en todos los campos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-white/90 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <MultiSelectDropdown
            label="Categoría"
            options={availableCategories}
            selected={selectedCategories}
            onChange={onCategoriesChange}
            placeholder="Seleccionar categorías..."
          />
        </div>

        <div className="bg-white/90 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <MultiSelectDropdown
            label="Municipio"
            options={availableMunicipios}
            selected={selectedMunicipios}
            onChange={onMunicipiosChange}
            placeholder="Seleccionar municipios..."
          />
        </div>

        <div className="bg-white/90 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <MultiSelectDropdown
            label="Fuente"
            options={availableSources}
            selected={selectedSources}
            onChange={onSourcesChange}
            placeholder="Seleccionar fuentes..."
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
              >
                {cat}
              </span>
            ))}
            {selectedMunicipios.map(municipio => (
              <span
                key={municipio}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {municipio}
              </span>
            ))}
            {selectedSources.map(source => (
              <span
                key={source}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
              >
                {source}
              </span>
            ))}
          </div>
          <button
            onClick={clearAllFilters}
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
