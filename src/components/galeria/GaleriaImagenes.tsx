"use client"

import Image from "next/image"
import { useState } from "react"
import { mediaGaleria } from "../../lib/data/mediaGaleria"
import VisorCarrusel from "./VisorCarrusel"

export default function GaleriaImagenes() {
  const [mostrarCarrusel, setMostrarCarrusel] = useState(false)
  const [mediaIndexActivo, setMediaIndexActivo] = useState<number | null>(null)

  const abrirCarrusel = (index: number) => {
    console.log("Abrir carrusel para el índice:", index)
    setMediaIndexActivo(index)
    setMostrarCarrusel(true)
  }

  return (
    <>
      <div className="container py-4">
        <div className="row justify-content-center">
          {mediaGaleria.map((item, index) => (
            <div className="col-md-3 mb-4" key={item.id}>
              <div
                className="card h-100 shadow-sm position-relative"
                role="button"
                onClick={() => abrirCarrusel(index)}
              >
                {item.tipo === "imagen" ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={300}
                    height={200}
                    className="card-img-top"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <video
                    src={item.src}
                    className="card-img-top"
                    style={{ objectFit: "cover", height: 200 }}
                    muted
                    loop
                    autoPlay
                  />
                )}

                {item.tipo === "video" && (
                  <span className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75">
                    🎥 Video
                  </span>
                )}

                <div className="card-body">
                  <p className="card-text text-center">{item.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VisorCarrusel
        imagenes={mediaGaleria}
        imagenInicial={mediaIndexActivo ?? 0}
        show={mostrarCarrusel}
        onClose={() => setMostrarCarrusel(false)}
      />
    </>
  )
}
