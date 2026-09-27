import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { pedidoService } from "../../services/pedidoService";
import type { Pedido } from "../../types/pedido";

function obtenerClaseEstado(estado: Pedido["estado"]) {
  switch (estado) {
    case "PENDIENTE":
      return "order-status order-status-pending";

    case "PAGADO":
      return "order-status order-status-paid";

    case "ENVIADO":
      return "order-status order-status-shipped";

    case "ENTREGADO":
      return "order-status order-status-delivered";

    case "CANCELADO":
      return "order-status order-status-cancelled";

    default:
      return "order-status";
  }
}

function obtenerTextoEstado(estado: Pedido["estado"]) {
  switch (estado) {
    case "PENDIENTE":
      return "Pendiente";

    case "PAGADO":
      return "Pagado";

    case "ENVIADO":
      return "Enviado";

    case "ENTREGADO":
      return "Entregado";

    case "CANCELADO":
      return "Cancelado";

    default:
      return estado;
  }
}

function obtenerIconoEstado(estado: Pedido["estado"]) {
  switch (estado) {
    case "PENDIENTE":
      return "⏳";

    case "PAGADO":
      return "💳";

    case "ENVIADO":
      return "🚚";

    case "ENTREGADO":
      return "✓";

    case "CANCELADO":
      return "✕";

    default:
      return "•";
  }
}

function OrderPage() {
  const { usuario } = useAuth();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargarPedidos() {
    if (!usuario) {
      return;
    }

    try {
      setCargando(true);
      setError("");

      const resultado =
        await pedidoService.obtenerPedidosUsuario(
          usuario.id
        );

      setPedidos(resultado);
    } catch (err) {
      console.error(err);

      setError(
        "No pudimos cargar tus pedidos. Intenta nuevamente."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPedidos();
  }, [usuario]);

  return (
    <section className="page orders-page">

      <div className="orders-header">

        <div>
          <span className="orders-kicker">
            MI CUENTA
          </span>

          <h1>Mis pedidos</h1>

          <p>
            Consulta tus compras, productos y estado
            de entrega.
          </p>
        </div>

        <button
          className="orders-refresh-button"
          onClick={cargarPedidos}
          disabled={cargando}
        >
          ↻
          <span>
            {cargando
              ? "Actualizando..."
              : "Actualizar"}
          </span>
        </button>

      </div>

      {cargando && (
        <div className="orders-loading">

          <div className="orders-spinner">
            ↻
          </div>

          <h3>Cargando tus pedidos...</h3>

          <p>
            Estamos consultando tu historial de compras.
          </p>

        </div>
      )}

      {!cargando && error && (
        <div className="orders-error">
          <span>⚠️</span>

          <div>
            <strong>
              No pudimos cargar tus pedidos
            </strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      {!cargando &&
        !error &&
        pedidos.length === 0 && (
          <div className="orders-empty">

            <div className="orders-empty-icon">
              🛍️
            </div>

            <h2>Aún no tienes pedidos</h2>

            <p>
              Cuando realices una compra,
              aparecerá aquí.
            </p>

            <a
              href="/productos"
              className="orders-shop-button"
            >
              Explorar productos
            </a>

          </div>
        )}

      {!cargando &&
        !error &&
        pedidos.length > 0 && (
          <div className="orders-list">

            {pedidos.map((pedido) => (

              <article
                className="order-card"
                key={pedido.id}
              >

                <div className="order-card-top">

                  <div>
                    <span className="order-number-label">
                      PEDIDO
                    </span>

                    <h2>
                      #{pedido.id}
                    </h2>
                  </div>

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

                    {obtenerTextoEstado(
                      pedido.estado
                    )}
                  </span>

                </div>

                <div className="order-card-info">

                  <div className="order-info-item">

                    <span>
                      Fecha
                    </span>

                    <strong>
                      {pedido.creadoEn
                        ? new Date(
                            pedido.creadoEn
                          ).toLocaleDateString(
                            "es-MX",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "Sin fecha"}
                    </strong>

                  </div>

                  <div className="order-info-item">

                    <span>
                      Productos
                    </span>

                    <strong>
                      {pedido.productos.length}
                    </strong>

                  </div>

                  <div className="order-info-item order-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      ${Number(
                        pedido.total
                      ).toLocaleString(
                        "es-MX",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </strong>

                  </div>

                </div>

                <div className="order-products">

                  <div className="order-products-title">
                    Productos del pedido
                  </div>

                  {pedido.productos.map(
                    (producto) => (

                      <div
                        className="order-product"
                        key={
                          producto.productoId
                        }
                      >

                        <div className="order-product-icon">
                          📦
                        </div>

                        <div className="order-product-main">

                          <strong>
                            {producto.nombreProducto}
                          </strong>

                          <span>
                            {producto.cantidad}{" "}
                            {producto.cantidad === 1
                              ? "unidad"
                              : "unidades"}
                          </span>

                        </div>

                        <div className="order-product-price">

                          <span>
                            $
                            {Number(
                              producto.precioUnitario
                            ).toLocaleString(
                              "es-MX",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}
                          </span>

                          <small>
                            c/u
                          </small>

                        </div>

                      </div>

                    )
                  )}

                </div>

                <div className="order-card-footer">

                  <span>
                    Gracias por tu compra 💙
                  </span>

                  <strong>
                    Total: $
                    {Number(
                      pedido.total
                    ).toLocaleString(
                      "es-MX",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </strong>

                </div>

              </article>

            ))}

          </div>
        )}

    </section>
  );
}

export default OrderPage;