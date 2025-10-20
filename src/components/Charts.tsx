import React, { useMemo, useState } from "react";
import { RegistroTuristicoPontevedra } from "../data/pontevedra";

/** ===== Helpers ===== */
const splitByPipe = (s?: string) =>
  (s ?? "").split("|").map((t) => t.trim()).filter(Boolean);

const toNumberSafe = (v: any) => {
  if (v == null) return NaN;
  const s = String(v).trim();
  if (!s) return NaN;
  const first = s.split("/")[0]; // ej: "4,5/5"
  const normalized = first.replace(/\./g, "").replace(/,/g, ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
};

const parseOpiniones = (v: any) => {
  if (typeof v === "number") return v;
  const m = String(v ?? "").match(/[\d.,]+/);
  return m ? toNumberSafe(m[0]) : NaN;
};

type Pair = [string, number];
const sortDesc = (a: Pair[], n = Infinity) =>
  [...a].sort((x, y) => y[1] - x[1]).slice(0, n);

/** ===== Tarjeta reutilizable con Top 5 + "Ver más" ===== */
function BarCard({
  title,
  dataAll,
  colorClasses,
  valueFormat,
  topN = 5,
}: {
  title: string;
  dataAll: Pair[];
  colorClasses: { text: string; bar: string }; // evita clases dinámicas
  valueFormat?: (n: number) => string;
  topN?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const data = expanded ? dataAll : dataAll.slice(0, topN);
  const maxValue = Math.max(...(dataAll.map(([, v]) => v)), 1);
  const totalItems = dataAll.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {totalItems > topN && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-sm px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            {expanded ? "Ver menos" : "Ver más"}
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <div className="text-gray-400 text-sm mt-4">Sin datos</div>
      ) : (
        <div className="space-y-4 mt-4">
          {data.map(([label, val]) => (
            <div key={label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 truncate">{label || "—"}</span>
                <span className={`font-semibold ${colorClasses.text}`}>
                  {valueFormat ? valueFormat(val) : val}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${colorClasses.bar}`}
                  style={{ width: `${(val / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {!expanded && totalItems > topN && (
            <div className="text-xs text-gray-500">
              Mostrando {topN} de {totalItems}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** ===== Componente principal ===== */
export function Charts({ data }: { data: RegistroTuristicoPontevedra[] }) {
  /** Registros por tipo */
  const tipoData: Pair[] = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of data) {
      const tipo = (r as any).tipo || "Sin tipo";
      counts[tipo] = (counts[tipo] || 0) + 1;
    }
    return sortDesc(Object.entries(counts), 9999);
  }, [data]);

  /** Registros por Camino de Santiago */
  const caminoData: Pair[] = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of data) {
      const caminos: string[] =
        ((r as any).caminos_list as string[] | undefined) ??
        splitByPipe(r.situacion_caminos_de_santiago);
      caminos.forEach((c) => {
        if (!c) return;
        counts[c] = (counts[c] || 0) + 1;
      });
    }
    return sortDesc(Object.entries(counts), 9999);
  }, [data]);

  /** Promedio de calificación por tipo (1–5) */
  const califPromedioData: Pair[] = useMemo(() => {
    const agg: Record<string, { sum: number; count: number }> = {};
    for (const r of data) {
      const tipo = (r as any).tipo || "Sin tipo";
      const val = Number.isFinite((r as any).calificacion_num)
        ? Number((r as any).calificacion_num)
        : toNumberSafe(r.calificacion);
      if (!Number.isFinite(val)) continue;
      (agg[tipo] ||= { sum: 0, count: 0 });
      agg[tipo].sum += val;
      agg[tipo].count += 1;
    }
    const out: Pair[] = Object.entries(agg).map(([tipo, { sum, count }]) => [
      tipo,
      sum / Math.max(count, 1),
    ]);
    return sortDesc(out, 9999);
  }, [data]);

  /** Promedio de opiniones por tipo (0–2000) */
  const opinPromedioData: Pair[] = useMemo(() => {
    const agg: Record<string, { sum: number; count: number }> = {};
    for (const r of data) {
      const tipo = (r as any).tipo || "Sin tipo";
      const val = Number.isFinite((r as any).opiniones_num)
        ? Number((r as any).opiniones_num)
        : parseOpiniones(r.num_opiniones);
      if (!Number.isFinite(val)) continue;
      (agg[tipo] ||= { sum: 0, count: 0 });
      agg[tipo].sum += val;
      agg[tipo].count += 1;
    }
    const out: Pair[] = Object.entries(agg).map(([tipo, { sum, count }]) => [
      tipo,
      sum / Math.max(count, 1),
    ]);
    return sortDesc(out, 9999);
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarCard
          title="Registros por tipo"
          dataAll={tipoData}
          colorClasses={{ text: "text-emerald-600", bar: "from-emerald-400 to-teal-500" }}
          valueFormat={(n) => `${Math.round(n)}`}
          topN={5}
        />
        <BarCard
          title="Registros por Camino de Santiago"
          dataAll={caminoData}
          colorClasses={{ text: "text-blue-600", bar: "from-blue-400 to-cyan-500" }}
          valueFormat={(n) => `${Math.round(n)}`}
          topN={5}
        />
        <BarCard
          title="Promedio de calificación por tipo"
          dataAll={califPromedioData}
          colorClasses={{ text: "text-amber-600", bar: "from-amber-400 to-yellow-500" }}
          valueFormat={(n) => n.toFixed(2)}
          topN={5}
        />
        <BarCard
          title="Promedio de opiniones por tipo"
          dataAll={opinPromedioData}
          colorClasses={{ text: "text-purple-600", bar: "from-purple-400 to-fuchsia-500" }}
          valueFormat={(n) => `${Math.round(n)}`}
          topN={5}
        />
      </div>
    </div>
  );
}
