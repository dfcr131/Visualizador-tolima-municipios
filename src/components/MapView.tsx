import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { RegistroTuristico } from "../data/municipios";

interface MapViewProps {
  data: RegistroTuristico[];
}

export function MapView({ data }: MapViewProps) {
  const [geoTolima, setGeoTolima] = useState<any>(null);
  const [geoMunicipios, setGeoMunicipios] = useState<any>(null);

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const resTolima = await fetch("/data/tolima_departamento.geojson");
        const geoTolimaData = await resTolima.json();
        setGeoTolima(geoTolimaData);
      } catch (err) {
        console.error("❌ Error cargando tolima_departamento.geojson:", err);
      }

      try {
        const resMunicipios = await fetch("/data/col_municipios.geojson");
        const geoMunicipiosData = await resMunicipios.json();
        setGeoMunicipios(geoMunicipiosData);
      } catch (err) {
        console.error("❌ Error cargando col_municipios.geojson:", err);
      }
    };
    loadGeoData();
  }, []);

  // Conteo de registros por municipio
  const conteoPorMunicipio = useMemo(() => {
    const conteo: Record<string, number> = {};
    data.forEach((r) => {
      const nombre = r.municipio.toLowerCase();
      conteo[nombre] = (conteo[nombre] || 0) + 1;
    });
    return conteo;
  }, [data]);

  // === Estilos ===
  const baseStyle = {
    color: "#666",
    weight: 1,
    fillOpacity: 0.1,
  };

  const municipioStyle = (feature: any) => {
    const nombre = feature?.properties?.shapeName?.toLowerCase();
    if (nombre && conteoPorMunicipio[nombre]) {
      return {
        color: "#2563eb",
        weight: 2,
        fillColor: "#60a5fa",
        fillOpacity: 0.4,
      };
    }
    return baseStyle;
  };

  const tolimaStyle = {
    color: "#16a34a", // verde contorno
    weight: 3,
    fillColor: "#22c55e", // verde claro interior
    fillOpacity: 0.25, // ahora visible
  };



 

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Mapa de registros turísticos por municipio
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {/* Mapa */}
        <div className="col-span-2" style={{ height: "550px" }}>
          <MapContainer
            center={[4.1, -75.2]} // centrado sobre Tolima
            zoom={8}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Contorno del Tolima */}
            {geoTolima && <GeoJSON data={geoTolima} style={tolimaStyle} />}

            {/* Municipios dentro del Tolima */}
            {geoMunicipios && (
              <GeoJSON
                data={geoMunicipios}
                style={municipioStyle}
                onEachFeature={(feature, layer) => {
                  const nombre = feature?.properties?.shapeName;
                  if (nombre) {
                    layer.bindPopup(
                      `<b>${nombre}</b><br>Registros: ${
                        conteoPorMunicipio[nombre.toLowerCase()] || 0
                      }`
                    );
                  }
                }}
              />
            )}

          </MapContainer>
        </div>

        {/* Tabla lateral */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-y-auto h-[550px]">
          <h3 className="font-semibold text-gray-700 mb-2">
            Conteo por municipio
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-1">Municipio</th>
                <th className="text-right py-1"># Registros</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(conteoPorMunicipio)
                .sort((a, b) => b[1] - a[1])
                .map(([mun, count]) => (
                  <tr key={mun} className="border-b border-gray-200">
                    <td className="capitalize py-1">{mun}</td>
                    <td className="text-right py-1">{count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
