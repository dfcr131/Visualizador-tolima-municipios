import * as XLSX from "xlsx";

export interface RegistroTuristicoPontevedra {
  // nuevos del Excel
  ciudad: string;
  link: string;
  direccion: string;
  tipo: string;
  categoria: string;

  // existentes
  telefono: string;
  email: string;
  web: string;
  situacion_caminos_de_santiago: string; // crudo
  nombre_normalizado: string;
  descripcion: string;
  caracteristicas: string;
  num_opiniones: string | number;        // crudo
  calificacion: string | number;         // crudo
  srcset: string;                        // crudo
  Latitud: number;
  Longitud: number;
  facebook_urls: string;
  instagram_urls: string;

  // derivados
  opiniones_num?: number;
  calificacion_num?: number;
  srcset_list?: string[];
  caminos_list?: string[];
}

function toStringSafe(v: any): string {
  return (v ?? "").toString().trim();
}
function toNumberFromLocale(v: any): number | null {
  if (v == null) return null;
  const s = v.toString().trim();
  if (!s) return null;
  const normalized = s.replace(/\s/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(/,/g, ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
function parseOpiniones(raw: any): number | null {
  const s = toStringSafe(raw);
  if (!s) return null;
  const m = s.match(/[\d.,]+/);
  if (!m) return null;
  const n = toNumberFromLocale(m[0]);
  return n ?? null;
}
function parseCalificacion(raw: any): number | null {
  const s = toStringSafe(raw);
  if (!s) return null;
  const firstNum = s.split("/")[0]; // e.g. "3,8/5"
  const n = toNumberFromLocale(firstNum);
  return n ?? null;
}
function parseLatLon(raw: any): number {
  if (raw == null) return NaN;
  let s = raw.toString().trim();
  s = s.replace(",", ".").replace(/\s+/g, "");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : NaN;
}

function splitList(raw: any): string[] {
  const s = toStringSafe(raw);
  if (!s) return [];
  return s.split(",").map(u => u.trim()).filter(Boolean);
}
function splitPipes(raw: any): string[] {
  const s = toStringSafe(raw);
  if (!s) return [];
  return s.split("|").map(v => v.trim()).filter(Boolean);
}

export async function loadMunicipiosDataPontevedra(): Promise<RegistroTuristicoPontevedra[]> {
  const response = await fetch("/data/pontevedra.xlsx", { cache: "no-store" });
  const arrayBuffer = await response.arrayBuffer();

  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const candidateNames = ["Sheet1", "Hoja1", "Pontevedra", workbook.SheetNames[0]];
  const sheetName = candidateNames.find(n => workbook.SheetNames.includes(n)) ?? workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) throw new Error(`No se encontró la hoja '${sheetName}' en pontevedra.xlsx`);

const rawData = XLSX.utils.sheet_to_json<any>(worksheet, { defval: "", raw: true });

  const data: RegistroTuristicoPontevedra[] = rawData.map((row) => {
    // columnas EXACTAS de tu Excel
    const ciudad = toStringSafe(row["ciudad"]);
    const link = toStringSafe(row["link"]);
    const direccion = toStringSafe(row["direccion"]);
    const tipo = toStringSafe(row["tipo"]);          // ← para tu filtro "Tipo"
    const categoria = toStringSafe(row["categoria"]);

    const telefono = toStringSafe(row["telefono"]);
    const email = toStringSafe(row["email"]).toLowerCase();
    const web = toStringSafe(row["web"]);
    const situacion = toStringSafe(row["situacion_caminos_de_santiago"]);
    const nombre = toStringSafe(row["nombre_normalizado"]);
    const descripcion = toStringSafe(row["descripcion"]);
    const caracteristicas = toStringSafe(row["caracteristicas"]);
    const numOpinionesRaw = row["num_opiniones"];
    const calificacionRaw = row["calificacion"];
    const srcset = toStringSafe(row["srcset"]);

    // tolera encabezados "Latitu"/"Latitud" y "Longitu"/"Longitud"
    const lat = parseLatLon(row["Latitud"] ?? row["Latitu"]);
    const lon = parseLatLon(row["Longitud"] ?? row["Longitu"]);

    const facebook = toStringSafe(row["facebook_urls"]);
    const instagram = toStringSafe(row["instagram_urls"]);

    // derivados
    const opinionesNum = parseOpiniones(numOpinionesRaw) ?? undefined;
    const calificacionNum = parseCalificacion(calificacionRaw) ?? undefined;
    const srcsetList = srcset ? splitList(srcset) : [];
    const caminosList = splitPipes(situacion);

    return {
      ciudad,
      link,
      direccion,
      tipo,
      categoria,

      telefono,
      email,
      web,
      situacion_caminos_de_santiago: situacion,
      nombre_normalizado: nombre,
      descripcion,
      caracteristicas,
      num_opiniones: typeof numOpinionesRaw === "number" ? numOpinionesRaw : toStringSafe(numOpinionesRaw),
      calificacion: typeof calificacionRaw === "number" ? calificacionRaw : toStringSafe(calificacionRaw),
      srcset,
      Latitud: lat,
      Longitud: lon,
      facebook_urls: facebook,
      instagram_urls: instagram,

      opiniones_num: opinionesNum,
      calificacion_num: calificacionNum,
      srcset_list: srcsetList,
      caminos_list: caminosList,
    };
  }).filter(r =>
    r.nombre_normalizado ||
    (Number.isFinite(r.Latitud) && Number.isFinite(r.Longitud))
  );

  return data;
}
