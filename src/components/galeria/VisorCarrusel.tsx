// src/components/galeria/VisorCarrusel.tsx
"use client"

import { useState, useRef } from "react"
import { Modal, Carousel } from "react-bootstrap"
import Image from "next/image"
import styles from "../../styles/components/VisorCarrusel.module.css"
import { Imagen } from "../../types/imagen"
import { useEffect } from "react"
interface Props {
  imagenes: Imagen[]
  imagenInicial?: number
  show: boolean
  onClose: () => void
}

export default function VisorCarrusel({ imagenes, imagenInicial, show, onClose }: Props) {
const [index, setIndex] = useState(0)



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
const [hovering, setHovering] = useState(false)
useEffect(() => {
  if (typeof imagenInicial === 'number') {
    setIndex(imagenInicial)
  }
}, [imagenInicial])
  return (
    <Modal
      show={show}
      onHide={onClose}
      size="xl"
      centered
      contentClassName={styles.modalContent}
      backdrop="static"
    >
      <Modal.Body className={`${styles.modalBody}`}>

        {/* Controles superiores */}
     <div className={styles.controlsTop}>
  {/* Botón de cerrar */}
  <button
    className="btn btn-sm btn-light border"
    onClick={onClose}
    title="Cerrar"
  >
    <i className="bi bi-x-lg"></i>
  </button>

  {/* Descargar */}
  <a
    href={imagenActual.src}
    download
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-sm btn-light border"
    title="Descargar"
  >
    <i className="bi bi-download"></i>
  </a>

  {/* Pantalla completa */}
  <button
    onClick={handleFullscreen}
    className="btn btn-sm btn-light border"
    title="Pantalla completa"
  >
    <i className="bi bi-arrows-fullscreen"></i>
  </button>
</div>


        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          interval={null}
          indicators={false}
          controls={imagenes.length > 1}
        >
          {imagenes.map((img) => (
            <Carousel.Item key={img.id}>
              <div ref={visorRef} className={styles.mediaWrapper}>
                {img.tipo === "video" ? (
                  <video
                    src={img.src}
                    controls
                    className={styles.mediaVideo}
                    onMouseEnter={() => setHovering(true)}
  onMouseLeave={() => setHovering(false)}
                  />
                ) : (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={1200}
                    height={800}
                    className={styles.mediaImage}
                  />
                )}
              </div>

              <Carousel.Caption
  className={styles.caption}
  style={{
    opacity: img.tipo === "video" && hovering ? 0 : 1,
    transition: "opacity 0.3s ease",
  }}
>
  <h5>{img.alt}</h5>
  {img.categoria && <p>{img.categoria}</p>}
  {img.fecha && <small>{img.fecha}</small>}
</Carousel.Caption>

            </Carousel.Item>
          ))}
        </Carousel>
      </Modal.Body>
    </Modal>
  )
}
