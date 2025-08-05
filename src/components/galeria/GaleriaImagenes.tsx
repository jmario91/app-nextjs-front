"use client"

import Image from "next/image"
import { useState } from "react"
import { mediaGaleria } from "../../lib/data/mediaGaleria"
import VisorCarrusel from "./VisorCarrusel"
import { CATEGORIAS } from "../../lib/data/categorias"

export default function GaleriaImagenes() {
  const [mostrarCarrusel, setMostrarCarrusel] = useState(false)
  const [mediaIndexActivo, setMediaIndexActivo] = useState<number | null>(null)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas")
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState("Todas")

  const subcategoriasDisponibles =
    CATEGORIAS.find((c) => c.nombre === categoriaSeleccionada)?.subcategorias ?? []

  const mediaFiltrada = mediaGaleria.filter((item) => {
    const categoriaValida =
      categoriaSeleccionada === "Todas" || item.categoria === categoriaSeleccionada
    const subcategoriaValida =
      subcategoriaSeleccionada === "Todas" || item.subcategoria === subcategoriaSeleccionada
    return categoriaValida && subcategoriaValida
  })

  const abrirCarrusel = (index: number) => {
    if (index >= 0 && index < mediaFiltrada.length) {
      setMediaIndexActivo(index)
      setMostrarCarrusel(true)
    }
  }

  return (
    <>
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-md-4">
            <label className="form-label">Categoría</label>
            <select
              className="form-select"
              value={categoriaSeleccionada}
              onChange={(e) => {
                setCategoriaSeleccionada(e.target.value)
                setSubcategoriaSeleccionada("Todas")
              }}
            >
              <option value="Todas">Todas</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat.nombre} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Subcategoría</label>
            <select
              className="form-select"
              value={subcategoriaSeleccionada}
              onChange={(e) => setSubcategoriaSeleccionada(e.target.value)}
              disabled={subcategoriasDisponibles.length === 0}
            >
              <option value="Todas">Todas</option>
              {subcategoriasDisponibles.map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row justify-content-center">
          {mediaFiltrada.map((item, index) => (
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
                ) : item.tipo === "video" ? (
                  <video
                    src={item.src}
                    className="card-img-top"
                    style={{ objectFit: "cover", height: 200 }}
                    muted
                    loop
                    autoPlay
                  />
                ) : item.tipo === "pdf" ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: 200, background: "#f2f2f2" }}
                  >
                    <i className="bi bi-file-earmark-pdf-fill fs-1 text-danger"></i>
                  </div>
                ) : item.tipo === "word" ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: 200, background: "#f2f2f2" }}
                  >
                    <i className="bi bi-file-earmark-word-fill fs-1 text-primary"></i>
                  </div>
                ) : item.tipo === "excel" ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: 200, background: "#f2f2f2" }}
                  >
                    <i className="bi bi-file-earmark-excel-fill fs-1 text-success"></i>
                  </div>
                ) : null}

                <div className="card-body">
                  <p className="card-text text-center">{item.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mediaIndexActivo !== null && (
        <VisorCarrusel
          media={mediaFiltrada}
          mediaInicial={mediaIndexActivo}
          show={mostrarCarrusel}
          onClose={() => setMostrarCarrusel(false)}
        />
      )}
    </>
  )
}
