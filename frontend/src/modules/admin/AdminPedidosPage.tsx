import { useEffect, useState } from "react";

import { pedidoService } from "../../services/pedidoService";

import type { Pedido } from "../../types/pedido";

function AdminPedidosPage() {
  const [pedidos, setPedidos] =
    useState<Pedido[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actualizando, setActualizando] =
    useState<number | null>(null);

  async function cargarPedidos() {
    try {
      setCargando(true);
      setError("");

      const datos =
        await pedidoService.obtenerPedidos();

      setPedidos(datos);
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible cargar los pedidos."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cambiarEstado(
    id: number,
    estado: Pedido["estado"]
  ) {
    try {
      setActualizando(id);
      setError("");

      await pedidoService.actualizarPedido(
        id,
        { estado }
      );

      await cargarPedidos();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible actualizar el pedido."
      );
    } finally {
      setActualizando(null);
    }
  }

  async function eliminarPedido(
    id: number
  ) {
    const confirmar =
      window.confirm(
        `¿Deseas eliminar el pedido #${id}?`
      );

    if (!confirmar) return;

    try {
      setError("");

      await pedidoService.eliminarPedido(id);

      await cargarPedidos();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible eliminar el pedido."
      );
    }
  }

  const pendientes =
    pedidos.filter(
      (pedido) =>
        pedido.estado === "PENDIENTE"
    ).length;



  const enviados =
    pedidos.filter(
      (pedido) =>
        pedido.estado === "ENVIADO"
    ).length;

  const totalVentas =
    pedidos
      .filter(
        (pedido) =>
          pedido.estado !== "CANCELADO"
      )
      .reduce(
        (total, pedido) =>
          total + pedido.total,
        0
      );

  function obtenerClaseEstado(
    estado: Pedido["estado"]
  ) {
    switch (estado) {
      case "PAGADO":
        return "order-status paid";

      case "ENVIADO":
        return "order-status shipped";

      case "ENTREGADO":
        return "order-status delivered";

      case "CANCELADO":
        return "order-status cancelled";

      default:
        return "order-status pending";
    }
  }

  function obtenerIconoEstado(
    estado: Pedido["estado"]
  ) {
    switch (estado) {
      case "PAGADO":
        return "✓";

      case "ENVIADO":
        return "🚚";

      case "ENTREGADO":
        return "✓";

      case "CANCELADO":
        return "×";

      default:
        return "◷";
    }
  }

  return (
    <section className="admin-page">

      {/* HEADER */}

      <div className="admin-page-header">

        <div>

          <span className="admin-label">
            ADMINISTRACIÓN
          </span>

          <h1>
            Pedidos
          </h1>

          <p>
            Consulta, gestiona y actualiza los
            pedidos realizados en la tienda.
          </p>

        </div>

        <div className="admin-header-actions">

          <button
            className="admin-button secondary"
            onClick={cargarPedidos}
          >
            ↻ Actualizar
          </button>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="admin-alert error">
          {error}
        </div>
      )}

      {/* ESTADÍSTICAS */}

      <div className="admin-order-stats">

        <div className="admin-order-stat">

          <div className="admin-order-stat-icon">
            📦
          </div>

          <div>
            <span>
              Total de pedidos
            </span>

            <strong>
              {pedidos.length}
            </strong>
          </div>

        </div>

        <div className="admin-order-stat">

          <div className="admin-order-stat-icon">
            ◷
          </div>

          <div>
            <span>
              Pendientes
            </span>

            <strong>
              {pendientes}
            </strong>
          </div>

        </div>

        <div className="admin-order-stat">

          <div className="admin-order-stat-icon">
            🚚
          </div>

          <div>
            <span>
              Enviados
            </span>

            <strong>
              {enviados}
            </strong>
          </div>

        </div>

        <div className="admin-order-stat">

          <div className="admin-order-stat-icon">
            💰
          </div>

          <div>
            <span>
              Ventas
            </span>

            <strong>
              ${totalVentas.toFixed(2)}
            </strong>
          </div>

        </div>

      </div>

      {/* PEDIDOS */}

      <section className="admin-orders-card">

        <div className="admin-card-header">

          <div>

            <span className="admin-label">
              OPERACIONES
            </span>

            <h2>
              Pedidos registrados
            </h2>

          </div>

          <span className="admin-count">
            {pedidos.length}
          </span>

        </div>

        {cargando ? (

          <div className="admin-loading">
            Cargando pedidos...
          </div>

        ) : pedidos.length === 0 ? (

          <div className="admin-empty">

            <div>
              📦
            </div>

            <h3>
              No hay pedidos
            </h3>

            <p>
              Todavía no existen pedidos
              registrados en la plataforma.
            </p>

          </div>

        ) : (

          <div className="admin-order-list">

            {pedidos.map((pedido) => (

              <article
                className="admin-order-item"
                key={pedido.id}
              >

                {/* CABECERA DEL PEDIDO */}

                <div className="admin-order-header">

                  <div className="admin-order-heading">

                    <div className="admin-order-icon">
                      📦
                    </div>

                    <div>

                      <span>
                        PEDIDO
                      </span>

                      <h3>
                        #{pedido.id}
                      </h3>

                    </div>

                  </div>

                  <div className="admin-order-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      ${pedido.total.toFixed(2)}
                    </strong>

                  </div>

                </div>

                {/* INFORMACIÓN */}

                <div className="admin-order-info">

                  <div>

                    <span className="admin-info-label">
                      Cliente
                    </span>

                    <strong>
                      Usuario #{pedido.usuarioId}
                    </strong>

                  </div>

                  <div>

                    <span className="admin-info-label">
                      Productos
                    </span>

                    <strong>
                      {pedido.productos.length}
                    </strong>

                  </div>

                  <div>

                    <span className="admin-info-label">
                      Estado actual
                    </span>

                    <span
                      className={obtenerClaseEstado(
                        pedido.estado
                      )}
                    >
                      <span>
                        {obtenerIconoEstado(
                          pedido.estado
                        )}
                      </span>

                      {pedido.estado}
                    </span>

                  </div>

                </div>

                {/* PRODUCTOS */}

                <div className="admin-order-products">

                  <div className="admin-order-products-title">
                    Productos del pedido
                  </div>

                  {pedido.productos.map(
                    (producto) => (

                      <div
                        className="admin-order-product"
                        key={
                          producto.productoId
                        }
                      >

                        <div>

                          <strong>
                            {
                              producto.nombreProducto
                            }
                          </strong>

                          <span>
                            Cantidad:{" "}
                            {
                              producto.cantidad
                            }
                          </span>

                        </div>

                        <strong>
                          $
                          {(
                            producto.precioUnitario *
                            producto.cantidad
                          ).toFixed(2)}
                        </strong>

                      </div>

                    )
                  )}

                </div>

                {/* ACCIONES */}

                <div className="admin-order-actions">

                  <div className="admin-order-status-control">

                    <label>
                      Actualizar estado
                    </label>

                    <select
                      value={
                        pedido.estado
                      }
                      disabled={
                        actualizando ===
                        pedido.id
                      }
                      onChange={(event) =>
                        cambiarEstado(
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
                    className="admin-delete-order"
                    onClick={() =>
                      eliminarPedido(
                        pedido.id
                      )
                    }
                  >
                    🗑 Eliminar pedido
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </section>
  );
}

export default AdminPedidosPage;