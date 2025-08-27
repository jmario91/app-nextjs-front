"use client";

import { useQuery } from "@apollo/client";
import { OBTENER_USUARIOS_PAGINADO } from "../../lib/graphql/usuarios";
import DeleteButton from "./DeleteButton";
import Link from "next/link";
import { useState, useEffect } from "react";
import client from "../../lib/apollo-client";

export default function UsuariosPage() {
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(5);
  const [filtro, setFiltro] = useState<{ nombre?: string; email?: string }>({});
const [search, setSearch] = useState("");

 useEffect(() => {
  const t = setTimeout(() => {
    const valor = search.trim();
    if (valor === "") {
      setFiltro({});
    } else {
      setFiltro({ nombre: valor, email: valor });
    }
    setPagina(1);
  }, 400);
  return () => clearTimeout(t);
}, [search]);


 const { data, loading, error } = useQuery(OBTENER_USUARIOS_PAGINADO, {
  variables: {
    pagina,
    limite,
    filtro: Object.keys(filtro).length > 0 ? filtro : null,  
  },
  client,
});

  const usuarios = data?.usuariosPaginado?.usuarios || [];
  const totalPaginas = data?.usuariosPaginado?.paginas || 1;

  if (loading) return <p className="container mt-4">Cargando usuarios...</p>;
  if (error) return <p className="container mt-4 text-danger">Error: {error.message}</p>;
console.log(filtro);
  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Usuarios</h4>
          <Link href="/usuarios/nuevo" className="btn btn-primary">
            + Nuevo
          </Link>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u: any) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td className="text-center">
                      <Link
                        href={`/usuarios/${u.id}/editar`}
                        className="btn btn-sm btn-outline-warning me-2">
                        ✏️ Editar
                      </Link>
                     <DeleteButton
                        id={u.id}
                        pagina={pagina}
                        limite={limite}
                        filtro={Object.keys(filtro).length > 0 ? filtro : undefined}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-muted">
              Página {pagina} de {totalPaginas}
            </small>
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary"
                disabled={pagina <= 1}
                onClick={() => setPagina((prev) => prev - 1)}
              >
                ◀ Anterior
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={pagina >= totalPaginas}
                onClick={() => setPagina((prev) => prev + 1)}
              >
                Siguiente ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
