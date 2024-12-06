"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ markers }) {
  // Asegúrate de que `markers` sea un array antes de usar .map()
  if (!Array.isArray(markers)) {
    console.error("El prop 'markers' no es un array:", markers);
    return null; // Evita renderizar el mapa si los datos no son correctos
  }

  return (
    <MapContainer
      center={[36.7213, -4.4214]} // Coordenadas de Málaga
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lon]}>
          <Popup>
            <strong>{marker.nombreParada}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}


