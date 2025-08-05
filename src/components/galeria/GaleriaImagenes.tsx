"use client"

import Image from "next/image"
import { useState } from "react"
import VisorCarrusel from "./VisorCarrusel"
import { Imagen } from "../../types/imagen"
import { imagenes } from "../../lib/data/imagenes"
 
 
export default function GaleriaImagenes() {
  const [mostrarCarrusel, setMostrarCarrusel] = useState(false)
  const [imagenIdActiva, setImagenIdActiva] = useState<number | null>(null)

  const abrirCarrusel = (id: number) => {
    setImagenIdActiva(id)
    setMostrarCarrusel(true)
  }

  return (
    <>
      <div className="container py-4">
        <div className="row justify-content-center">
          {imagenes.map((img) => (
            <div className="col-md-3 mb-4" key={img.id}>
              <div
                className="card h-100 shadow-sm"
                role="button"
                onClick={() => abrirCarrusel(img.id)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={300}
                  height={200}
                  className="card-img-top"
                  style={{ objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{img.titulo}</h5>
                  <p className="card-text">
                    <strong>Categoría:</strong> {img.categoria} <br />
                    <strong>Fecha:</strong>{" "}
                    {new Date(img.fecha).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VisorCarrusel
        imagenes={imagenes}
        imagenInicial={imagenIdActiva ?? 0}
        show={mostrarCarrusel}
        onClose={() => setMostrarCarrusel(false)}
      />
    </>
  )
}
