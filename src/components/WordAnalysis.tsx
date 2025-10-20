import { useMemo } from "react";
import WordCloud from "react-d3-cloud";
import { RegistroTuristico } from "../data/municipios";

interface WordAnalysisProps {
  data: RegistroTuristico[];
}

export function WordAnalysis({ data }: WordAnalysisProps) {
  // 🧠 Procesar palabras (eliminando conectores comunes)
  const words = useMemo(() => {
    const stopwords = new Set([
      "de", "del", "la", "las", "los", "el", "en", "y", "a", "con", "por", "para",
      "una", "uno", "un", "al", "se", "su", "sus", "es", "son", "o", "u",
      "que", "como", "desde", "hasta", "sin", "sobre", "entre", "más", "menos",
      "mi", "tu", "su", "lo", "este", "esta", "estos", "estas", "ese", "esa", "eso"
    ]);

    const counts: Record<string, number> = {};

    data.forEach((registro) => {
      if (!registro.nombre) return;
      const palabras = registro.nombre.split(/\s+/);
      palabras.forEach((p) => {
        const clean = p.toLowerCase().replace(/[.,;:()"'¡!¿?]/g, "");
        if (clean.length > 2 && !stopwords.has(clean)) {
          counts[clean] = (counts[clean] || 0) + 1;
        }
      });
    });

    const result = Object.entries(counts)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value);

    console.log("✅ Palabras procesadas:", result.slice(0, 10));
    return result;
  }, [data]);

  // 🎨 Configuración visual
  const fontSize = (word: { value: number }) =>
    Math.min(60, Math.max(12, word.value * 3));
  const rotate = () => (Math.random() > 0.8 ? 90 : 0);
  const colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];
  const fill = (_word: { text: string; value: number }, i: number) => colors[i % colors.length];

  // 🚫 Sin palabras
  if (words.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Análisis de palabras más usadas
        </h2>
        <p className="text-gray-500">No hay datos disponibles para generar el análisis.</p>
      </div>
    );
  }

  // 🚀 Renderizar nube + tabla
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Análisis de palabras más usadas
      </h2>

      {/* === Nube de palabras === */}
      <div
        className="flex justify-center items-center w-full"
        style={{
          height: "450px",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        <svg width="800" height="450">
          <foreignObject width="100%" height="100%">
            <WordCloud
              data={words}
              width={800}
              height={450}
              font="sans-serif"
              fontSize={fontSize}
              rotate={rotate}
              padding={2}
              fill={fill}
              spiral="archimedean"
            />
          </foreignObject>
        </svg>
      </div>

      {/* === Tabla de frecuencias === */}
      <div className="mt-6">
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Palabras más frecuentes
        </h3>
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Palabra</th>
              <th className="text-left py-2">Frecuencia</th>
            </tr>
          </thead>
          <tbody>
            {words.slice(0, 10).map((word) => (
              <tr key={word.text} className="border-b last:border-none">
                <td className="py-1">{word.text}</td>
                <td className="py-1">{word.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
