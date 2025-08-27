"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies  from "js-cookie";

type Usuario = {
  id: string;
  nombre: string;
  email: string;
};

type AuthContextType = {
  usuario: Usuario | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
 const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("usuario");
    if (token && storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  const login = (token: string, usuario: Usuario) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    Cookies.set("token", token,{ expires: 1 }); 
    setUsuario(usuario);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    Cookies.remove("token");
    setUsuario(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
      </AuthContext.Provider>
    
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
