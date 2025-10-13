import { FileText, Tag, Database } from 'lucide-react';

interface KPIsProps {
  totalRecords: number;
  uniqueCategories: number;
  uniqueSources: number;
}

export function KPIs({ totalRecords, uniqueCategories, uniqueSources }: KPIsProps) {
  const kpis = [
    {
      label: 'Total Registros',
      value: totalRecords,
      icon: FileText,
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      label: 'Categorías',
      value: uniqueCategories,
      icon: Tag,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      label: 'Fuentes',
      value: uniqueSources,
      icon: Database,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="backdrop-blur-md bg-white/80 rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {kpi.label}
                  </p>
                  <p className={`text-3xl font-bold ${kpi.textColor}`}>
                    {kpi.value}
                  </p>
                </div>
                <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-8 h-8 ${kpi.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
