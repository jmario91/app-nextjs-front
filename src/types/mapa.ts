export type Mapa = {
  id: string;
  nombre: string;
  estado: string;
  ciudad: string;
  colonia?: string;
  latitud: number | null;
  longitud: number | null;
  precio: number;
  activo?: boolean;
  thumb?: string;
};
