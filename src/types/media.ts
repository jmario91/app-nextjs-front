export interface Media {
  id: number
  tipo: "imagen" | "video"
  src: string
  alt: string
  titulo: string
  categoria: string
  fecha: string
}