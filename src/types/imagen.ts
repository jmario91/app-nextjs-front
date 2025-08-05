 export interface Imagen {
  id: number,
  tipo: "imagen" | "video"
  src: string
  alt: string
  titulo: string
  categoria: string
  fecha: string // ISO format, e.g., "2025-08-04"
}
