// src/components/galeria/VisorCarrusel.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Modal, Carousel } from "react-bootstrap"
import Image from "next/image"
import styles from "../../styles/components/VisorCarrusel.module.css"
import { Media } from "../../types/media"

interface Props {
  media: Media[]
  mediaInicial?: number
  show: boolean
  onClose: () => void
}

export default function VisorCarrusel({ media, mediaInicial, show, onClose }: Props) {
  const [index, setIndex] = useState(0)
  const [hovering, setHovering] = useState(false)
  const visorRef = useRef<HTMLDivElement>(null)

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex)
  }

  const handleFullscreen = () => {
    if (visorRef.current && visorRef.current.requestFullscreen) {
      visorRef.current.requestFullscreen()
    }
  }

  useEffect(() => {
    if (typeof mediaInicial === "number") {
      setIndex(mediaInicial)
    }
  }, [mediaInicial])

  const mediaActual = media[index]

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="xl"
      centered
      contentClassName={styles.modalContent}
      backdrop="static"
    >
      <Modal.Body className={styles.modalBody}>
        {/* Controles superiores */}
        <div className={styles.controlsTop}>
          <button
            className="btn btn-sm btn-light border"
            onClick={onClose}
            title="Cerrar"
          >
            <i className="bi bi-x-lg"></i>
          </button>

          <a
            href={mediaActual.src}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-light border"
            title="Descargar"
          >
            <i className="bi bi-download"></i>
          </a>

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
          controls={media.length > 1}
        >
          {media.map((item) => (
            <Carousel.Item key={item.id}>
              <div ref={visorRef} className={styles.mediaWrapper}>
               {item.tipo === "video" ? (
  <video
    src={item.src}
    controls
    className={styles.mediaVideo}
    onMouseEnter={() => setHovering(true)}
    onMouseLeave={() => setHovering(false)}
  />
) : item.tipo === "pdf" ? (
  <iframe
    src={item.src}
    className={styles.mediaPdf}
    title={item.alt}
    style={{ width: "100%", height: "80vh", border: "none" }}
  />
) : item.tipo === "word" || item.tipo === "excel" ? (
  <iframe
    src={`https://docs.google.com/gview?url=${encodeURIComponent(item.src)}&embedded=true`}
    className={styles.mediaPdf}
    title={item.alt}
    style={{ width: "100%", height: "80vh", border: "none" }}
  />
) : (
  <Image
    src={item.src}
    alt={item.alt}
    width={1200}
    height={800}
    className={styles.mediaImage}
  />
)}

              </div>

              <Carousel.Caption
                className={styles.caption}
                style={{
                  opacity: item.tipo === "video" && hovering ? 0 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                <h5>{item.alt}</h5>
                {item.categoria && <p>{item.categoria}</p>}
                {item.fecha && <small>{item.fecha}</small>}
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </Modal.Body>
    </Modal>
  )
}
