import { useState } from "react";
import { RegistroTuristicoPontevedra } from "../data/pontevedra";

// Componente para truncar texto
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

// Funciones auxiliares
const splitByComma = (s?: string) => (s ?? "").split(",").map(t => t.trim()).filter(Boolean);
const splitByPipe = (s?: string) => (s ?? "").split("|").map(t => t.trim()).filter(Boolean);

const toNumberSafe = (v: any): number => {
  if (v == null) return NaN;
  const s = String(v).trim();
  if (!s) return NaN;
  const first = s.split("/")[0]; // Maneja "9,7/10"
  const normalized = first.replace(/\./g, "").replace(/,/g, ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
};

const parseOpiniones = (v: any): number => {
  if (typeof v === "number") return v;
  const m = String(v ?? "").match(/[\d.,]+/);
  return m ? toNumberSafe(m[0]) : NaN;
};

// Función para obtener imagen por tipo
const getDefaultImage = (tipo: string) => {
  switch (tipo.toLowerCase()) {
    case "cafetería / café bar":
      return "/images/default-cafe.jpg";
    case "restaurante":
      return "/images/default-restaurante.jpg";
    case "espacio natural / recreativo":
      return "/images/default-espacio-natural.jpg";
    case "alojamiento":
      return "/images/default-alojamiento.jpg";
    case "hotel":
      return "/images/default-hotel.jpg";
    case "actividades turísticas / deportivas":
      return "/images/default-actividades.jpg";
    case "apartamento turístico":
      return "/images/default-apartamento.jpg";
    case "área de autocaravanas":
      return "/images/default-autocaravanas.jpg";
    case "agencia de viajes":
      return "/images/default-agencia.jpg";
    case "patrimonio arquitectónico":
      return "/images/default-patrimonio.jpg";
    case "lugar religioso":
      return "/images/default-lugar-religioso.jpg";
    case "comercio":
      return "/images/default-comercio.jpg";
    case "turismo rural":
      return "/images/default-turismo-rural.jpg";
    case "centro cultural / museo":
      return "/images/default-cultura.jpg";
    case "instalación náutica":
      return "/images/default-nautica.jpg";
    case "mirador":
      return "/images/default-mirador.jpg";
    case "elemento histórico / artístico":
      return "/images/default-historico.jpg";
    case "zona de especial conservación":
      return "/images/default-conservacion.jpg";
    case "taller artesanal":
      return "/images/default-taller.jpg";
    case "cascadas":
      return "/images/default-cascada.jpg";
    case "evento turístico":
      return "/images/default-evento.jpg";
    case "administración pública":
      return "/images/default-administracion.jpg";
    case "punto de información turística":
      return "/images/default-info.jpg";
    case "centro de eventos":
      return "/images/default-centro-eventos.jpg";
    case "playa":
      return "/images/default-playa.jpg";
    case "transporte":
      return "/images/default-transporte.jpg";
    case "accidente geográfico":
      return "/images/default-accidente.jpg";
    case "paseo urbano":
      return "/images/default-paseo-urbano.jpg";
    case "otro atractivo turístico":
      return "/images/default-otro.jpg";
    default:
      return "/images/default-placeholder.jpg";
  }
};

// =======================
// Componente principal
// =======================
export function CardView({ data }: { data: RegistroTuristicoPontevedra[] }) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((registro, idx) => {
        const caminos = splitByPipe(registro.situacion_caminos_de_santiago);
        const car = splitByComma(registro.caracteristicas);

        let califNum: number = 0;
        if (typeof registro.calificacion_num === "number") {
          califNum = registro.calificacion_num;
        } else {
          califNum = toNumberSafe(registro.calificacion);
        }
        if (!Number.isFinite(califNum)) califNum = 0;

        let opinNum: number = 0;
        if (typeof registro.opiniones_num === "number") {
          opinNum = registro.opiniones_num;
        } else {
          opinNum = parseOpiniones(registro.num_opiniones);
        }
        if (!Number.isFinite(opinNum)) opinNum = 0;

        const imageSrc =
          registro.srcset_list && registro.srcset_list.length > 0
            ? registro.srcset_list[0]
            : getDefaultImage(registro.tipo);

        return (
          <div
            key={idx}
            className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <div className="h-40 w-full overflow-hidden">
              <img
                src={imageSrc}
                alt={registro.nombre_normalizado}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col flex-grow p-4">
              {/* Título */}
              <h3 className="font-semibold text-lg mb-1 text-gray-900 line-clamp-2 min-h-[48px]">
                {registro.nombre_normalizado || "—"}
              </h3>

              {/* Descripción truncada */}
              <div className="flex-grow">
                <TruncatedText text={registro.descripcion || ""} maxLength={180} />
              </div>

              {/* Información adicional */}
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <div>
                  <strong>Caminos: </strong>
                  {caminos.length === 0 ? "—" : caminos.join(", ")}
                </div>
                <div>
                  <strong>Características: </strong>
                  {car.length === 0 ? "—" : car.slice(0, 3).join(", ")}
                  {car.length > 3 && ` +${car.length - 3}`}
                </div>
                <div>
                  <strong>Según su calificación: </strong>
                  {registro.calificacionCualitativa || "—"}
                </div>
              </div>

              {/* Calificación y opiniones */}
              <div className="mt-4 flex justify-between text-sm text-gray-800 font-medium border-t border-gray-100 pt-2">
                <div>
                  <strong>⭐ Calificación:</strong>{" "}
                  {califNum !== 0 ? califNum.toFixed(1) : "—"}
                </div>
                <div>
                  <strong>💬 Opiniones:</strong>{" "}
                  {opinNum !== 0 ? Math.round(opinNum) : "—"}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

