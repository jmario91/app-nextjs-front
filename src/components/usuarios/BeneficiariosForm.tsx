"use client";

import { Beneficiario } from "../../types/beneficiario";

interface Props {
  beneficiarios: Beneficiario[];
  setBeneficiarios: (items: Beneficiario[]) => void;
}

export default function BeneficiariosForm({ beneficiarios, setBeneficiarios }: Props) {
  // 👉 Agregar nuevo beneficiario
  const handleAdd = () => {
    const nuevo: Beneficiario = {
      id: String(Date.now()),       // Genera ID único
      idDetalle: "DET-" + Date.now(), // ID detalle automático
      nombre: "",
    };
    setBeneficiarios([...beneficiarios, nuevo]);
  };

  // 👉 Editar nombre
  const handleChange = (id: string, value: string) => {
    setBeneficiarios(
      beneficiarios.map((b) =>
        b.id === id ? { ...b, nombre: value } : b
      )
    );
  };

  // 👉 Eliminar beneficiario
  const handleRemove = (id: string) => {
    setBeneficiarios(beneficiarios.filter((b) => b.id !== id));
  };

 

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-warning">
        👥 Beneficiarios
      </div>
      <div className="card-body">
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={handleAdd}
        >
          + Agregar Beneficiario
        </button>

        {beneficiarios.length === 0 ? (
          <p className="text-muted">No hay beneficiarios agregados.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                    {/* <th style={{ width: "20%" }}>ID</th>
                    <th style={{ width: "25%" }}>ID Detalle</th> */}
                  <th style={{ width: "40%" }}>Nombre Beneficiario</th>
                  <th style={{ width: "15%" }} className="text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {beneficiarios.map((b) => (
                  <tr key={b.id}>
                    {/* <td>{b.id}</td>
                    <td>{b.idDetalle}</td> */}
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={b.nombre}
                        onChange={(e) => handleChange(b.id, e.target.value)}
                        placeholder="Nombre del beneficiario"
                      />
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemove(b.id)}
                      >
                        🗑 Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
