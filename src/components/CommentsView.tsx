import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

interface CommentsViewProps {
  data: any[];
}

export function CommentsView({ data }: CommentsViewProps) {
  const [categoria, setCategoria] = useState("Todas");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // 🔹 Obtener categorías únicas
  const categorias = useMemo(() => {
    const unique = new Set(data.map((d) => d.categ_Comentario || "Sin categoría"));
    return ["Todas", ...Array.from(unique)];
  }, [data]);

  // 🔹 Filtrar datos por categoría seleccionada
  const filtered = useMemo(() => {
    if (categoria === "Todas") return data;
    return data.filter((d) => d.categ_Comentario === categoria);
  }, [data, categoria]);

  // 🔹 Calcular frecuencias de categorías (Top 5, sin “sin categoría”, “otras”, “no hay opiniones”)
  const frecuencia = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((d) => {
      const cat = d.categ_Comentario?.trim() || "Sin categoría";
      if (
        cat.toLowerCase() !== "sin categoría" &&
        cat.toLowerCase() !== "otras" &&
        cat.toLowerCase() !== "no hay opiniones"
      ) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([cat, count]) => ({ cat, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data]);

  const toggleExpand = (rowIndex: number, colIndex: number) => {
    const key = `${rowIndex}-${colIndex}`;
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 bg-white/80 rounded-2xl shadow-md max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-emerald-700 text-center">
        Comentarios por Categoría
      </h2>

      {/* 🔹 Filtro */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <label className="font-medium mr-2 text-gray-700">Filtrar por categoría:</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Total registros: <strong>{filtered.length}</strong>
        </div>
      </div>

      {/* 🔹 Gráfico de barras con nombres debajo de cada barra */}
<div className="relative mb-12 bg-gradient-to-b from-emerald-50 to-white p-6 rounded-2xl border border-gray-200 shadow-inner overflow-hidden">
  <h3 className="text-lg font-semibold text-center text-gray-700 mb-6">
    Distribución de categorías (Top 5)
  </h3>

  <div className="w-full h-[360px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={frecuencia.map((f) => ({
          categoria: f.cat,
          porcentaje: ((f.count / frecuencia.reduce((a, b) => a + b.count, 0)) * 100).toFixed(1),
          count: f.count,
        }))}
        margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis hide /> {/* Ocultamos el eje X porque pondremos etiquetas personalizadas */}
        <YAxis
          tick={{ fill: "#374151", fontSize: 12 }}
          label={{
            value: "Porcentaje (%)",
            angle: -90,
            position: "insideLeft",
            fill: "#4b5563",
            fontSize: 13,
          }}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.05)" }}
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
          formatter={(value: any) => [`${value}%`, "Porcentaje"]}
        />

        {/* 🔹 Colores pastel personalizados */}
        <Bar dataKey="porcentaje" radius={[8, 8, 0, 0]} barSize={60}>
          {frecuencia.map((f, i) => {
            const colors = [
              "#A7F3D0", // verde menta
              "#FDE68A", // amarillo pastel
              "#C7D2FE", // lavanda
              "#FBCFE8", // rosado
              "#BAE6FD", // azul cielo
            ];
            return <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />;
          })}
          {/* 🔹 Etiqueta de porcentaje arriba */}
          <LabelList
            dataKey="porcentaje"
            position="top"
            formatter={(v: any) => `${v}%`}
            style={{ fill: "#374151", fontWeight: 600 }}
          />
          {/* 🔹 Etiqueta de categoría debajo */}
          <LabelList
            dataKey="categoria"
            position="insideBottom"
            dy={40}
            style={{
              fill: "#374151",
              fontSize: 12,
              fontWeight: 500,
              textAnchor: "middle",
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

      {/* 🔹 Tabla de comentarios */}
      <div className="overflow-x-auto mb-12 rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
          </colgroup>

          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-3 py-3 text-left font-semibold">Nombre</th>
              <th className="px-3 py-3 text-left font-semibold">Categoría</th>
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i} className="px-3 py-3 text-left font-semibold">
                  Comentario {i}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filtered.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 align-top">
                <td className="px-3 py-3 font-semibold text-gray-800 whitespace-normal break-words">
                  {item.nombre_normalizado || "Sin nombre"}
                </td>
                <td className="px-3 py-3 text-gray-700 whitespace-normal break-words">
                  {item.categ_Comentario || "—"}
                </td>

                {[
                  item.comentarios_1,
                  item.comentarios_2,
                  item.comentarios_3,
                  item.comentarios_4,
                  item.comentarios5,
                ].map((coment: any, j: number) => {
                  const key = `${i}-${j}`;
                  const isExpanded = !!expandedRows[key];
                  const text = (coment ?? "").toString();
                  const shortText = text.length > 200 ? text.slice(0, 200) + "..." : text;

                  return (
                    <td
                      key={j}
                      className="px-3 py-3 text-gray-700 align-top whitespace-normal break-words overflow-hidden"
                      style={{ maxHeight: isExpanded ? undefined : 220 }}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex-1">{isExpanded ? text : shortText}</div>

                        {text.length > 200 && (
                          <div className="mt-2">
                            <button
                              onClick={() => toggleExpand(i, j)}
                              className="text-emerald-600 text-xs hover:underline"
                            >
                              {isExpanded ? "Ver menos" : "Ver más"}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
