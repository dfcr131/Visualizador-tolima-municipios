import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { RegistroTuristicoPontevedra } from "../data/pontevedra";

interface MapViewProps {
  data: RegistroTuristicoPontevedra[];
  selectedTipos: string[];
  selectedCaminos: string[];
  calificacionRange: [number, number];
  opinionesRange: [number, number];
  searchTerm: string;
}

export function MapView({
  data,
  selectedTipos,
  selectedCaminos,
  calificacionRange,
  opinionesRange,
  searchTerm,
}: MapViewProps) {
  // Filtro de los datos
  const filteredData = useMemo(() => {
    const filtered = data.filter((registro) => {
      const matchesSearch =
        searchTerm === "" ||
        Object.values(registro).some((v) =>
          String(v ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        );

      const tipo = registro.tipo ?? "";
      const matchesTipo =
        selectedTipos.length === 0 || selectedTipos.includes(tipo);

      const caminos =
        (registro.caminos_list as string[] | undefined) ??
        registro.situacion_caminos_de_santiago?.split("|") ?? [];
      const matchesCamino =
        selectedCaminos.length === 0 ||
        selectedCaminos.every((c) => caminos.includes(c));

      const califNum = parseFloat(registro.calificacion as string) || 0;
      const matchesCalificacion =
        califNum >= calificacionRange[0] && califNum <= calificacionRange[1];

      const opiniones = parseInt(String(registro.num_opiniones), 10) || 0;
      const matchesOpiniones =
        opiniones >= opinionesRange[0] && opiniones <= opinionesRange[1];

      return (
        matchesSearch &&
        matchesTipo &&
        matchesCamino &&
        matchesCalificacion &&
        matchesOpiniones
      );
    });
    
    console.log("Filtered Data Length:", filtered.length); // Verifica cuántos datos están siendo filtrados

    return filtered;
  }, [
    data,
    selectedTipos,
    selectedCaminos,
    calificacionRange,
    opinionesRange,
    searchTerm,
  ]);

  // Verifica si los filtros están funcionando correctamente
  useEffect(() => {
    console.log("Filtered Data:", filteredData); // Verificar si hay datos filtrados correctamente
  }, [filteredData]);

  return (
    <div>
      {filteredData.length === 0 ? (
        <p>No se encontraron registros para mostrar en el mapa</p>
      ) : (
        <MapContainer
          center={{ lat: 42.428, lng: -8.644 }} // Ajusta esto si es necesario
          zoom={12}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredData.map((registro) => {
            if (!registro.Latitud || !registro.Longitud) return null; // Asegúrate de que las coordenadas sean válidas

            return (
              <Marker
                key={registro.telefono}
                position={{
                  lat: registro.Latitud,
                  lng: registro.Longitud,
                }}
              >
                <Popup>
                  <b>{registro.nombre_normalizado}</b> {/* Mostrar el nombre aquí */}
                  <br />
                  Tipo: {registro.tipo}
                  <br />
                  Calificación: {registro.calificacion}
                  <br />
                  Opiniones: {registro.num_opiniones}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
}
