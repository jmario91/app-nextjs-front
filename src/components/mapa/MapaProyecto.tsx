"use client";

import { useEffect, useMemo, useRef } from "react";
import s from "../../styles/components/mapa.module.css";
import type { Mapa } from "../../types/mapa";
import type { Map as LeafletMap, Marker, Icon, Popup } from "leaflet";
import "leaflet/dist/leaflet.css";

// (compat: si alguna vez vuelves a usar PNGs)
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconPng from "leaflet/dist/images/marker-icon.png";
import shadowPng from "leaflet/dist/images/marker-shadow.png";

type PillRenderer = (item: Mapa, isActive: boolean) => string;
type PopupRenderer = (item: Mapa) => string;
type MarkerClickHandler = (item: Mapa) => void;

export default function MapaProyecto({
  className,
  items,
  focusId,
  pillRenderer,
  popupRenderer,
  onMarkerClick,
}: {
  className?: string;
  items: Mapa[];
  focusId?: string | null;
  pillRenderer?: PillRenderer;
  popupRenderer?: PopupRenderer;
  onMarkerClick?: MarkerClickHandler;
}) {
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<any>(null);
  const defaultIconRef = useRef<Icon | any>(null);
  const markerIndexRef = useRef<Record<string, Marker>>({});
  /** Popup único y persistente (como hace Airbnb) */
  const sharedPopupRef = useRef<Popup | null>(null);

  const markersKey = useMemo(() => items.map(i => String(i.id)).join("|"), [items]);

  const itemById = useMemo(() => {
    const idx: Record<string, Mapa> = {};
    items.forEach(i => (idx[String(i.id)] = i));
    return idx;
  }, [items]);

  const fmtMXN = (n: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(n);

  const buildAirbnbPopupHTML = (u: Mapa) => {
    const img = u.thumb || "/galeria/img1.jpg";
    const subtitle = [u.colonia, u.ciudad, u.estado].filter(Boolean).join(" · ");
    const price = typeof u.precio === "number" ? fmtMXN(u.precio) : "";
    return `
      <article class="airCard" role="dialog" aria-label="${u.nombre ?? ""}">
        <div class="airCard__media">
          <img loading="lazy" src="${img}" alt="${u.nombre ?? ""}" class="airCard__img"/>
        </div>
        <div class="airCard__body">
          <div class="airCard__row">
            <div class="airCard__title">${u.nombre ?? ""}</div>
            ${price ? `<div class="airCard__price">${price}</div>` : ""}
          </div>
          ${subtitle ? `<div class="airCard__subtitle">${subtitle}</div>` : ""}
        </div>
      </article>
    `;
  };

  // Cargar Leaflet y crear mapa + popup persistente
  useEffect(() => {
    let mounted = true;
    (async () => {
      const L = (await import("leaflet")).default;
      if (!mounted) return;

      leafletRef.current = L;

      defaultIconRef.current = L.icon({
        iconRetinaUrl: iconRetina.src,
        iconUrl: iconPng.src,
        shadowUrl: shadowPng.src,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      (L.Marker.prototype as any).options.icon = defaultIconRef.current;

      if (!mapRef.current) {
        const map = L.map("leaflet-host", {
          zoomControl: true,
          closePopupOnClick: true,
          doubleClickZoom: false,
        }).setView([19.4326, -99.1332], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);

        // Crea un popup ÚNICO y persistente
        sharedPopupRef.current = L.popup({
          className: "airbnbPopup",
          maxWidth: 360,
          autoClose: false,
          closeButton: true,

        });

        mapRef.current = map;

        // corrige tamaño inicial
        setTimeout(() => map.invalidateSize(), 0);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Pintar / sincronizar marcadores (sin bindPopup por marcador)
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    // limpia anteriores
    Object.values(markerIndexRef.current).forEach(m => m.remove());
    markerIndexRef.current = {};

    items.forEach(u => {
      if (u.latitud == null || u.longitud == null) return;

      const lat = Number(u.latitud);
      const lng = Number(u.longitud);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return;

      const id = String(u.id);
      const isActive = !!(focusId && String(focusId) === id);

      const pillHtml =
        pillRenderer?.(u, isActive) ??
        (typeof u.precio === "number"
          ? fmtMXN(u.precio)
          : `<span class="price-marker__dot"></span>${u.nombre ?? ""}`);

      const icon = L.divIcon({
        className: `price-marker${isActive ? " price-marker--active" : ""}`,
        html: pillHtml,
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      // Asegura interacción/teclado
      marker.on("add", () => {
        const el = marker.getElement() as HTMLElement | null;
        if (el) {
          el.style.pointerEvents = "auto";
          el.style.cursor = "pointer";
          el.setAttribute("role", "button");
          el.setAttribute("tabindex", "0");
        }
      });

      // Click en píldora: actualiza 
      const openCard = () => {
        try {
          onMarkerClick?.(u);
        } finally {
          const popup = sharedPopupRef.current!;
          const html = popupRenderer ? popupRenderer(u) : buildAirbnbPopupHTML(u);
          popup.setContent(html);
          popup.setLatLng([lat, lng]);

          popup.openOn(map);
        }
      };

      marker.on("click", openCard);
      marker.on("keydown", (e: any) => {
        const key = e?.originalEvent?.key;
        if (key === "Enter") openCard();
        if (key === " ") {
          e?.originalEvent?.preventDefault?.();
          onMarkerClick?.(u);
        }
      });

      markerIndexRef.current[id] = marker;
    });

    setTimeout(() => map.invalidateSize(), 0);
  }, [markersKey, focusId, pillRenderer, popupRenderer, onMarkerClick]);

  // Centrarse cuando cambia focusId y abrir/actualizar el popup compartido
  useEffect(() => {
    const map = mapRef.current;
    const popup = sharedPopupRef.current;
    if (!map || !popup || !focusId) return;

    const u = itemById[String(focusId)];
    if (!u || u.latitud == null || u.longitud == null) return;

    const lat = Number(u.latitud);
    const lng = Number(u.longitud);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    // centra
    map.setView([lat, lng], Math.max(map.getZoom(), 15), { animate: true });


    const html = popupRenderer ? popupRenderer(u) : buildAirbnbPopupHTML(u);
    popup.setContent(html).setLatLng([lat, lng]).openOn(map);
  }, [focusId, itemById, popupRenderer]);

  //mantiene el tamaño del mapa al redimensionar
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);

    const host = document.getElementById("leaflet-host");
    const ro = host ? new ResizeObserver(() => map.invalidateSize()) : null;
    if (host && ro) ro.observe(host);

    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, []);

  return <div id="leaflet-host" className={`${s.mapCanvas} ${className ?? ""}`} />;
}
