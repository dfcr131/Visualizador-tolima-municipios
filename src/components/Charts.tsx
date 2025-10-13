import { RegistroTuristico } from '../data/municipios';

interface ChartsProps {
  data: RegistroTuristico[];
}

export function Charts({ data }: ChartsProps) {
  const categoryCounts = data.reduce((acc, registro) => {
    acc[registro.categoría] = (acc[registro.categoría] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceCounts = data.reduce((acc, registro) => {
    acc[registro.fuente] = (acc[registro.fuente] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const sourceData = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);

  const maxCategoryValue = Math.max(...categoryData.map(([, count]) => count), 1);
  const maxSourceValue = Math.max(...sourceData.map(([, count]) => count), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Registros por Categoría
          </h3>
          <div className="space-y-4">
            {categoryData.map(([category, count]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{category}</span>
                  <span className="font-semibold text-emerald-600">{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(count / maxCategoryValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Registros por Fuente
          </h3>
          <div className="space-y-4">
            {sourceData.map(([source, count]) => (
              <div key={source} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 truncate max-w-[200px]" title={source}>
                    {source}
                  </span>
                  <span className="font-semibold text-blue-600">{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-cyan-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(count / maxSourceValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
