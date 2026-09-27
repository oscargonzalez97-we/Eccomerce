import "./admin.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/HomePage";

import LoginPage from "./modules/auth/LoginPage";
import RegisterPage from "./modules/auth/RegisterPage";

import ProductCatalogPage
  from "./modules/productos/ProductCatalogPage";

import OrderPage
  from "./modules/pedidos/OrderPage";

import CreateOrderPage
  from "./modules/pedidos/CreateOrderPage";

import AdminDashboardPage
  from "./modules/admin/AdminDashboardPage";

import AdminUsuariosPage
  from "./modules/admin/AdminUsuariosPage";

import AdminProductosPage
  from "./modules/admin/AdminProductosPage";

import AdminPedidosPage
  from "./modules/admin/AdminPedidosPage";

import ProtectedRoute
  from "./components/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

function HomeRouter() {
  const {
    usuario,
    estaAutenticado,
    cargando,
  } = useAuth();

  if (cargando) {
    return (
      <section className="page">
        <div className="admin-panel">
          Cargando...
        </div>
      </section>
    );
  }

  if (
    estaAutenticado &&
    usuario?.rol === "ADMIN"
  ) {
    return <AdminDashboardPage />;
  }

  return <HomePage />;
}

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route element={<MainLayout />}>

            {/* =================================================
                INICIO AUTOMÁTICO
                CLIENTE → HOME
                ADMIN → DASHBOARD
               ================================================= */}

            <Route
              path="/"
              element={<HomeRouter />}
            />

            {/* =================================================
                AUTENTICACIÓN
               ================================================= */}

            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/registro"
              element={<RegisterPage />}
            />

            {/* =================================================
                CATÁLOGO
               ================================================= */}

            <Route
              path="/productos"
              element={<ProductCatalogPage />}
            />

            {/* =================================================
                PEDIDOS DEL CLIENTE
               ================================================= */}

            <Route
              element={<ProtectedRoute />}
            >

              <Route
                path="/pedidos"
                element={<OrderPage />}
              />

              <Route
                path="/pedidos/nuevo"
                element={<CreateOrderPage />}
              />

            </Route>

            {/* =================================================
                ADMINISTRACIÓN
               ================================================= */}

            <Route
              element={
                <ProtectedRoute adminOnly />
              }
            >

              <Route
                path="/admin"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />

              <Route
                path="/admin/usuarios"
                element={
                  <AdminUsuariosPage />
                }
              />

              <Route
                path="/admin/productos"
                element={
                  <AdminProductosPage />
                }
              />

              <Route
                path="/admin/pedidos"
                element={
                  <AdminPedidosPage />
                }
              />

            </Route>

          </Route>

          {/* =================================================
              RUTA NO ENCONTRADA
             ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;