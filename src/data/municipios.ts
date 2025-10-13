import * as XLSX from "xlsx";

export interface RegistroTuristico {
  categoría: string;
  nombre: string;
  descripción: string;
  ubicación: string;
  municipio: string;
  fuente: string;
  info_relevante: string;
  "Aporte a la investigación": string;
}

export async function loadMunicipiosData(): Promise<RegistroTuristico[]> {
  const response = await fetch("/data/municipios_tolima.xlsx");
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<RegistroTuristico>(firstSheet);
  return data;
}
