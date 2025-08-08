"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { Mapa } from "../../types/mapa"

interface Props {
  mapas: Mapa[]
  marcadorActivo?: Mapa | null
}

// Subcomponente que se encarga de hacer flyTo cuando cambia el marcador activo
function MoverVista({ marcador }: { marcador: Mapa | null }) {
  const map = useMap()

  if (marcador) {
    map.flyTo([marcador.latitud, marcador.longitud], 16, {
      duration: 1.5,
    })
  }

  return null
}

export default function MapaProyecto({ mapas, marcadorActivo }: Props) {
  const centro: [number, number] = [19.4326, -99.1332] // CDMX

  return (
   <MapContainer
  center={[19.4326, -99.1332]}
  zoom={12}
  scrollWheelZoom={true}
  style={{ height: "600px", width: "100%" }}
>
  <TileLayer
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
</MapContainer>
  )
}
