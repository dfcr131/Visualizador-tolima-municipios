import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
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
  // 🎯 Íconos (emojis) por tipo
  const tipoIcons: Record<string, string> = {
    "Cafetería / Café bar": "☕",
    "Restaurante": "🍽️",
    "Espacio natural / recreativo": "🌳",
    "Alojamiento": "🏠",
    "Hotel": "🏨",
    "Actividades turísticas / deportivas": "🏄",
    "Apartamento turístico": "🏘️",
    "Área de autocaravanas": "🚐",
    "Agencia de viajes": "🧭",
    "Patrimonio arquitectónico": "🏛️",
    "Lugar religioso": "⛪",
    "Comercio": "🛍️",
    "Turismo rural": "🌾",
    "Centro cultural / museo": "🏺",
    "Instalación náutica": "⛵",
    "Mirador": "🔭",
    "Elemento histórico / artístico": "🗿",
    "Zona de especial conservación": "🦋",
    "Taller artesanal": "🧶",
    "Cascadas": "💦",
    "Evento turístico": "🎉",
    "Administración pública": "🏢",
    "Punto de información turística": "ℹ️",
    "Centro de eventos": "🎭",
    "Playa": "🏖️",
    "Transporte": "🚌",
    "Accidente geográfico": "⛰️",
    "Paseo urbano": "🚶‍♂️",
    "Otro atractivo turístico": "⭐",
  };

  // 📊 Filtro de los datos
  const filteredData = useMemo(() => {
    return data.filter((registro) => {
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
        registro.situacion_caminos_de_santiago?.split("|") ??
        [];
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
  }, [
    data,
    selectedTipos,
    selectedCaminos,
    calificacionRange,
    opinionesRange,
    searchTerm,
  ]);

  // 🎨 Crear íconos personalizados
  const createEmojiIcon = (emoji: string) =>
    L.divIcon({
      html: `<div style="font-size: 24px;">${emoji}</div>`,
      className: "emoji-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });

  // 🔍 Para depuración
  useEffect(() => {
    console.log("Filtered Data Length:", filteredData.length);
  }, [filteredData]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        alignItems: "flex-start",
      }}
    >
      {/* 🗺️ Mapa principal */}
      <div style={{ flex: 1 }}>
        {filteredData.length === 0 ? (
          <p>No se encontraron registros para mostrar en el mapa</p>
        ) : (
          <MapContainer
            center={{ lat: 42.428, lng: -8.644 }}
            zoom={12}
            style={{
              height: "500px",
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredData.map((registro) => {
              if (!registro.Latitud || !registro.Longitud) return null;

              const emoji =
                tipoIcons[registro.tipo ?? "Otro atractivo turístico"] ?? "⭐";

              return (
                <Marker
                  key={`${registro.nombre_normalizado}-${registro.telefono}`}
                  position={{ lat: registro.Latitud, lng: registro.Longitud }}
                  icon={createEmojiIcon(emoji)}
                >
                  <Popup>
                    <b>{registro.nombre_normalizado}</b>
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

      {/* 🧭 Leyenda fuera del mapa */}
      <div
        style={{
          width: "280px",
          backgroundColor: "white",
          padding: "12px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          overflowY: "auto",
          maxHeight: "500px",
        }}
      >
        <h4 style={{ marginTop: 0 }}>🗺️ Leyenda de tipos</h4>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {Object.entries(tipoIcons).map(([tipo, emoji]) => (
            <li
              key={tipo}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <span style={{ fontSize: "20px", marginRight: "8px" }}>
                {emoji}
              </span>
              <span>{tipo}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
