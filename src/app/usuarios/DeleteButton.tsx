"use client"

import { useMutation } from "@apollo/client"
import { ELIMINAR_USUARIO, OBTENER_USUARIOS } from "../../lib/graphql/usuarios"
import { useRouter } from "next/navigation"

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [eliminarUsuario, { loading }] = useMutation(ELIMINAR_USUARIO, {
    refetchQueries: [{ query: OBTENER_USUARIOS }],
  })

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return

    try {
      const { data } = await eliminarUsuario({ variables: { id } })
      if (data?.eliminarUsuario?.success) {
        alert("✅ " + data.eliminarUsuario.message)
        router.refresh()
      } else {
        alert("No se pudo eliminar el usuario")
      }
    } catch (err) {
      console.error("Error al eliminar:", err)
      alert("Ocurrió un error al eliminar el usuario")
    }
  }

  return (
    <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={loading}>
      {loading ? "Eliminando..." : "Eliminar"}
    </button>
  )
}
