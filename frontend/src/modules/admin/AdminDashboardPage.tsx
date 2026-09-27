import {
  useEffect,
  useState,
} from "react";

import "../../admin.css";

import { useAuth } from "../../context/AuthContext";

import { authService } from "../../services/authService";
import { productoService } from "../../services/productoService";
import { pedidoService } from "../../services/pedidoService";

import type { Usuario } from "../../types/usuario";
import type { Producto } from "../../types/producto";
import type { Pedido } from "../../types/pedido";

function AdminDashboardPage() {
  const { usuario } = useAuth();

  const [usuarios, setUsuarios] =
    useState<Usuario[]>([]);

  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [pedidos, setPedidos] =
    useState<Pedido[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  async function cargarDashboard() {
    try {
      setCargando(true);
      setError("");

      const [
        usuariosData,
        productosData,
        pedidosData,
      ] = await Promise.all([
        authService.obtenerUsuarios(),
        productoService.obtenerProductos(),
        pedidoService.obtenerPedidos(),
      ]);

      setUsuarios(usuariosData);
      setProductos(productosData);
      setPedidos(pedidosData);
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible cargar la información administrativa."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDashboard();
  }, []);

  async function eliminarUsuario(
    id: number
  ) {
    const confirmar =
      window.confirm(
        "¿Deseas eliminar este usuario?"
      );

    if (!confirmar) return;

    try {
      await authService.eliminarUsuario(id);
      await cargarDashboard();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible eliminar el usuario."
      );
    }
  }

  async function eliminarProducto(
    id: number
  ) {
    const confirmar =
      window.confirm(
        "¿Deseas eliminar este producto?"
      );

    if (!confirmar) return;

    try {
      await productoService.eliminarProducto(id);
      await cargarDashboard();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible eliminar el producto."
      );
    }
  }

  async function cambiarEstadoPedido(
    id: number,
    estado: Pedido["estado"]
  ) {
    try {
      await pedidoService.actualizarPedido(
        id,
        { estado }
      );

      await cargarDashboard();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible actualizar el pedido."
      );
    }
  }

  async function eliminarPedido(
    id: number
  ) {
    const confirmar =
      window.confirm(
        "¿Deseas eliminar este pedido?"
      );

    if (!confirmar) return;

    try {
      await pedidoService.eliminarPedido(id);
      await cargarDashboard();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible eliminar el pedido."
      );
    }
  }

  return (
    <section className="admin-dashboard">

      {/* ENCABEZADO */}

      <div className="admin-header">

        <div>
          <span className="admin-label">
            PANEL DE ADMINISTRACIÓN
          </span>

          <h1>
            Bienvenido, {usuario?.nombre}
          </h1>

          <p>
            Administra toda la plataforma
            desde este panel.
          </p>
        </div>

        <button
          type="button"
          onClick={cargarDashboard}
        >
          Actualizar
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* ESTADÍSTICAS */}

      <div className="admin-stats">

        <div className="admin-stat">

          <div className="admin-stat-icon">
            👥
          </div>

          <h3>
            Usuarios
          </h3>

          <strong>
            {usuarios.length}
          </strong>

        </div>

        <div className="admin-stat">

          <div className="admin-stat-icon">
            🛒
          </div>

          <h3>
            Productos
          </h3>

          <strong>
            {productos.length}
          </strong>

        </div>

        <div className="admin-stat">

          <div className="admin-stat-icon">
            📦
          </div>

          <h3>
            Pedidos
          </h3>

          <strong>
            {pedidos.length}
          </strong>

        </div>

      </div>

      {/* CARGANDO */}

      {cargando ? (

        <div className="admin-section">
          Cargando información
          administrativa...
        </div>

      ) : (

        <>

          {/* ============================
              USUARIOS
             ============================ */}

          <section className="admin-section">

            <span className="admin-label">
              ADMINISTRACIÓN
            </span>

            <h2>
              Usuarios
            </h2>

            <p>
              Consulta y administra las
              cuentas registradas.
            </p>

            {usuarios.length === 0 ? (

              <div className="empty">
                No existen usuarios registrados.
              </div>

            ) : (

              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Registro</th>
                      <th>Acciones</th>
                    </tr>

                  </thead>

                  <tbody>

                    {usuarios.map(
                      (usuarioItem) => (

                        <tr
                          key={usuarioItem.id}
                        >

                          <td>
                            #{usuarioItem.id}
                          </td>

                          <td>
                            <strong>
                              {usuarioItem.nombre}
                            </strong>
                          </td>

                          <td>
                            {usuarioItem.email}
                          </td>

                          <td>

                            <span
                              className={
                                usuarioItem.rol ===
                                "ADMIN"
                                  ? "role-badge admin"
                                  : "role-badge"
                              }
                            >
                              {usuarioItem.rol}
                            </span>

                          </td>

                          <td>
                            {usuarioItem.creadoEn
                              ? new Date(
                                  usuarioItem.creadoEn
                                ).toLocaleDateString(
                                  "es-MX"
                                )
                              : "—"}
                          </td>

                          <td>

                            <button
                              type="button"
                              className="danger"
                              onClick={() =>
                                eliminarUsuario(
                                  usuarioItem.id
                                )
                              }
                            >
                              Eliminar
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

          {/* ============================
              PRODUCTOS
             ============================ */}

          <section className="admin-section">

            <span className="admin-label">
              CATÁLOGO
            </span>

            <h2>
              Productos
            </h2>

            <p>
              Consulta el catálogo y controla
              el inventario.
            </p>

            {productos.length === 0 ? (

              <div className="empty">
                No existen productos registrados.
              </div>

            ) : (

              <div className="management-list">

                {productos.map(
                  (producto) => (

                    <article
                      key={producto.id}
                      className="management-item"
                    >

                      <div>

                        <h3>
                          {producto.nombre}
                        </h3>

                        <p>
                          {producto.descripcion}
                        </p>

                        <strong>
                          $
                          {producto.precio.toFixed(
                            2
                          )}
                        </strong>

                        <p>
                          Stock: {producto.stock}
                        </p>

                      </div>

                      <div className="item-actions">

                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            eliminarProducto(
                              producto.id
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

          {/* ============================
              PEDIDOS
             ============================ */}

          <section className="admin-section">

            <span className="admin-label">
              OPERACIONES
            </span>

            <h2>
              Pedidos
            </h2>

            <p>
              Consulta y actualiza el estado
              de los pedidos.
            </p>

            {pedidos.length === 0 ? (

              <div className="empty">
                No existen pedidos registrados.
              </div>

            ) : (

              <div className="orders-list">

                {pedidos.map(
                  (pedido) => (

                    <article
                      key={pedido.id}
                      className="order-card"
                    >

                      <div className="order-header">

                        <div>

                          <span className="admin-label">
                            PEDIDO
                          </span>

                          <h3>
                            #{pedido.id}
                          </h3>

                          <p>
                            Usuario #
                            {pedido.usuarioId}
                          </p>

                        </div>

                        <strong>
                          $
                          {pedido.total.toFixed(
                            2
                          )}
                        </strong>

                      </div>

                      <div className="order-products">

                        {pedido.productos.map(
                          (producto) => (

                            <div
                              key={
                                producto.productoId
                              }
                              className="order-product"
                            >

                              <span>
                                {
                                  producto.nombreProducto
                                }

                                {" × "}

                                {
                                  producto.cantidad
                                }
                              </span>

                              <span>
                                $
                                {(
                                  producto.precioUnitario *
                                  producto.cantidad
                                ).toFixed(2)}
                              </span>

                            </div>

                          )
                        )}

                      </div>

                      <div className="order-footer">

                        <div>

                          <span>
                            Estado
                          </span>

                          <select
                            value={
                              pedido.estado
                            }
                            onChange={(
                              event
                            ) =>
                              cambiarEstadoPedido(
                                pedido.id,
                                event.target
                                  .value as Pedido["estado"]
                              )
                            }
                          >

                            <option value="PENDIENTE">
                              PENDIENTE
                            </option>

                            <option value="PAGADO">
                              PAGADO
                            </option>

                            <option value="ENVIADO">
                              ENVIADO
                            </option>

                            <option value="ENTREGADO">
                              ENTREGADO
                            </option>

                            <option value="CANCELADO">
                              CANCELADO
                            </option>

                          </select>

                        </div>

                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            eliminarPedido(
                              pedido.id
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        </>

      )}

    </section>
  );
}

export default AdminDashboardPage;