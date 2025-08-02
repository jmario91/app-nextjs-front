// src/lib/api/usuarios.ts
import { api } from '../constants/urls'
import { API_URL } from '../constants/urls'
import type { Usuario } from '../../types/usuario'

/** Lista de usuarios */
export async function obtenerUsuarios(): Promise<Usuario[]> {
  // Puedes dejar tu wrapper api si tu backend devuelve { data: Usuario[] }
  // Si algún día cambia la forma, descomenta el bloque fetch normalizado de abajo.
  const res = await api<{ data: Usuario[] }>('/usuarios')
  return res.data

  /*  Versión alternativa robusta (por si tu backend cambiara el envoltorio)
  const r = await fetch(`${API_URL}/usuarios`, { cache: 'no-store' })
  if (!r.ok) throw new Error(`Error al obtener usuarios: ${r.status}`)
  const data = await r.json()
  return (data?.usuarios ?? data?.data ?? data) as Usuario[]
  */
}

/** Un usuario por id */
export const obtenerUsuario = async (id: string): Promise<Usuario> => {
  const res = await fetch(`${API_URL}/usuarios/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('No se pudo cargar el usuario')
  return res.json()
}

/** Crear */
export const crearUsuario = async (usuario: Usuario): Promise<Usuario> => {
  // console.log('Enviando usuario al backend:', usuario)

  const res = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  })

  // Intentamos parsear JSON (éxito o error)
  let data: any
  try {
    data = await res.json()
  } catch {
    const text = await res.text()
    throw new Error(`Error ${res.status}: ${text || res.statusText}`)
  }

  if (!res.ok) {
    throw new Error(data?.message || JSON.stringify(data))
  }

  return data as Usuario
}

/** Actualizar */
export const actualizarUsuario = async (usuario: Usuario): Promise<Usuario> => {
  // console.log('Actualizando usuario en backend:', usuario)

  const res = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
    method: 'PUT', // o 'PATCH'
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  })

  let data: any
  try {
    data = await res.json()
  } catch {
    
    if (res.status === 204) return usuario
    const text = await res.text()
    throw new Error(`Error ${res.status}: ${text || res.statusText}`)
  }

  if (!res.ok) {
    throw new Error(data?.message || JSON.stringify(data))
  }

  return data as Usuario
}


export async function eliminarUsuario(id: string): Promise<void> {
 // const url = `${API_URL}/usuarios/${id}`;
   const url = `${API_URL}/usuarios/${id}/permanente`;
  console.log('[DELETE] ->', url);

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    
    cache: 'no-store',
  });

  const contentType = res.headers.get('content-type') || '';
  console.log('[DELETE] status:', res.status, 'content-type:', contentType);


  if (res.status === 204) {
    console.log('[DELETE] 204 No Content');
    return;
  }

  if (res.ok) {
    
    if (contentType.includes('application/json')) {
      const data = await res.json().catch(() => null);
      console.log('[DELETE] 200 OK JSON:', data);
      return;
    }

    const text = await res.text().catch(() => '');
    console.error('[DELETE] 200 pero no JSON. Respuesta (primeros 200):', text.slice(0, 200));
    throw new Error(
      `DELETE ${url} devolvió ${res.status} con "${contentType}". ` +
      `Probablemente estás llamando al FRONT (Next) en lugar del BACK. Revisa API_URL.`
    );
  }


  try {
    const payload = contentType.includes('application/json') ? await res.json() : await res.text();
    const msg = typeof payload === 'string' ? payload : payload?.message;
    throw new Error(msg || `Error al eliminar (${res.status})`);
  } catch {
    throw new Error(`Error al eliminar (${res.status})`);
  }

}
