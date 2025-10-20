import { useMemo } from "react";
import WordCloud from "react-d3-cloud";
import { RegistroTuristicoPontevedra } from "../data/pontevedra";

interface WordAnalysisProps {
  data: RegistroTuristicoPontevedra[];
}

/** Normaliza texto: minúsculas, sin tildes, sin signos, quita emojis y números sueltos */
function normalizeToken(token: string): string {
  const lower = token.toLowerCase();
  // elimina emojis y símbolos no alfanuméricos razonables
  const strippedEmoji = lower.replace(
    /[\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]/g,
    ""
  );
  // normaliza tildes
  const noDiacritics = strippedEmoji.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // elimina signos / puntuación
  const cleaned = noDiacritics.replace(/[.,;:()"'¡!¿?[\]{}/*+<>%$#@^~_=\\|]/g, "");
  // quita números sueltos y guiones laterales
  const finalTok = cleaned.replace(/^-+|-+$/g, "");
  return finalTok;
}

export function WordAnalysis({ data }: WordAnalysisProps) {
  // Solo analizamos "nombre_normalizado" (o "nombre" si existiera)
  const words = useMemo(() => {
    // stopwords básicas (español) + algunas cortas de nombres
    const stopwords = new Set<string>([
      "de","del","la","las","los","el","en","y","a","con","por","para","una","uno","un",
      "al","se","su","sus","es","son","o","u","que","como","desde","hasta","sin","sobre",
      "entre","mas","más","menos","mi","tu","lo","este","esta","estos","estas","ese","esa",
      "eso","san","santa","bar","cafe","cafeteria","restaurante","taperia","meson","casa",
      "da","do","dos","das","deu","deus","the","and","of", "pontevedra", "galicia"
    ]);

    const counts: Record<string, number> = {};

    for (const r of data) {
      const raw = (r as any).nombre_normalizado || (r as any).nombre || "";
      if (!raw) continue;

      // separa por espacios y guiones
      const tokens = raw.split(/[\s\-]+/);
      for (let t of tokens) {
        const clean = normalizeToken(t);
        if (!clean) continue;
        if (clean.length <= 2) continue;         // descarta muy cortas
        if (stopwords.has(clean)) continue;
        if (/^\d+$/.test(clean)) continue;        // descarta números
        counts[clean] = (counts[clean] || 0) + 1;
      }
    }

    return Object.entries(counts)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  // Visual
  const fontSize = (w: { value: number }) => Math.min(60, Math.max(12, w.value * 3));
  const rotate = () => (Math.random() > 0.85 ? 90 : 0);
  const palette = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];
  const fill = (_w: { text: string; value: number }, i: number) => palette[i % palette.length];

  if (words.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Nube de palabras (nombre)</h2>
        <p className="text-gray-500">No hay datos disponibles para generar el análisis.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Nube de palabras (nombre)</h2>

      {/* Nube */}
      <div className="flex justify-center items-center w-full" style={{ height: 450, backgroundColor: "#fff", overflow: "hidden" }}>
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

      {/* Top palabras */}
      <div className="mt-6">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Top palabras en nombre</h3>
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Palabra</th>
              <th className="text-left py-2">Frecuencia</th>
            </tr>
          </thead>
          <tbody>
            {words.slice(0, 15).map((w) => (
              <tr key={w.text} className="border-b last:border-none">
                <td className="py-1">{w.text}</td>
                <td className="py-1">{w.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
