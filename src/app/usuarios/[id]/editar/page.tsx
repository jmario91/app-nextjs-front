 
import FormularioUsuario from "../../../../components/usuarios/FormularioUsuario";
import client from "../../../../lib/apollo-client";
import type { Usuario } from "../../../../types/usuario";
import { OBTENER_USUARIO } from "../../../../lib/graphql/usuarios";


export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;  
}) {
    let data: { usuario: Usuario } | null = null;
      const { id } = await params;
  try {
   
    const res = await client.query<{ usuario: Usuario }>({
      query: OBTENER_USUARIO,
      variables: { id },
      fetchPolicy: "no-cache",
    });
    data = res.data;
  } catch (e) {
 
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
          <FormularioUsuario usuario={data.usuario} />
    </div>
  );
}
