// lib/graphql/usuarios.ts
import { gql } from '@apollo/client';

export const CREAR_USUARIO = gql`
  mutation CrearUsuario($input: UsuarioInput!) {
    crearUsuario(input: $input) {
      id
      nombre
      apellidoPaterno
      email
    }
  }
`;

export const OBTENER_USUARIOS = gql`
  query {
    usuarios {
      id
      nombre
      apellidoPaterno
      email
    }
  }
`;


export const ELIMINAR_USUARIO = gql`
  mutation EliminarUsuario($id: ID!) {
    eliminarUsuario(id: $id) {
      success
      message
    }
  }
`

   export const OBTENER_USUARIO_POR_ID = gql`
  query ObtenerUsuarioPorId($id: ID!) {
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
export const ACTUALIZAR_USUARIO = gql`
  mutation ActualizarUsuario($id: ID!, $input: UsuarioInput!) {
    actualizarUsuario(id: $id, input: $input) {
      id
      nombre
      email
    }
  }
`;


export const OBTENER_USUARIOS_PAGINADO = gql`
  query ObtenerUsuariosPaginado($pagina: Int, $limite: Int, $filtro: UsuarioFiltroInput) {
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
