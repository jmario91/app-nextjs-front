"use client"
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { Usuario } from "../../types/usuario"

//Importamos el cliente Apollo para usar GraphQL
import { useMutation } from '@apollo/client'
import client from '../../lib/apollo-client'
import { CREAR_USUARIO, ACTUALIZAR_USUARIO } from '../../lib/graphql/usuarios'
import { useRouter } from "next/navigation"
//Formulario Detalle-Beneficiarios
import BeneficiariosForm from "./BeneficiariosForm";
import { Beneficiario } from "../../types/beneficiario";

const CATALOGOS = {
  SEXOS: [
    { value: "H", label: "Hombre" },
    { value: "M", label: "Mujer" },
  ],
  ESTATUS_USUARIO: [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ],
  ESTADOS_CIVILES: [
    { value: "soltero", label: "Soltero" },
    { value: "casado", label: "Casado" },
    { value: "divorciado", label: "Divorciado" },
    { value: "viudo", label: "Viudo" },
  ],
  NIVELES_EDUCATIVOS: [
    { value: "primaria", label: "Primaria" },
    { value: "secundaria", label: "Secundaria" },
    { value: "preparatoria", label: "Preparatoria" },
    { value: "universidad", label: "Universidad" },
  ],
  IDIOMAS: [
    { value: "español", label: "Español" },
    { value: "inglés", label: "Inglés" },
    { value: "francés", label: "Francés" },
  ],
  HOBBIES_DISPONIBLES: [
    { value: "leer", label: "Leer" },
    { value: "deportes", label: "Deportes" },
    { value: "música", label: "Música" },
    { value: "cine", label: "Cine" },
    { value: "viajar", label: "Viajar" },
  ],
};

interface Props {
  usuario?: Usuario
  onSubmit?: (usuario: Usuario) => void | Promise<void>
  modo?: 'editar' | 'crear' // 👈 agrega esta línea
}


const toInputDate = (value?: string | Date): string => {
  if (!value) return ""
  const d = typeof value === "string" ? new Date(value) : value
  if (isNaN(d.getTime())) return ""
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

const toIsoDateOrUndefined = (value: string | undefined): string | undefined => {
  if (!value) return undefined
  const d = new Date(value)
  if (isNaN(d.getTime())) return undefined
  return d.toISOString()
}

type FormUsuario = {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  sexo: "" | "H" | "M"
  fechaNacimiento: string
  edad: string
  talla: string
  peso: string
  email: string
  aceptaTerminos: boolean
  ocupacion: string
  estadoCivil: string
  nivelEducativo: string
  idioma: string
  hobbies: string[]
  notasAdicionales: string
  estatus: string
  entidad: string
  municipio: string
  colonia: string
  codigoPostal: string
}

const initialForm: FormUsuario = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  sexo: "",
  fechaNacimiento: "",
  edad: "",
  talla: "",
  peso: "",
  email: "",
  aceptaTerminos: false,
  ocupacion: "",
  estadoCivil: "",
  nivelEducativo: "",
  idioma: "",
  hobbies: [],
  notasAdicionales: "",
  estatus: "",
  entidad: "",
  municipio: "",
  colonia: "",
  codigoPostal: "",
}

function mapUsuarioToForm(u: Usuario): FormUsuario {
  return {
    nombre: u.nombre ?? "",
    apellidoPaterno: (u as any).apellidoPaterno ?? "",
    apellidoMaterno: (u as any).apellidoMaterno ?? "",
    sexo: ((u as any).sexo as "H" | "M") ?? "",
    fechaNacimiento: toInputDate((u as any).fechaNacimiento),
    edad: (u as any).edad != null ? String((u as any).edad) : "",
    talla: (u as any).talla != null ? String((u as any).talla) : "",
    peso: (u as any).peso != null ? String((u as any).peso) : "",
    email: u.email ?? "",
    aceptaTerminos: (u as any).aceptaTerminos ?? false,
    ocupacion: (u as any).ocupacion ?? "",
    estadoCivil: (u as any).estadoCivil ?? "",
    nivelEducativo: (u as any).nivelEducativo ?? "",
    idioma: (u as any).idioma ?? "",
    hobbies: Array.isArray((u as any).hobbies) ? (u as any).hobbies : [],
    notasAdicionales: (u as any).notasAdicionales ?? "",
    estatus: (u as any).estatus ?? "",
    entidad: (u as any).entidad ?? "",
    municipio: (u as any).municipio ?? "",
    colonia: (u as any).colonia ?? "",
    codigoPostal: (u as any).codigoPostal ?? "",
  }
}

 function mapFormToUsuario(form: FormUsuario): Usuario {
  return {
     nombre: form.nombre.trim(),
    apellidoPaterno: form.apellidoPaterno.trim(),
    apellidoMaterno: form.apellidoMaterno.trim(),
    sexo: form.sexo,
    fechaNacimiento: toIsoDateOrUndefined(form.fechaNacimiento) as string,
    edad: form.edad !== "" ? Number(form.edad) : 0,  
    talla: form.talla !== "" ? parseFloat(form.talla) : null,  
    peso: form.peso !== "" ? parseFloat(form.peso) : null,     
    email: form.email.trim(),
    aceptaTerminos: !!form.aceptaTerminos,
    ocupacion: form.ocupacion,
    estadoCivil: form.estadoCivil,
    nivelEducativo: form.nivelEducativo,
    idioma: form.idioma,
    hobbies: form.hobbies,
    notasAdicionales: form.notasAdicionales,
    estatus: form.estatus,
    entidad: form.entidad,
    municipio: form.municipio,
    colonia: form.colonia,
    codigoPostal: form.codigoPostal,
  }
}


export default function FormularioUsuario({ usuario }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormUsuario>(() => (usuario ? mapUsuarioToForm(usuario) : initialForm))
  const [crearUsuario, crearEstado] = useMutation(CREAR_USUARIO, { client })
const [actualizarUsuario, actualizarEstado] = useMutation(ACTUALIZAR_USUARIO, {
  client,
  onError: (error) => {
    console.error("GraphQL Errors:", error.graphQLErrors);
    console.error("Network Error:", error.networkError);
  }
});

const loading = crearEstado.loading || actualizarEstado.loading;
const error = crearEstado.error || actualizarEstado.error;
 //Detalle-Beneficiarios
const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>(usuario?.beneficiarios ?? []);

useEffect(() => {
    console.log("Precargando usuario:", usuario)
    if (usuario) 
     setForm( mapUsuarioToForm(usuario));
      setBeneficiarios(usuario?.beneficiarios ?? []);
    
  }, [usuario])

  const isEdit = useMemo(() => !!usuario, [usuario])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement

    if (name === "hobbies") {
      setForm((f) => {
        const exists = f.hobbies.includes(value)
        return { ...f, hobbies: exists ? f.hobbies.filter((h) => h !== value) : [...f.hobbies, value] }
      })
      return
    }

    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked } as FormUsuario))
      return
    }

    setForm((f) => ({ ...f, [name]: value } as FormUsuario))
  }
 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  const usuarioBase = mapFormToUsuario(form);

  const cleanBeneficiarios = beneficiarios
  .filter(b => b.nombre.trim() !== "")
  .map((b) => {
    const { __typename, ...rest } = b as any; // 👈 forzamos el cast
    return rest;
  });
const payload = {
  ...usuarioBase,
  beneficiarios: cleanBeneficiarios,
};
  // const payload = {
  //   ...usuarioBase,
  // beneficiarios: beneficiarios.filter(b => b.nombre.trim() !== ""),
  // };
  
  try {
    if (usuario?.id) {
      // Modo edición
      await actualizarUsuario({
        variables: { id: usuario.id, input: payload }
      });
    } else {
      // Modo creación
      await crearUsuario({ variables: { input: payload } });
    }

    console.log("✅ Payload enviado:", payload);
    router.push("/usuarios");
  } catch (err: any) {
    console.error("Error al guardar usuario:", err);
    alert("Error al guardar usuario");
  }
};



return (
  <form className="container mt-4" onSubmit={handleSubmit}>
    {/*Datos personales */}
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-primary text-white">
        🧍 Datos personales
      </div>
      <div className="card-body row g-3">
        <div className="col-md-6">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input type="text" className="form-control" id="nombre" name="nombre" value={form.nombre} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="apellidoPaterno" className="form-label">Apellido Paterno</label>
          <input type="text" className="form-control" id="apellidoPaterno" name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="apellidoMaterno" className="form-label">Apellido Materno</label>
          <input type="text" className="form-control" id="apellidoMaterno" name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label htmlFor="sexo" className="form-label">Sexo</label>
          <select className="form-select" id="sexo" name="sexo" value={form.sexo} onChange={handleChange}>
            <option value="">Selecciona</option>
            {CATALOGOS.SEXOS.map((sexo) => (
              <option key={sexo.value} value={sexo.value}>{sexo.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="fechaNacimiento" className="form-label">Fecha de nacimiento</label>
          <input type="date" className="form-control" id="fechaNacimiento" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <label htmlFor="edad" className="form-label">Edad</label>
          <input type="number" className="form-control" id="edad" name="edad" value={form.edad} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <label htmlFor="talla" className="form-label">Talla (m)</label>
          <input type="number" step="0.01" className="form-control" id="talla" name="talla" value={form.talla} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <label htmlFor="peso" className="form-label">Peso (kg)</label>
          <input type="number" className="form-control" id="peso" name="peso" value={form.peso} onChange={handleChange} />
        </div>
      </div>
    </div>

    {/* Contacto */}
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-secondary text-white">
        📞 Contacto
      </div>
      <div className="card-body row g-3">
        <div className="col-md-6">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input type="email" className="form-control" id="email" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="col-md-12 form-check ps-3">
          <input type="checkbox" className="form-check-input" id="aceptaTerminos" name="aceptaTerminos" checked={form.aceptaTerminos} onChange={handleChange} />
          <label className="form-check-label" htmlFor="aceptaTerminos">Acepto términos y condiciones</label>
        </div>
      </div>
    </div>

    {/*Perfil profesional */}
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-info text-white">
        💼 Perfil profesional
      </div>
      <div className="card-body row g-3">
        <div className="col-md-6">
          <label htmlFor="ocupacion" className="form-label">Ocupación</label>
          <input type="text" className="form-control" id="ocupacion" name="ocupacion" value={form.ocupacion} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="estadoCivil" className="form-label">Estado civil</label>
          <select className="form-select" id="estadoCivil" name="estadoCivil" value={form.estadoCivil} onChange={handleChange}>
            <option value="">Selecciona</option>
            {CATALOGOS.ESTADOS_CIVILES.map((estado) => (
              <option key={estado.value} value={estado.value}>{estado.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Nivel educativo</label>
          <div className="ps-2">
            {CATALOGOS.NIVELES_EDUCATIVOS.map((nivel) => (
              <div key={nivel.value} className="form-check">
                <input type="radio" className="form-check-input" id={`nivel-${nivel.value}`} name="nivelEducativo" value={nivel.value} checked={form.nivelEducativo === nivel.value} onChange={handleChange} />
                <label className="form-check-label" htmlFor={`nivel-${nivel.value}`}>{nivel.label}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="idioma" className="form-label">Idioma</label>
          <select className="form-select" id="idioma" name="idioma" value={form.idioma} onChange={handleChange}>
            <option value="">Selecciona</option>
            {CATALOGOS.IDIOMAS.map((idioma) => (
              <option key={idioma.value} value={idioma.value}>{idioma.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-12">
          <label className="form-label">Hobbies</label>
          <div className="d-flex flex-wrap gap-3">
            {CATALOGOS.HOBBIES_DISPONIBLES.map((hobby) => (
              <div key={hobby.value} className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id={`hobby-${hobby.value}`} name="hobbies" value={hobby.value} checked={form.hobbies.includes(hobby.value)} onChange={handleChange} />
                <label className="form-check-label" htmlFor={`hobby-${hobby.value}`}>{hobby.label}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-12">
          <label htmlFor="notasAdicionales" className="form-label">Notas adicionales</label>
          <textarea className="form-control" id="notasAdicionales" name="notasAdicionales" rows={3} value={form.notasAdicionales} onChange={handleChange}></textarea>
        </div>
      </div>
    </div>

    {/* Dirección */}
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-dark text-white">
        🏠 Dirección
      </div>
      <div className="card-body row g-3">
        <div className="col-md-6">
          <label htmlFor="entidad" className="form-label">Entidad</label>
          <input type="text" className="form-control" id="entidad" name="entidad" value={form.entidad} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label htmlFor="municipio" className="form-label">Municipio</label>
          <input type="text" className="form-control" id="municipio" name="municipio" value={form.municipio} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label htmlFor="colonia" className="form-label">Colonia</label>
          <input type="text" className="form-control" id="colonia" name="colonia" value={form.colonia} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label htmlFor="codigoPostal" className="form-label">Código Postal</label>
          <input type="text" className="form-control" id="codigoPostal" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} />
        </div>
      </div>
    </div>
{/* Detalle-Beneficiarios */}
<BeneficiariosForm beneficiarios={beneficiarios} setBeneficiarios={setBeneficiarios} />



    {/* Estatus y botón */}
    <div className="card shadow-sm">
      <div className="card-header bg-success text-white">
        ✅ Estatus
      </div>
      <div className="card-body row align-items-end g-3">
        <div className="col-md-6">
          <label htmlFor="estatus" className="form-label">Estatus</label>
          <select className="form-select" id="estatus" name="estatus" value={form.estatus} onChange={handleChange}>
            <option value="">Selecciona</option>
            {CATALOGOS.ESTATUS_USUARIO.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6 text-end">
          <button
            type="submit"
            className="btn btn-success px-5"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </button>
          {error && (
            <div className="alert alert-danger mt-3 mb-0" role="alert">
               Error: {error.message}
            </div>
          )}
        </div>
      </div>
    </div>
  </form>
)

}