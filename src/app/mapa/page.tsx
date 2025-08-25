"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import s from "../../styles/components/mapa.module.css";
import type { Mapa } from "../../types/mapa";
import { MapaData } from "../../lib/data/mapaDatos";
import MapaProyecto from "../../components/mapa/MapaProyecto";

const norm = (v?: string | null) =>
  (v ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

type SortKey = "relevance" | "precio_asc" | "precio_desc" | "nombre_asc";

export default function PageMapa() {
  const [texto, setTexto] = useState("");
  const [estadoSel, setEstadoSel] = useState<string>(""); // "" = Todos
  const [ciudadSel, setCiudadSel] = useState<string>(""); // "" = Todos
  const [sortKey, setSortKey] = useState<SortKey>("relevance");
   const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);
const [selectedUser, setSelectedUser] = useState<{ nombre: string } | null>(null);

  const [focusId, setFocusId] = useState<string | null>(null);
  const [overlay, setOverlay] = useState({
    show: false,
    theme: "dark" as "dark" | "light",
    message: "",
  });

  const [showLocationError, setShowLocationError] = useState(false);
const [userWithoutCoords, setUserWithoutCoords] = useState<string | null>(null);

const handleUserSelect = (user: Mapa) => {
  if (!user.latitud || !user.longitud) {
    setUserWithoutCoords(user.nombre);  
    setShowLocationError(true);        
    return;
  }

 
  setShowLocationError(false);
  setUserWithoutCoords(null);

   
  setFocusId(user.id);
};

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const setCardRef = (id: string) => (el: HTMLDivElement | null) => {
    cardRefs.current[id] = el;
  };


  const opcionesEstado = useMemo(() => {
    const set = new Set<string>();
    MapaData.forEach((u) => u.estado && set.add(u.estado));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, []);

   const opcionesCiudad = useMemo(() => {
    const base = estadoSel ? MapaData.filter((u) => u.estado === estadoSel) : MapaData;
    const set = new Set<string>();
    base.forEach((u) => u.ciudad && set.add(u.ciudad));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [estadoSel]);


  const filtrados: Mapa[] = useMemo(() => {
    const t = norm(texto);
    return MapaData.filter((u) => {
      if (t) {
        const hayTexto = norm(u.nombre + " " + (u.colonia ?? "")).includes(t);
        if (!hayTexto) return false;
      }
      if (estadoSel && u.estado !== estadoSel) return false;
      if (ciudadSel && u.ciudad !== ciudadSel) return false;
      return true;
    });
  }, [texto, estadoSel, ciudadSel]);


  const ordenados: Mapa[] = useMemo(() => {
    const arr = [...filtrados];
    switch (sortKey) {
      case "precio_asc":
        return arr.sort((a, b) => (a.precio ?? Infinity) - (b.precio ?? Infinity));
      case "precio_desc":
        return arr.sort((a, b) => (b.precio ?? -Infinity) - (a.precio ?? -Infinity));
      case "nombre_asc":
        return arr.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
      default:
        return arr;  
    }
  }, [filtrados, sortKey]);
 
  const totalPages = Math.max(1, Math.ceil(ordenados.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageItems = ordenados.slice(pageStart, pageStart + PAGE_SIZE);
  const hasResults = ordenados.length > 0;
 
  useEffect(() => {
    setPage(1);
  }, [texto, estadoSel, ciudadSel, sortKey]);

  
  useEffect(() => {
    setCiudadSel("");
  }, [estadoSel]);

  
  useEffect(() => {
    if (!hasResults) setFocusId(null);
  }, [hasResults]);

 
  const handleCardClick = (u: Mapa) => {
    const ok = u.latitud != null && u.longitud != null;
    if (ok) {
      setFocusId(u.id);
      setOverlay((o) => ({ ...o, show: false }));
    } else {
      setOverlay({
        show: true,
        theme: "dark",
        message: `“${u.nombre}” no cuenta con una dirección válida o coordenadas registradas.`,
      });
    }
  };

  const handleMarkerClick = (u: Mapa) => {
   const idx = ordenados.findIndex((x) => x.id === u.id);
    if (idx >= 0) {
      const targetPage = Math.floor(idx / PAGE_SIZE) + 1;
      if (targetPage !== page) setPage(targetPage);
    }

    setFocusId(u.id);
    setOverlay((o) => ({ ...o, show: false }));

    // Hacer scroll a la card
    setTimeout(() => {
      const el = cardRefs.current[u.id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add(s.cardFlash);
        setTimeout(() => el.classList.remove(s.cardFlash), 1200);
      }
    }, 0);
  };

  const clearFilters = () => {
    setTexto("");
    setEstadoSel("");
    setCiudadSel("");
    setSortKey("relevance");
    setPage(1);
    setFocusId(null);
  };

  return (
    <div className={s.mapLayout}>
     
      <header className={s.filtersBar}>
        <div className={s.listHeader}>
          <input
            className="form-control"
            placeholder="Buscar por nombre o colonia"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            style={{ maxWidth: 280 }}
            aria-label="Buscar por nombre o colonia"
          />

          <select
            className="form-select"
            style={{ maxWidth: 220 }}
            value={estadoSel}
            onChange={(e) => setEstadoSel(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            {opcionesEstado.map((est) => (
              <option key={est} value={est}>{est}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ maxWidth: 260 }}
            value={ciudadSel}
            onChange={(e) => setCiudadSel(e.target.value)}
            aria-label="Filtrar por alcaldía o municipio"
            disabled={!opcionesCiudad.length}
          >
            <option value="">Todas las alcaldías/municipios</option>
            {opcionesCiudad.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

     
          <select
            className="form-select"
            style={{ maxWidth: 180 }}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            aria-label="Ordenar resultados"
          >
            <option value="relevance">Recomendado</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="nombre_asc">Nombre A–Z</option>
          </select>

          <button className={s.filterBtn} onClick={clearFilters}>
            Limpiar filtros
          </button>

          <span className={s.resultsBadge} aria-live="polite">
            {hasResults
              ? `${ordenados.length} resultado${ordenados.length === 1 ? "" : "s"}`
              : "Sin resultados"}
          </span>
        </div>
      </header>

  
      <aside className={s.listPanel}>
        <div className={s.listBody}>
          {!hasResults ? (
            <div style={{ padding: 24, color: "#6b7280" }}>
              <div className="h6 mb-1">Sin resultados</div>
              <div>Intenta cambiar el estado, alcaldía/municipio o tu búsqueda.</div>
            </div>
          ) : (
            <>
              {pageItems.map((u) => (
                <article
                  key={u.id}
                  ref={setCardRef(u.id)}
                  className={[
                    s.cardItem,
                    (u.latitud == null || u.longitud == null) ? s.cardDisabled : "",
                    focusId === u.id ? s.cardItemActive : "",
                  ].join(" ")}
                  onClick={() => handleCardClick(u)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCardClick(u)}
                  aria-label={`Seleccionar ${u.nombre}`}
                >
                  <div>
                    <Image
                      src={u.thumb || "/galeria/img1.jpg"}
                      alt={u.nombre}
                      width={120}
                      height={120}
                      className={s.cardThumb}
                    />
                  </div>
                  <div>
                    <div className={s.cardTitle}>{u.nombre}</div>
                    <div className={s.cardMeta}>
                      {u.colonia ? `${u.colonia} · ` : ""}{u.ciudad}, {u.estado}
                    </div>
                  </div>
                </article>
              ))}

            
              <div className={s.pager}>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  aria-label="Página anterior"
                >
                  ← Anterior
                </button>
                <span style={{ padding: "0 8px" }}>
                  Página {page} de {totalPages}
                </span>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  aria-label="Página siguiente"
                >
                  Siguiente →
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

 
      <section className={s.mapWrapper}>
        {!hasResults ? (
           <div className={`${s.mapOverlay} ${s.overlayLight}`} style={{ position: "relative", minHeight: 280 }}>
      <div className={s.overlayCard}>
        <span className={s.noResultsIcon}>🔍</span>
        <h3 className={s.noResultsTitle}>No hay registros</h3>
        <p className={s.noResultsText}>
          Ajusta los filtros o cambia el término de búsqueda.
        </p>
        <button className={s.retryButton} onClick={clearFilters}>
          Quitar filtros
        </button>
      </div>
    </div>
        ) : (
          <>
         {showLocationError && (
  <div className={s.overlayFull}>
    <div className={s.overlayContent}>
      <h3>Ubicación no disponible</h3>
      <p>
        “{userWithoutCoords}” no cuenta con una dirección válida o coordenadas registradas.
      </p>
      <button onClick={() => setShowLocationError(false)}>Entendido</button>
    </div>
  </div>
)}

            <div className={s.stickyMap}>
              <MapaProyecto
                className={s.mapCanvas}
                items={pageItems}
                focusId={focusId}
                onMarkerClick={handleMarkerClick}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
