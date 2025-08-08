"use client";

import { useMutation } from "@apollo/client";
import {
  ELIMINAR_USUARIO,
  OBTENER_USUARIOS_PAGINADO,
} from "../../lib/graphql/usuarios";

export default function DeleteButton({
  id,
  pagina,
  limite,
  filtro,
}: {
  id: string;
  pagina: number;
  limite: number;
  filtro?: { nombre?: string; email?: string };
}) {
  const [eliminarUsuario, { loading }] = useMutation(ELIMINAR_USUARIO, {
    refetchQueries: [
      {
        query: OBTENER_USUARIOS_PAGINADO,
        variables: {
          pagina,
          limite,
          filtro: filtro && Object.keys(filtro).length > 0 ? filtro : null,
        },
      },
    ],
    awaitRefetchQueries: true,
    onError(error) {
      console.error("Error en eliminación:", error);
    },
  });

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      await eliminarUsuario({ variables: { id } });
      alert("✅ Usuario eliminado correctamente");
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("❌ Ocurrió un error al eliminar el usuario");
    }
  };

  return (
    <button
      className="btn btn-danger btn-sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
