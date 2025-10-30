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
import {
  Info,
  Package,
  Users,
  Shield,
  CreditCard,
  Clock,
  Star,
  MapPin,
  Leaf,
  FileCheck,
  GraduationCap,
} from "lucide-react";

interface CommentsViewProps {
  data: any[];
}

export function CommentsView({ data }: CommentsViewProps) {
  const [categoria, setCategoria] = useState("Todas");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const categorias = useMemo(() => {
    const unique = new Set(data.map((d) => d.categ_Comentario || "Sin categoría"));
    return ["Todas", ...Array.from(unique)];
  }, [data]);

  const filtered = useMemo(() => {
    if (categoria === "Todas") return data;
    return data.filter((d) => d.categ_Comentario === categoria);
  }, [data, categoria]);

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

  // 🔹 Diccionario de categorías con descripciones e íconos
  const categoriasInfo = [
    { nombre: "Producto y oferta", descripcion: "Calidad, variedad, origen.", icon: Package, color: "bg-yellow-100" },
    { nombre: "Servicio y hospitalidad", descripcion: "Atención, amabilidad, hospitalidad gallega.", icon: Users, color: "bg-green-100" },
    { nombre: "Higiene y seguridad alimentaria", descripcion: "Manipulación, conservación, APPCC.", icon: Shield, color: "bg-red-100" },
    { nombre: "Precios y forma de pago", descripcion: "Coherencia precio-valor, medios de pago.", icon: CreditCard, color: "bg-pink-100" },
    { nombre: "Horarios y capacidad", descripcion: "Horarios poco claros, reservas, aforo.", icon: Clock, color: "bg-purple-100" },
    { nombre: "Marketing y reputación", descripcion: "Reseñas, reputación online, respuesta a quejas.", icon: Star, color: "bg-blue-100" },
    { nombre: "Señalización y accesibilidad", descripcion: "Señalética, accesos PMR.", icon: MapPin, color: "bg-orange-100" },
    { nombre: "Experiencia del cliente", descripcion: "Ambientación, tiempos, idiomas.", icon: Info, color: "bg-indigo-100" },
    { nombre: "Sostenibilidad y economía circular", descripcion: "Desperdicio, envases, proveedores locales.", icon: Leaf, color: "bg-lime-100" },
    { nombre: "Cumplimiento normativo", descripcion: "Licencias, información al consumidor.", icon: FileCheck, color: "bg-sky-100" },
    { nombre: "Talento y formación", descripcion: "Protocolo, atención, barismo/coctelería.", icon: GraduationCap, color: "bg-teal-100" },
  ];

  return (
    <div className="p-6 bg-white/80 rounded-2xl shadow-md max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-emerald-700 text-center">
        Necesidades identificadas
      </h2>

      {/* 🔹 Filtro */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <label className="font-medium mr-2 text-gray-700">Filtrar por necesidad:</label>
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

      {/* 🔹 Contenedor combinado: gráfico + tarjetas verticales */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        {/* Gráfico */}
        <div className="flex-1 bg-gradient-to-b from-emerald-50 to-white p-6 rounded-2xl border border-gray-200 shadow-inner overflow-hidden">
          <h3 className="text-lg font-semibold text-center text-gray-700 mb-6">
            Frecuencia de necesidades identificadas (Top 5)
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
                <XAxis hide />
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
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: any, name: string, props: any) => {
                    const count = props?.payload?.count || 0;
                    return [
                      <>
                        <span style={{ fontWeight: 600, color: "#059669" }}>
                          {count} comentarios
                        </span>
                        <br />
                        <span style={{ color: "#374151" }}>Porcentaje: {value}%</span>
                      </>,
                    ];
                  }}
                  labelFormatter={(label) => `${label}`}
                />

                <Bar dataKey="porcentaje" radius={[8, 8, 0, 0]} barSize={60}>
                  {frecuencia.map((_, i) => {
                    const colors = ["#A7F3D0", "#FDE68A", "#C7D2FE", "#FBCFE8", "#BAE6FD"];
                    return <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />;
                  })}
                  <LabelList
                    dataKey="porcentaje"
                    position="top"
                    formatter={(v: any) => `${v}%`}
                    style={{ fill: "#374151", fontWeight: 600 }}
                  />
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

        {/* Tarjetas verticales al lado derecho */}
        <div className="flex flex-col gap-3 w-full lg:w-[40%] overflow-y-auto max-h-[420px] pr-2">
          {categoriasInfo.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all ${cat.color}`}
                whileHover={{ scale: 1.03 }}
              >
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <Icon className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{cat.nombre}</h4>
                  <p className="text-gray-600 text-xs mt-1">{cat.descripcion}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 🔹 Tabla de comentarios */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            {[1, 2, 3, 4, 5].map(() => (
              <col style={{ width: "16%" }} />
            ))}
          </colgroup>

          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-3 py-3 text-left font-semibold">Nombre</th>
              <th className="px-3 py-3 text-left font-semibold">Necesidades</th>
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

                {[item.comentarios_1, item.comentarios_2, item.comentarios_3, item.comentarios_4, item.comentarios5].map(
                  (coment: any, j: number) => {
                    const key = `${i}-${j}`;
                    const isExpanded = !!expandedRows[key];
                    const text = (coment ?? "").toString();
                    const shortText = text.length > 200 ? text.slice(0, 200) + "..." : text;

                    return (
                      <td key={j} className="px-3 py-3 text-gray-700 align-top whitespace-normal break-words">
                        <div className="flex flex-col h-full">
                          <div className="flex-1">{isExpanded ? text : shortText}</div>
                          {text.length > 200 && (
                            <button
                              onClick={() => toggleExpand(i, j)}
                              className="text-emerald-600 text-xs mt-2 hover:underline"
                            >
                              {isExpanded ? "Ver menos" : "Ver más"}
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  }
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
