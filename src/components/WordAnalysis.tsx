import { useMemo } from "react";
import ReactWordcloud from "react-wordcloud";
import { RegistroTuristico } from "../data/municipios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

interface WordAnalysisProps {
  data: RegistroTuristico[];
}

export function WordAnalysis({ data }: WordAnalysisProps) {
  // --- Conteo de palabras ---
  const wordCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    data.forEach((registro) => {
      const palabras = registro.nombre
        ?.toLowerCase()
        .replace(/[^\p{L}\s]/gu, "")
        .split(/\s+/)
        .filter(
          (w) =>
            w.length > 3 &&
            ![
              "del",
              "de",
              "la",
              "los",
              "las",
              "en",
              "el",
              "y",
              "san",
              "santa",
              "ruta",
              "turismo",
              "rioblanco",
              "hermosas"
            ].includes(w)
        );

      palabras.forEach((palabra) => {
        counts[palabra] = (counts[palabra] || 0) + 1;
      });
    });

    const sorted = Object.entries(counts)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value);

    return {
      cloudWords: sorted.slice(0, 80),
      barWords: sorted.slice(0, 15),
    };
  }, [data]);

  const options = {
    rotations: 2,
    rotationAngles: [-90, 0] as [number, number],
    fontSizes: [14, 55] as [number, number],
    colors: ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#6366f1"],
    enableTooltip: true,
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500">
        No hay datos disponibles para el análisis de palabras.
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* === Título === */}
      <h2 className="text-lg font-semibold text-gray-800">
        🔠 Análisis de palabras más usadas en los nombres turísticos
      </h2>

      {/* === Nube de palabras === */}
      <div style={{ height: 400, width: "100%" }}>
        <ReactWordcloud words={wordCounts.cloudWords} options={options} />
      </div>

      {/* === Gráfico de barras === */}
      <div className="mt-8">
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          📊 Frecuencia de palabras (Top 15)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical"
            data={wordCounts.barWords}
            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis type="number" />
            <YAxis
              dataKey="text"
              type="category"
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#10b981" radius={[0, 6, 6, 0]}>
              <LabelList dataKey="value" position="right" fill="#333" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
