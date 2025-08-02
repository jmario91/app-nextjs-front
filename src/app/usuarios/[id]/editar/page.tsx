import FormularioUsuario from "../../../../components/usuarios/FormularioUsuario"
import { gql } from "@apollo/client"
import client from "../../../../lib/apollo-client"
import type { Usuario } from "../../../../types/usuario"
 
const OBTENER_USUARIO = gql`
  query ObtenerUsuario($id: ID!) {
    usuario(id: $id) {
      id
      nombre
      email
      apellidoPaterno
      apellidoMaterno
      sexo
      fechaNacimiento
      edad
      talla
      peso
      aceptaTerminos
      ocupacion
      estadoCivil
      nivelEducativo
      idioma
      hobbies
      notasAdicionales
      estatus
      entidad
      municipio
      colonia
      codigoPostal
    }
  }
`

export default async function EditarUsuarioPage({ params }: { params: { id: string } }) {
   console.log("ID del usuario:", params.id)
  const { data } = await client.query<{ usuario: Usuario }>({
    query: OBTENER_USUARIO,
    variables: { id: params.id },
    fetchPolicy: "no-cache",
  })
console.log(data.usuario)
  return (
    <div className="container mt-4">
      <h2>Editar usuario</h2>
      <FormularioUsuario usuario={data.usuario} modo="editar"/>
    </div>
  )
}
