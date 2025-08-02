export interface Usuario {
  id?: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  sexo: string;
  fechaNacimiento?: string;
  edad: number;
  talla: number;
  peso: number;
  email: string;
  aceptaTerminos?: boolean;
  estatus?: string;
  entidad?: string;
  municipio?: string;
  colonia?: string;
  codigoPostal?: string;
  ocupacion?: string;
  estadoCivil?: string;
  nivelEducativo?: string;
  idioma?: string;
  hobbies?: string[];
  notasAdicionales?: string;
  createdAt?: string;
  updatedAt?: string;
}
