"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (route: string) => pathname === route;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* Logo o título */}
        <Link className="navbar-brand fw-bold" href="/">
          <i className="bi bi-grid-fill me-2"></i>App Mario
        </Link>

        {/* Botón de menú responsive */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Contenido colapsable */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/") ? "active fw-semibold" : ""}`}
                href="/"
              >
                <i className="bi bi-house-door-fill me-1"></i>Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/usuarios") ? "active fw-semibold" : ""}`}
                href="/usuarios"
              >
                <i className="bi bi-people-fill me-1"></i>Usuarios
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
