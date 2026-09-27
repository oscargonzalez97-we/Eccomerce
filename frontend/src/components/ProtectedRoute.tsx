import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

function ProtectedRoute({
  adminOnly = false,
}: ProtectedRouteProps) {
  const {
    usuario,
    estaAutenticado,
    cargando,
  } = useAuth();

  const location =
    useLocation();

  /*
   * Mientras AuthContext recupera
   * la sesión desde localStorage,
   * no debemos redirigir al login.
   */
  if (cargando) {
    return (
      <section className="page">
        <div className="admin-panel">
          Verificando sesión...
        </div>
      </section>
    );
  }

  /*
   * Cuando ya sabemos si existe
   * una sesión válida.
   */
  if (!estaAutenticado) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /*
   * Protección específica para
   * las rutas administrativas.
   */
  if (
    adminOnly &&
    usuario?.rol !== "ADMIN"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;