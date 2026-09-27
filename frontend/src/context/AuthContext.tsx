import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Usuario } from "../types/usuario";

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  estaAutenticado: boolean;
  cargando: boolean;
  iniciarSesion: (
    usuario: Usuario,
    token: string
  ) => void;
  cerrarSesion: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [cargando, setCargando] =
    useState(true);

  useEffect(() => {
    try {
      const usuarioGuardado =
        localStorage.getItem(
          "ecommerce_usuario"
        );

      const tokenGuardado =
        localStorage.getItem(
          "ecommerce_token"
        );

      if (
        usuarioGuardado &&
        tokenGuardado
      ) {
        const usuarioParseado =
          JSON.parse(
            usuarioGuardado
          ) as Usuario;

        setUsuario(usuarioParseado);
        setToken(tokenGuardado);
      }
    } catch {
      localStorage.removeItem(
        "ecommerce_usuario"
      );

      localStorage.removeItem(
        "ecommerce_token"
      );

      setUsuario(null);
      setToken(null);
    } finally {
      setCargando(false);
    }
  }, []);

  function iniciarSesion(
    usuarioAutenticado: Usuario,
    tokenAutenticado: string
  ) {
    setUsuario(usuarioAutenticado);
    setToken(tokenAutenticado);

    localStorage.setItem(
      "ecommerce_usuario",
      JSON.stringify(
        usuarioAutenticado
      )
    );

    localStorage.setItem(
      "ecommerce_token",
      tokenAutenticado
    );
  }

  function cerrarSesion() {
    setUsuario(null);
    setToken(null);

    localStorage.removeItem(
      "ecommerce_usuario"
    );

    localStorage.removeItem(
      "ecommerce_token"
    );
  }

  const estaAutenticado =
    usuario !== null &&
    token !== null;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        estaAutenticado,
        cargando,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return context;
}