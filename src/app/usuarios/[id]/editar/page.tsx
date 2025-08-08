// app/usuarios/[id]/editar/page.tsx
import FormularioUsuario from "../../../../components/usuarios/FormularioUsuario";
import { gql } from "@apollo/client";
import client from "../../../../lib/apollo-client";
import type { Usuario } from "../../../../types/usuario";

const OBTENER_USUARIO = gql`
  query ObtenerUsuario($id: String!) {   # 👈 String! (tu schema)
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
`;

export default async function EditarUsuarioPage({ params }: { params: { id: string } }) {
  // Puedes dejar los console.log para depurar si quieres
  // console.log("ID del usuario:", params.id)

  let data: { usuario: Usuario } | null = null;

  try {
    const res = await client.query<{ usuario: Usuario }>({
      query: OBTENER_USUARIO,
      variables: { id: params.id },
      fetchPolicy: "no-cache",
    });
    data = res.data;
  } catch (e) {
    // aquí podrías redirigir o mostrar una UI de error
    // console.error(e);
    data = null;
  }

  if (!data?.usuario) {
    return (
      <div className="container mt-4">
        <h2>Editar usuario</h2>
        <div className="alert alert-warning">No se encontró el usuario.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Editar usuario</h2>
      {/* 👇 quité el prop `modo` porque el form lo infiere por `usuario.id` */}
      <FormularioUsuario usuario={data.usuario} />
    </div>
  );
}
