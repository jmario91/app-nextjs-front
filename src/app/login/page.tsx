"use client";

import { useMutation } from "@apollo/client";
import { useState } from "react";
import { LOGIN } from "../../lib/graphql/auth";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [doLogin, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      login(data.login.access_token, data.login.usuario);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin({ variables: { email, password } });
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <h3>Iniciar Sesión</h3>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-control my-2"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-control my-2"
      />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
      {error && <p className="text-danger">Error: {error.message}</p>}
    </form>
  );
}
