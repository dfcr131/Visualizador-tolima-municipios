import { RegistroTuristicoPontevedra } from "../data/pontevedra";

export function CardView({ data }: { data: RegistroTuristicoPontevedra[] }) {
  // Función para obtener la imagen por defecto dependiendo del tipo
  const getDefaultImage = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "cafetería / café bar":
        return "/images/default-cafe.jpg";  // Imagen predeterminada para café/bar
      case "restaurante":
        return "/images/default-restaurante.jpg";  // Imagen predeterminada para restaurante
      case "espacio natural / recreativo":
        return "/images/default-espacio-natural.jpg";  // Imagen predeterminada para espacio natural
      case "alojamiento":
        return "/images/default-alojamiento.jpg";  // Imagen predeterminada para alojamiento
      case "hotel":
        return "/images/default-hotel.jpg";  // Imagen predeterminada para hotel
      case "actividades turísticas / deportivas":
        return "/images/default-actividades.jpg";  // Imagen predeterminada para actividades
      case "apartamento turístico":
        return "/images/default-apartamento.jpg";  // Imagen predeterminada para apartamento
      case "área de autocaravanas":
        return "/images/default-autocaravanas.jpg";  // Imagen predeterminada para autocaravanas
      case "agencia de viajes":
        return "/images/default-agencia.jpg";  // Imagen predeterminada para agencia de viajes
      case "patrimonio arquitectónico":
        return "/images/default-patrimonio.jpg";  // Imagen predeterminada para patrimonio
      case "lugar religioso":
        return "/images/default-lugar-religioso.jpg";  // Imagen predeterminada para lugar religioso
      case "comercio":
        return "/images/default-comercio.jpg";  // Imagen predeterminada para comercio
      case "turismo rural":
        return "/images/default-turismo-rural.jpg";  // Imagen predeterminada para turismo rural
      case "centro cultural / museo":
        return "/images/default-cultura.jpg";  // Imagen predeterminada para centro cultural
      case "instalación náutica":
        return "/images/default-nautica.jpg";  // Imagen predeterminada para instalación náutica
      case "mirador":
        return "/images/default-mirador.jpg";  // Imagen predeterminada para mirador
      case "elemento histórico / artístico":
        return "/images/default-historico.jpg";  // Imagen predeterminada para elemento histórico
      case "zona de especial conservación":
        return "/images/default-conservacion.jpg";  // Imagen predeterminada para zona de conservación
      case "taller artesanal":
        return "/images/default-taller.jpg";  // Imagen predeterminada para taller artesanal
      case "cascadas":
        return "/images/default-cascada.jpg";  // Imagen predeterminada para cascadas
      case "evento turístico":
        return "/images/default-evento.jpg";  // Imagen predeterminada para evento turístico
      case "administración pública":
        return "/images/default-administracion.jpg";  // Imagen predeterminada para administración pública
      case "punto de información turística":
        return "/images/default-info.jpg";  // Imagen predeterminada para punto de información
      case "centro de eventos":
        return "/images/default-centro-eventos.jpg";  // Imagen predeterminada para centro de eventos
      case "playa":
        return "/images/default-playa.jpg";  // Imagen predeterminada para playa
      case "transporte":
        return "/images/default-transporte.jpg";  // Imagen predeterminada para transporte
      case "accidente geográfico":
        return "/images/default-accidente.jpg";  // Imagen predeterminada para accidente geográfico
      case "paseo urbano":
        return "/images/default-paseo-urbano.jpg";  // Imagen predeterminada para paseo urbano
      case "otro atractivo turístico":
        return "/images/default-otro.jpg";  // Imagen predeterminada para otro atractivo turístico
      default:
        return "/images/default-placeholder.jpg";  // Imagen predeterminada genérica en caso de que no coincida el tipo
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((registro) => {
        // Si no tiene imágenes en srcset_list, usar la imagen por defecto
        const imageSrc =
          registro.srcset_list && registro.srcset_list.length > 0
            ? registro.srcset_list[0] // Mostrar la primera imagen del array
            : getDefaultImage(registro.tipo); // Usar la imagen por defecto dependiendo del tipo

        return (
          <div key={registro.telefono} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Imagen de la tarjeta */}
            <img
              src={imageSrc}
              alt={registro.nombre_normalizado}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{registro.nombre_normalizado}</h3>
              <p className="text-sm text-gray-600">{registro.tipo}</p>
              <p className="text-sm text-gray-600">{registro.descripcion.slice(0, 100)}...</p>
              <div className="mt-2 text-sm text-gray-700">
                <strong>Calificación:</strong> {registro.calificacion}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Opiniones:</strong> {registro.num_opiniones}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
