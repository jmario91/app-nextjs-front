"use client"

import { useState } from "react"
import { MapaData } from "lib/data/mapaDatos"
import { Mapa } from "../../types/mapa"
import dynamic from "next/dynamic"

const MapaProyecto = dynamic(() => import('../../components/mapa/MapaProyecto'), {
  ssr: false,
})

export default function PaginaMapa() {
  const [marcadorActivo, setMarcadorActivo] = useState<Mapa | null>(null)
  console.log("MapaData:", MapaData)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 min-h-screen bg-light">
  {/* Listado */}
  <div className="space-y-4">
    {MapaData.map((p) => (
      <div
        key={p.id}
        className="bg-white shadow-md p-4 rounded cursor-pointer hover:bg-gray-100 transition"
        onClick={() => setMarcadorActivo(p)}
      >
        <h3 className="font-semibold">{p.nombre}</h3>
        <p>{p.colonia}, {p.ciudad}</p>
        <p className="text-success">
          ${p.precio.toLocaleString("es-MX")}
        </p>
      </div>
    ))}
  </div>

 {/* Mapa */}
<div className="bg-white shadow-md rounded overflow-hidden h-[600px] col-span-1 md:col-span-1">
  <h3 className="font-semibold p-2 border-b">MAPA</h3>
  <MapaProyecto mapas={MapaData} marcadorActivo={marcadorActivo} />
</div>

</div>

  )
}
