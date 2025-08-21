"use client";

import Image from "next/image";
import s from "../../styles/components/mapa.module.css";
import type { Mapa } from "../../types/mapa";

type Props = {
  item: Mapa;
  onClose: () => void;
};

const money = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);

export default function MapaProyectoInner({ item, onClose }: Props) {
  const subtitle = [item.colonia, item.ciudad, item.estado].filter(Boolean).join(" · ");
  const price = typeof item.precio === "number" ? money(item.precio) : "";

  return (
    <div className={s.modalInner} aria-modal="true" role="dialog">
      {/* Clic en fondo para cerrar */}
      <div className={s.modalBackdrop} onClick={onClose} />

      <div className={s.modalCard}>
        <button className={s.modalClose} onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        <div className={s.modalMedia}>
          <Image
            src={item.thumb || "/galeria/img1.jpg"}
            alt={item.nombre}
            width={640}
            height={360}
            className={s.modalImg}
          />
        </div>

        <div className={s.modalBody}>
          <h3 className={s.modalTitle}>{item.nombre}</h3>
          {subtitle && <div className={s.modalSubtitle}>{subtitle}</div>}
          {price && <div className={s.modalPrice}>{price}</div>}
        </div>
      </div>
    </div>
  );
}
