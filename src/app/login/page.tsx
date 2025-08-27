"use client";

import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOGIN } from "../../lib/graphql/auth";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login,usuario } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const router = useRouter();
  const [doLogin, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      login(data.login.access_token, data.login.usuario);
    },
  });


   useEffect(() => {
    if (usuario) {
      router.push("/usuarios");
    }
  }, [usuario, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin({ variables: { email, password } });
  };

//   return (
//     <form onSubmit={handleSubmit} className="p-3">
//       <h3>Iniciar Sesión</h3>
//       <input
//         type="email"
//         placeholder="Correo"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="form-control my-2"
//       />
//       <input
//         type="password"
//         placeholder="Contraseña"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="form-control my-2"
//       />
//       <button type="submit" className="btn btn-primary" disabled={loading}>
//         {loading ? "Entrando..." : "Entrar"}
//       </button>
//       {error && <p className="text-danger">Error: {error.message}</p>}
//     </form>
//   );
// }
 return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ maxWidth: "420px", width: "100%" }}
      >
     
        <div className="text-center mb-4">
          <i
            className="bi bi-grid-fill text-primary"
            style={{ fontSize: "2.5rem" }}
          ></i>
          <h3 className="fw-bold mt-2">
            Bienvenido a <span className="text-primary">App Mario</span>
          </h3>
          <p className="text-muted">Inicia sesión para continuar</p>
        </div>

        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-danger small">Credenciales inválidas</p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />{" "}
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="small text-muted">
            ¿Olvidaste tu contraseña?{" "}
            <a href="#" className="text-decoration-none">
              Recupérala aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}