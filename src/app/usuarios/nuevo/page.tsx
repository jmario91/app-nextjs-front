"use client"

import { useRouter } from 'next/navigation'
import { crearUsuario } from '../../../lib/api/usuarios'
import { Usuario } from '../../../types/usuario'
import FormularioUsuario from '../../../components/usuarios/FormularioUsuario'

export default function NuevoUsuarioPage() {
  const router = useRouter()

  const handleCrear = async (usuario: Usuario) => {
    try {
      console.log('Enviando usuario:', usuario)
      await crearUsuario(usuario)
      router.push('/usuarios')
    } catch (error) {
      console.error('Error al crear usuario:', error)
      alert('Ocurrió un error al crear el usuario')
    }
  }

  return (
    <div className="container mt-4">
         <FormularioUsuario onSubmit={handleCrear} />
    </div>
  )
}
