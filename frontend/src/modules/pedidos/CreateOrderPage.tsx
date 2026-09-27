import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { FormEvent } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { productoService } from "../../services/productoService";

import { pedidoService } from "../../services/pedidoService";

import { useAuth } from "../../context/AuthContext";

import type { Producto } from "../../types/producto";

interface ProductoSeleccionado {
  productoId: number;
  cantidad: number;
}

const CARRITO_KEY =
  "ecommerce_carrito";

function CreateOrderPage() {
  const navigate = useNavigate();

  const { usuario } =
    useAuth();

  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [seleccionados, setSeleccionados] =
    useState<ProductoSeleccionado[]>(() => {
      const guardado =
        localStorage.getItem(
          CARRITO_KEY
        );

      if (!guardado) {
        return [];
      }

      try {
        return JSON.parse(guardado);
      } catch {
        return [];
      }
    });

  const [mensaje, setMensaje] =
    useState("");

  const [error, setError] =
    useState("");

  const [creando, setCreando] =
    useState(false);

  useEffect(() => {

    productoService
      .obtenerProductos()
      .then(setProductos)
      .catch(() =>
        setError(
          "No fue posible cargar los productos."
        )
      );

  }, []);

  useEffect(() => {

    localStorage.setItem(
      CARRITO_KEY,
      JSON.stringify(
        seleccionados
      )
    );

  }, [seleccionados]);

  const productosSeleccionados =
    useMemo(() => {

      return seleccionados
        .map((seleccionado) => {

          const producto =
            productos.find(
              (item) =>
                item.id ===
                seleccionado.productoId
            );

          if (!producto) {
            return null;
          }

          return {
            producto,
            cantidad:
              seleccionado.cantidad,
            subtotal:
              producto.precio *
              seleccionado.cantidad,
          };

        })
        .filter(
          (
            item
          ): item is {
            producto: Producto;
            cantidad: number;
            subtotal: number;
          } => item !== null
        );

    }, [
      seleccionados,
      productos,
    ]);

  const total =
    productosSeleccionados.reduce(
      (suma, item) =>
        suma + item.subtotal,
      0
    );

  const cantidadProductos =
    seleccionados.reduce(
      (suma, item) =>
        suma + item.cantidad,
      0
    );

  function cambiarCantidad(
    productoId: number,
    cantidad: number
  ) {

    const producto =
      productos.find(
        (item) =>
          item.id === productoId
      );

    if (!producto) {
      return;
    }

    if (cantidad <= 0) {

      setSeleccionados(
        (actuales) =>
          actuales.filter(
            (item) =>
              item.productoId !==
              productoId
          )
      );

      return;
    }

    const cantidadValida =
      Math.min(
        cantidad,
        producto.stock
      );

    setSeleccionados(
      (actuales) =>
        actuales.map(
          (item) =>
            item.productoId ===
            productoId
              ? {
                  ...item,
                  cantidad:
                    cantidadValida,
                }
              : item
        )
    );
  }

  function eliminarProducto(
    productoId: number
  ) {

    setSeleccionados(
      (actuales) =>
        actuales.filter(
          (item) =>
            item.productoId !==
            productoId
        )
    );

  }

  async function crearPedido(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setMensaje("");
    setError("");

    if (!usuario?.id) {

      setError(
        "Tu sesión no es válida. Inicia sesión nuevamente."
      );

      return;
    }

    if (
      seleccionados.length === 0
    ) {

      setError(
        "Debes agregar al menos un producto."
      );

      return;
    }

    try {

      setCreando(true);

      const pedido =
        await pedidoService.crearPedido({
          usuarioId: usuario.id,

          productos:
            seleccionados,
        });

      setMensaje(
        `Pedido #${pedido.id} creado correctamente.`
      );

      setSeleccionados([]);

      localStorage.removeItem(
        CARRITO_KEY
      );

      setTimeout(() => {
        navigate("/pedidos");
      }, 800);

    } catch (error: any) {

      setError(
        error.response?.data?.error ??
          "No fue posible crear el pedido."
      );

    } finally {

      setCreando(false);

    }
  }

  return (
    <section className="page">

      <div className="page-header">

        <div>

          <span className="eyebrow">
            COMPRA
          </span>

          <h1>
            Confirmar pedido
          </h1>

          <p>
            Revisa los productos antes de
            confirmar tu compra.
          </p>

        </div>

        <Link
          to="/productos"
          className="secondary-button"
        >
          ← Seguir comprando
        </Link>

      </div>

      {mensaje && (
        <div className="success">
          ✓ {mensaje}
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {seleccionados.length === 0 ? (

        <div className="empty">

          <h2>
            Tu pedido está vacío
          </h2>

          <p>
            Regresa al catálogo y agrega
            productos.
          </p>

          <Link
            to="/productos"
            className="primary-button"
          >
            Ver productos
          </Link>

        </div>

      ) : (

        <form
          className="checkout-layout"
          onSubmit={crearPedido}
        >

          {/* PRODUCTOS */}

          <section className="checkout-products">

            <div className="checkout-card-header">

              <div>
                <span className="eyebrow">
                  CARRITO
                </span>

                <h2>
                  Tu pedido
                </h2>
              </div>

              <span className="admin-count">
                {cantidadProductos}
              </span>

            </div>

            <div className="checkout-product-list">

              {productosSeleccionados.map(
                ({
                  producto,
                  cantidad,
                  subtotal,
                }) => (

                  <article
                    className="checkout-product"
                    key={producto.id}
                  >

                    <div className="checkout-product-icon">
                      🛒
                    </div>

                    <div className="checkout-product-info">

                      <strong>
                        {producto.nombre}
                      </strong>

                      <span>
                        $
                        {producto.precio.toFixed(
                          2
                        )}{" "}
                        por unidad
                      </span>

                    </div>

                    <div className="checkout-quantity">

                      <button
                        type="button"
                        onClick={() =>
                          cambiarCantidad(
                            producto.id,
                            cantidad - 1
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {cantidad}
                      </span>

                      <button
                        type="button"
                        disabled={
                          cantidad >=
                          producto.stock
                        }
                        onClick={() =>
                          cambiarCantidad(
                            producto.id,
                            cantidad + 1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                    <strong className="checkout-subtotal">
                      $
                      {subtotal.toFixed(2)}
                    </strong>

                    <button
                      type="button"
                      className="checkout-remove"
                      onClick={() =>
                        eliminarProducto(
                          producto.id
                        )
                      }
                      title="Eliminar"
                    >
                      ×
                    </button>

                  </article>

                )
              )}

            </div>

          </section>

          {/* RESUMEN */}

          <aside className="checkout-summary">

            <div className="checkout-card-header">

              <div>

                <span className="eyebrow">
                  RESUMEN
                </span>

                <h2>
                  Tu compra
                </h2>

              </div>

            </div>

            <div className="checkout-summary-row">

              <span>
                Productos
              </span>

              <strong>
                {cantidadProductos}
              </strong>

            </div>

            <div className="checkout-summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ${total.toFixed(2)}
              </strong>

            </div>

            <div className="checkout-divider" />

            <div className="checkout-total">

              <span>
                Total
              </span>

              <strong>
                ${total.toFixed(2)}
              </strong>

            </div>

            <button
              type="submit"
              className="primary-button checkout-submit"
              disabled={creando}
            >
              {creando
                ? "Creando pedido..."
                : "✓ Confirmar pedido"}
            </button>

            <p className="checkout-note">
              El pedido se registrará a nombre
              de <strong>{usuario?.nombre}</strong>.
            </p>

          </aside>

        </form>

      )}

    </section>
  );
}

export default CreateOrderPage;