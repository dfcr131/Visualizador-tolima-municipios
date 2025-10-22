import { useState } from "react";
import { RegistroTuristicoPontevedra } from "../data/pontevedra";

interface DataTableProps {
  data: RegistroTuristicoPontevedra[];
}

function TruncatedText({ text, maxLength = 200 }: { text: string; maxLength?: number }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  const isTruncated = text.length > maxLength;
  const displayText = expanded ? text : text.slice(0, maxLength) + (isTruncated ? "…" : "");

  return (
    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
      {displayText}
      {isTruncated && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 text-emerald-600 hover:text-emerald-800 font-medium text-xs underline"
        >
          {expanded ? "Leer menos" : "Leer más"}
        </button>
      )}
    </p>
  );
}

// Helpers de parseo seguros (por si no vinieron los campos derivados)
const splitByComma = (s?: string) =>
  (s ?? "").split(",").map(t => t.trim()).filter(Boolean);

const splitByPipe = (s?: string) =>
  (s ?? "").split("|").map(t => t.trim()).filter(Boolean);

const toNumberSafe = (v: any) => {
  if (v == null) return NaN;
  const s = String(v).trim();
  if (!s) return NaN;
  const first = s.split("/")[0]; // maneja "9,7/10"
  const normalized = first.replace(/\./g, "").replace(/,/g, ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
};

const parseOpiniones = (v: any) => {
  if (typeof v === "number") return v;
  const m = String(v ?? "").match(/[\d.,]+/);
  return m ? toNumberSafe(m[0]) : NaN;
};

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
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[12%]">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[20%]">Descripción</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[12%]">Caminos</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[14%]">Características</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[7%]">Calificación</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[7%]">Opiniones</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[10%]">Conectividad</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[12%]">Redes</th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-[6%]">Ubicación</th>
                </tr>
              </thead>


              <tbody className="divide-y divide-gray-100 bg-white">
                {data.map((r, idx) => {
                  const caminos = (r as any).caminos_list ?? splitByPipe(r.situacion_caminos_de_santiago);
                  const car = splitByComma(r.caracteristicas);

                  const califNum = Number.isFinite((r as any).calificacion_num)
                    ? Number((r as any).calificacion_num)
                    : toNumberSafe(r.calificacion);

                  const opinNum = Number.isFinite((r as any).opiniones_num)
                    ? Number((r as any).opiniones_num)
                    : parseOpiniones(r.num_opiniones);

                  const hasWeb = !!(r.web && r.web.trim());
                  const hasEmail = !!(r.email && r.email.trim());
                  const hasTel = !!(r.telefono && r.telefono.trim());

                  const hasFb = !!(r.facebook_urls && r.facebook_urls.trim());
                  const hasIg = !!(r.instagram_urls && r.instagram_urls.trim());

                  const latOk = Number.isFinite(r.Latitud);
                  const lonOk = Number.isFinite(r.Longitud);
                  const mapHref =
                    latOk && lonOk ? `https://www.google.com/maps?q=${r.Latitud},${r.Longitud}` : undefined;

                  // Mostrar pocas características con "+N"
                  const maxChips = 4;
                  const firstChips = car.slice(0, maxChips);
                  const extraCount = Math.max(car.length - maxChips, 0);

                  return (
                    <tr key={idx} className="hover:bg-emerald-50 transition-colors duration-150 align-top">
                      {/* Nombre */}
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-normal break-words">
                        {r.nombre_normalizado || "—"}
                      </td>

                      {/* Descripción */}
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-normal break-words">
                        <TruncatedText text={r.descripcion || ""} maxLength={260} />
                      </td>

                      {/* Caminos */}
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex flex-wrap gap-1">
                          {caminos.length === 0 ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            caminos.map((c: string, i: number) => (
                              <span
                                key={`${c}-${i}`}
                                className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700"
                              >
                                {c}
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Características */}
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex flex-wrap gap-1">
                          {firstChips.length === 0 ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            firstChips.map((c: string, i: number) => (
                              <span
                                key={`${c}-${i}`}
                                className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700"
                              >
                                {c}
                              </span>
                            ))
                          )}
                          {extraCount > 0 && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                              +{extraCount}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Calificación */}
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {Number.isFinite(califNum) ? califNum.toFixed(1) : "—"}
                      </td>

                      {/* Opiniones */}
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {Number.isFinite(opinNum) ? Math.round(opinNum) : "—"}
                      </td>

                      {/* Conectividad */}
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex flex-wrap gap-1">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              hasWeb ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                            }`}
                            title={r.web}
                          >
                            Web
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              hasEmail ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                            }`}
                            title={r.email}
                          >
                            Email
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              hasTel ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                            }`}
                            title={r.telefono}
                          >
                            Teléfono
                          </span>
                        </div>
                      </td>

                      {/* Redes */}
                      <td className="px-4 py-3 text-xs text-gray-900 align-top">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">FB:</span>
                            {hasFb ? (
                              <a
                                href={r.facebook_urls}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-700 hover:text-emerald-900 underline truncate max-w-[120px] inline-block"
                                title={r.facebook_urls}
                              >
                                Ver
                              </a>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">IG:</span>
                            {hasIg ? (
                              <a
                                href={r.instagram_urls}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-700 hover:text-emerald-900 underline truncate max-w-[120px] inline-block"
                                title={r.instagram_urls}
                              >
                                Ver
                              </a>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Ubicación */}
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {latOk && lonOk ? (
                          <a
                            href={mapHref}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 hover:text-emerald-900 underline"
                            title="Abrir en Google Maps"
                          >
                            {r.Latitud.toFixed(5)}, {r.Longitud.toFixed(5)}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
