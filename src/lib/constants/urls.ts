
export const API_URL = process.env.NEXT_PUBLIC_API_URL!

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
   
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string,string> || {})
    },
    ...options
  })


  let data: any
  try {
    data = await res.json()
  } catch {
   
    const text = await res.text()
    throw new Error(`Error genérico (${res.status}): ${text || res.statusText}`)
  }

  
  if (!res.ok) {
    console.error(' API Validation Error:', data)
    
    throw new Error(data.message || JSON.stringify(data))
  }

 
  return data as T
}
