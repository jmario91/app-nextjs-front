// src/lib/mapa/utils.ts
import { Mapa } from "../../../types/mapa";

export const coordValida = (m?: Partial<Mapa>) =>
  Number.isFinite(m?.latitud) &&
  Number.isFinite(m?.longitud) &&
  (m!.latitud as number) >= -90 && (m!.latitud as number) <= 90 &&
  (m!.longitud as number) >= -180 && (m!.longitud as number) <= 180;

export const DEFAULT_CENTER: [number, number] = [19.4326, -99.1332]; // CDMX
