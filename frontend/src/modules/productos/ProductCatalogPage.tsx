import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { productoService } from "../../services/productoService";

import { useAuth } from "../../context/AuthContext";

import type { Producto } from "../../types/producto";

interface ProductoCarrito {
  productoId: number;
  cantidad: number;
}

const CARRITO_KEY =
  "ecommerce_carrito";

function ProductCatalogPage() {
  const navigate = useNavigate();

  const { estaAutenticado } =
    useAuth();

  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [carrito, setCarrito] =
    useState<ProductoCarrito[]>(() => {
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

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  async function cargarProductos() {
    try {
      setCargando(true);
      setError("");

      const datos =
        await productoService.obtenerProductos();

      setProductos(datos);
    } catch {
      setError(
        "No fue posible cargar los productos."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      CARRITO_KEY,
      JSON.stringify(carrito)
    );
  }, [carrito]);

  function agregarAlCarrito(
    producto: Producto
  ) {
    if (!estaAutenticado) {
      const confirmar =
        window.confirm(
          "Necesitas iniciar sesión para realizar una compra.\n\n¿Deseas iniciar sesión?"
        );

      if (confirmar) {
        navigate("/login");
      }

      return;
    }

    setCarrito((actual) => {
      const existente =
        actual.find(
          (item) =>
            item.productoId ===
            producto.id
        );

      if (existente) {
        return actual.map((item) =>
          item.productoId ===
          producto.id
            ? {
                ...item,
                cantidad: Math.min(
                  item.cantidad + 1,
                  producto.stock
                ),
              }
            : item
        );
      }

      return [
        ...actual,
        {
          productoId: producto.id,
          cantidad: 1,
        },
      ];
    });
  }

  function irAlPedido() {
    if (!estaAutenticado) {
      navigate("/login");
      return;
    }

    if (carrito.length === 0) {
      return;
    }

    navigate("/pedidos/nuevo");
  }

  function cantidadEnCarrito(
    productoId: number
  ) {
    return (
      carrito.find(
        (item) =>
          item.productoId ===
          productoId
      )?.cantidad ?? 0
    );
  }

  const cantidadTotal =
    carrito.reduce(
      (total, item) =>
        total + item.cantidad,
      0
    );

  return (
    <main className="content">

      <section className="page-container">

        {/* HEADER */}

        <header className="page-header catalog-header">

          <div className="catalog-heading">

            <span className="section-eyebrow">
              TIENDA ONLINE
            </span>

            <h1>
              Catálogo de productos
            </h1>

            <p>
              Explora nuestro catálogo y
              agrega productos a tu pedido.
            </p>

          </div>

          <div className="catalog-actions">

            {carrito.length > 0 && (
              <button
                type="button"
                className="primary-button"
                onClick={irAlPedido}
              >
                🛒 Ver pedido
                {" "}
                ({cantidadTotal})
              </button>
            )}

            <button
              type="button"
              className="secondary-button refresh-button"
              onClick={cargarProductos}
              disabled={cargando}
            >
              <span className="button-icon">
                ↻
              </span>

              {cargando
                ? "Actualizando..."
                : "Actualizar"}
            </button>

          </div>

        </header>

        {/* CARGANDO */}

        {cargando && (

          <div className="catalog-status">

            <div className="loading-spinner" />

            <div>

              <strong>
                Cargando productos
              </strong>

              <p>
                Estamos consultando el catálogo...
              </p>

            </div>

          </div>

        )}

        {/* ERROR */}

        {error && (

          <div className="catalog-error">

            <div className="status-icon">
              !
            </div>

            <div>

              <strong>
                No fue posible cargar el catálogo
              </strong>

              <p>
                {error}
              </p>

            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={cargarProductos}
            >
              Intentar nuevamente
            </button>

          </div>

        )}

        {/* VACÍO */}

        {!cargando &&
          !error &&
          productos.length === 0 && (

            <div className="catalog-empty">

              <div className="empty-icon">
                🛒
              </div>

              <h2>
                Catálogo vacío
              </h2>

              <p>
                Actualmente no existen productos
                registrados en la tienda.
              </p>

            </div>

          )}

        {/* PRODUCTOS */}

        {!cargando &&
          !error &&
          productos.length > 0 && (

            <section className="catalog-section">

              <div className="catalog-results-header">

                <div>

                  <h2>
                    Productos disponibles
                  </h2>

                  <p>
                    {productos.length}{" "}
                    {productos.length === 1
                      ? "producto disponible"
                      : "productos disponibles"}
                  </p>

                </div>

                {carrito.length > 0 && (

                  <button
                    type="button"
                    className="catalog-cart-button"
                    onClick={irAlPedido}
                  >
                    🛒
                    {" "}
                    {cantidadTotal}
                    {" "}
                    producto
                    {cantidadTotal !== 1
                      ? "s"
                      : ""}
                  </button>

                )}

              </div>

              <div className="product-grid">

                {productos.map(
                  (producto) => {

                    const sinStock =
                      producto.stock <= 0;

                    const cantidad =
                      cantidadEnCarrito(
                        producto.id
                      );

                    return (

                      <article
                        key={producto.id}
                        className="product-card"
                      >

                        {/* IMAGEN */}

                        <div className="product-image">

                          <span>
                            🛒
                          </span>

                          {sinStock && (
                            <span className="product-badge">
                              Agotado
                            </span>
                          )}

                          {!sinStock &&
                            cantidad > 0 && (
                              <span className="product-cart-badge">
                                🛒 {cantidad}
                              </span>
                            )}

                        </div>

                        {/* INFORMACIÓN */}

                        <div className="product-body">

                          <div className="product-category">
                            TECNOLOGÍA
                          </div>

                          <h3>
                            {producto.nombre}
                          </h3>

                          <p className="product-description">
                            {producto.descripcion ||
                              "Producto disponible en nuestro catálogo."}
                          </p>

                          <div className="product-price">

                            $
                            {Number(
                              producto.precio
                            ).toLocaleString(
                              "es-MX",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}

                          </div>

                          <div
                            className={
                              sinStock
                                ? "product-stock out"
                                : "product-stock"
                            }
                          >

                            <span className="stock-dot" />

                            {sinStock
                              ? "Producto agotado"
                              : `Disponible · ${producto.stock} unidades`}

                          </div>

                          {/* ACCIÓN */}

                          <button
                            type="button"
                            className="primary-button product-buy-button"
                            disabled={sinStock}
                            onClick={() =>
                              agregarAlCarrito(
                                producto
                              )
                            }
                          >

                            {sinStock
                              ? "Agotado"
                              : cantidad > 0
                                ? "Agregar otro"
                                : "Agregar al pedido"}

                            {!sinStock && (
                              <span>
                                +
                              </span>
                            )}

                          </button>

                          {cantidad > 0 && (
                            <button
                              type="button"
                              className="product-view-order"
                              onClick={irAlPedido}
                            >
                              Ver pedido →
                            </button>
                          )}

                        </div>

                      </article>

                    );
                  }
                )}

              </div>

            </section>

          )}

      </section>

    </main>
  );
}

export default ProductCatalogPage;