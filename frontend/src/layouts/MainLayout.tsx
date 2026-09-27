import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function MainLayout() {
  const {
    usuario,
    estaAutenticado,
    cerrarSesion,
  } = useAuth();

  const navigate = useNavigate();

  const esAdministrador =
    estaAutenticado &&
    usuario?.rol === "ADMIN";

  function handleLogout() {
    cerrarSesion();
    navigate("/");
  }

  return (
    <div className="app">

      <header
        className={
          esAdministrador
            ? "navbar navbar-admin"
            : "navbar"
        }
      >

        {/* LOGO */}

        <Link
          to="/"
          className="navbar-brand"
        >

          <span className="brand-icon">
            {esAdministrador ? "🛡️" : "🛒"}
          </span>

          <span>
            {esAdministrador
              ? "ECOMMERCE ADMIN"
              : "ECOMMERCE"}
          </span>

        </Link>

        {/* NAVEGACIÓN */}

        <nav className="navbar-menu">

          {esAdministrador ? (
            <>
              <Link to="/">
                Dashboard
              </Link>

              <Link to="/admin/usuarios">
                Usuarios
              </Link>

              <Link to="/admin/productos">
                Productos
              </Link>

              <Link to="/admin/pedidos">
                Pedidos
              </Link>
            </>
          ) : (
            <>
              <Link to="/">
                Inicio
              </Link>

              <Link to="/productos">
                Productos
              </Link>

              {estaAutenticado && (
                <Link to="/pedidos">
                  Mis pedidos
                </Link>
              )}
            </>
          )}

        </nav>

        {/* CUENTA */}

        <div className="navbar-account">

          {estaAutenticado ? (
            <>

              <div className="user-info">

                <span className="user-avatar">
                  {usuario?.nombre
                    ?.charAt(0)
                    .toUpperCase()}
                </span>

                <div className="user-details">

  <span>
    Hola, {usuario?.nombre}
  </span>

  {esAdministrador && (
    <small>
      Administrador
    </small>
  )}

</div>

              </div>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>

            </>
          ) : (
            <>

              <Link
                to="/login"
                className="login-button"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/registro"
                className="register-button"
              >
                Crear cuenta
              </Link>

            </>
          )}

        </div>

      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer className="footer">

        <div>
          <strong>
            {esAdministrador
              ? "ECOMMERCE ADMIN"
              : "ECOMMERCE"}
          </strong>
        </div>

        <span>
          {esAdministrador
            ? "Panel de Administración"
            : "Sistema de Comercio Electrónico"}
        </span>

      </footer>

    </div>
  );
}

export default MainLayout;