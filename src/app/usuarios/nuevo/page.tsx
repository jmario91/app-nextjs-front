// app/usuarios/nuevo/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREAR_USUARIO, OBTENER_USUARIOS_PAGINADO } from "../../../lib/graphql/usuarios";
import FormularioUsuario from "../../../components/usuarios/FormularioUsuario";
import { Usuario } from "../../../types/usuario";

export default function NuevoUsuarioPage() {
  const router = useRouter();

  // Si tu lista usa otras variables (página actual, límite, filtro), ponlas iguales aquí
  const [crearUsuario, { loading }] = useMutation(CREAR_USUARIO, {
    refetchQueries: [
      {
        query: OBTENER_USUARIOS_PAGINADO,
        variables: { pagina: 1, limite: 5, filtro: null },
      },
    ],
  });

  const handleCrear = async (usuario: Usuario) => {
    try {
      // Mapea tus campos al input del backend (CreateUsuarioInput)
      const input = {
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno ?? null,
        sexo: usuario.sexo ?? null,
        fechaNacimiento: usuario.fechaNacimiento ?? null,
        edad: usuario.edad ?? null,
        talla: usuario.talla ?? null,
        peso: usuario.peso ?? null,
        email: usuario.email,
        aceptaTerminos: usuario.aceptaTerminos ?? false,

        ocupacion: usuario.ocupacion ?? null,
        estadoCivil: usuario.estadoCivil ?? null,
        nivelEducativo: usuario.nivelEducativo ?? null,
        idioma: usuario.idioma ?? null,
        hobbies: usuario.hobbies ?? [],

        notasAdicionales: usuario.notasAdicionales ?? null,
        estatus: usuario.estatus ?? null,
        entidad: usuario.entidad ?? null,
        municipio: usuario.municipio ?? null,
        colonia: usuario.colonia ?? null,
        codigoPostal: usuario.codigoPostal ?? null,
      };

      await crearUsuario({ variables: { input } });
      router.push("/usuarios");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Ocurrió un error al crear el usuario");
    }
  };

  return (
    <div className="container mt-4">
      <FormularioUsuario onSubmit={handleCrear}  />
    </div>
  );
}
