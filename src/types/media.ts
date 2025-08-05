export interface Media {
  id: number
  tipo: "imagen" | "video" | "pdf"| "word"| "excel"
  src: string
  alt: string
  titulo: string
  categoria: string
  subcategoria?: string
  fecha: string
}