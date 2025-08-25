import { gql } from '@apollo/client';

export const OBTENER_USUARIOS_PAGINADO = gql`
  query ObtenerUsuariosPaginado($pagina: Int!, $limite: Int!, $filtro: FiltroUsuarioInput) {
    usuariosPaginado(pagina: $pagina, limite: $limite, filtro: $filtro) {
      total
      paginas
      paginaActual
      usuarios {
        id
        nombre
        apellidoPaterno
        email
      }
    }
  }
`;
export const OBTENER_USUARIO = gql`
  query ObtenerUsuario($id: String!) {  
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
      beneficiarios {
        id
        idDetalle
        nombre
      }
    }
  }
`;
export const OBTENER_USUARIO_POR_ID = gql`
  query ObtenerUsuarioPorId($id: String!) {
    usuario(id: $id) {
      id
      nombre
      apellidoPaterno
      apellidoMaterno
      sexo
      fechaNacimiento
      edad
      talla
      peso
      email
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

export const CREAR_USUARIO = gql`
  mutation CrearUsuario($input: CrearUsuarioInput!) {
    crearUsuario(input: $input) {
      id
      nombre
      email
      beneficiarios {
        id
        idDetalle
        nombre
      }
    }
  }
`;

export const ACTUALIZAR_USUARIO = gql`
  mutation ActualizarUsuario($id: String!, $input: UpdateUsuarioInput!) {
    actualizarUsuario(id: $id, input: $input) {
      id
      nombre
      email
      beneficiarios {
        id
        idDetalle
        nombre
      }
    }
  }
`;

export const ELIMINAR_USUARIO = gql`
  mutation EliminarUsuario($id: String!) {
    eliminarUsuario(id: $id)
  }
`;
