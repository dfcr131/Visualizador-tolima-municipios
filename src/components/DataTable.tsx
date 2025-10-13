import { useState } from 'react';
import { RegistroTuristico } from '../data/municipios';

interface DataTableProps {
  data: RegistroTuristico[];
}

function TruncatedText({ text, maxLength = 200 }: { text: string; maxLength?: number }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  const isTruncated = text.length > maxLength;
  const displayText = expanded ? text : text.slice(0, maxLength) + (isTruncated ? '…' : '');

  return (
    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
      {displayText}
      {isTruncated && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 text-emerald-600 hover:text-emerald-800 font-medium text-xs underline"
        >
          {expanded ? 'Leer menos' : 'Leer más'}
        </button>
      )}
    </p>
  );
}

export function DataTable({ data }: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-lg">No se encontraron registros con los filtros aplicados.</p>
        </div>
      </div>
    );
  }

 return (
  <div className="w-full flex justify-center pb-10">
    <div className="w-full max-w-7xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white/95 backdrop-blur-sm table-auto">
            <thead>
              <tr className="bg-emerald-600 text-white text-sm">
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[12%]">Categoría</th>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[12%]">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[18%]">Descripción</th>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[12%]">Ubicación</th>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[10%]">Municipio</th>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[8%]">Fuente</th>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[10%]">Info relevante</th>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[18%]">
                  Aporte a la investigación
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((registro, index) => (
                <tr key={index} className="hover:bg-emerald-50 transition-colors duration-150 align-top">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                      {registro.categoría}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-normal break-words">
                    {registro.nombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-normal break-words">
                    <TruncatedText text={registro.descripción} maxLength={350} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-normal break-words">
                    {registro.ubicación}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{registro.municipio}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-normal break-words">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      {registro.fuente}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-normal break-words">
                    <TruncatedText text={registro.info_relevante} maxLength={120} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-normal break-words">
                    <TruncatedText text={registro['Aporte a la investigación']} maxLength={400} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

}
