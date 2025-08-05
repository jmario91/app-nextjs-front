"use client"

import { useState, useRef } from "react"
import { Modal, Carousel } from "react-bootstrap"
import Image from "next/image"
import { Imagen } from "../../types/imagen" // asegúrate que tu tipo esté aquí
import styles from "../../styles/components/VisorCarrusel.module.css"

interface Props {
  imagenes: Imagen[]
  imagenInicial?: number
  show: boolean
  onClose: () => void
}

export default function VisorCarrusel({ imagenes, imagenInicial, show, onClose }: Props) {
  const [index, setIndex] = useState(() => {
    const startIndex = imagenes.findIndex((img) => img.id === imagenInicial)
    return startIndex >= 0 ? startIndex : 0
  })

  const visorRef = useRef<HTMLDivElement>(null)

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex)
  }

  const handleFullscreen = () => {
    if (visorRef.current && visorRef.current.requestFullscreen) {
      visorRef.current.requestFullscreen()
    }
  }

  const imagenActual = imagenes[index]

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="xl"
      centered
      contentClassName="bg-light"
      backdrop="static"
    >
      <Modal.Header className="border-0">
        <button
          onClick={onClose}
          className="btn-close ms-auto"
          aria-label="Cerrar"
        />
      </Modal.Header>

      <Modal.Body className="p-0">
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          interval={null}
          indicators={false}
        >
          {imagenes.map((img) => (
            <Carousel.Item key={img.id}>
              {/* Controles */}
              <div className={styles.controlesTop}>
                <a
                  href={img.src}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-light border me-2"
                  title="Descargar imagen"
                >
                  <i className="bi bi-download" />
                </a>
                <button
                  onClick={handleFullscreen}
                  className="btn btn-sm btn-light border"
                  title="Pantalla completa"
                >
                  <i className="bi bi-arrows-fullscreen" />
                </button>
              </div>

              {/* Imagen */}
              <div ref={visorRef} className={styles.visorWrapper}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className={styles.imagenCarrusel}
                />
              </div>

              {/* Título, categoría, fecha */}
              <Carousel.Caption className="pb-4">
                <div className="bg-dark bg-opacity-75 text-white px-4 py-3 rounded shadow-sm">
                  <h5>{img.titulo}</h5>
                  <small>{img.categoria}</small>
                  <br />
                  <small>{img.fecha}</small>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </Modal.Body>
    </Modal>
  )
}
