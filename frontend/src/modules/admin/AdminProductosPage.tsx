import { useEffect, useState } from "react";

import { productoService } from "../../services/productoService";

import type { Producto } from "../../types/producto";

function AdminProductosPage() {
  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  const [error, setError] =
    useState("");

  async function cargarProductos() {
    try {
      setCargando(true);
      setError("");

      const datos =
        await productoService.obtenerProductos();

      setProductos(datos);
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible cargar los productos."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  function limpiarFormulario() {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setStock("");
    setEditandoId(null);
    setMensaje("");
    setError("");
  }

  function editarProducto(
    producto: Producto
  ) {
    setEditandoId(producto.id);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecio(String(producto.precio));
    setStock(String(producto.stock));

    setMensaje("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function guardarProducto(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setGuardando(true);
      setMensaje("");
      setError("");

      const datos = {
        nombre,
        descripcion,
        precio: Number(precio),
        stock: Number(stock),
      };

      if (editandoId === null) {
        await productoService.crearProducto(
          datos
        );

        setMensaje(
          "Producto creado correctamente."
        );
      } else {
        await productoService.actualizarProducto(
          editandoId,
          datos
        );

        setMensaje(
          "Producto actualizado correctamente."
        );
      }

      limpiarFormulario();
      await cargarProductos();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible guardar el producto."
      );
    } finally {
      setGuardando(false);
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
      setMensaje("");
      setError("");

      await productoService.eliminarProducto(id);

      setMensaje(
        "Producto eliminado correctamente."
      );

      await cargarProductos();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible eliminar el producto."
      );
    }
  }

  const stockTotal = productos.reduce(
    (total, producto) =>
      total + producto.stock,
    0
  );

  return (
    <section className="admin-page">

      {/* HEADER */}

      <div className="admin-page-header">

        <div>
          <span className="admin-label">
            ADMINISTRACIÓN
          </span>

          <h1>
            Productos
          </h1>

          <p>
            Administra el catálogo, precios e
            inventario de la tienda.
          </p>
        </div>

        <div className="admin-header-actions">

          <button
            className="admin-button secondary"
            onClick={cargarProductos}
          >
            ↻ Actualizar
          </button>

          <button
            className="admin-button primary"
            onClick={limpiarFormulario}
          >
            + Nuevo producto
          </button>

        </div>

      </div>

      {/* MENSAJES */}

      {mensaje && (
        <div className="admin-alert success">
          ✓ {mensaje}
        </div>
      )}

      {error && (
        <div className="admin-alert error">
          {error}
        </div>
      )}

      {/* RESUMEN */}

      <div className="admin-product-stats">

        <div className="admin-product-stat">

          <div className="admin-product-stat-icon">
            🛒
          </div>

          <div>
            <span>
              Productos
            </span>

            <strong>
              {productos.length}
            </strong>
          </div>

        </div>

        <div className="admin-product-stat">

          <div className="admin-product-stat-icon">
            📦
          </div>

          <div>
            <span>
              Unidades en inventario
            </span>

            <strong>
              {stockTotal}
            </strong>
          </div>

        </div>

        <div className="admin-product-stat">

          <div className="admin-product-stat-icon">
            💰
          </div>

          <div>
            <span>
              Precio promedio
            </span>

            <strong>
              $
              {productos.length > 0
                ? (
                    productos.reduce(
                      (total, producto) =>
                        total +
                        producto.precio,
                      0
                    ) /
                    productos.length
                  ).toFixed(2)
                : "0.00"}
            </strong>
          </div>

        </div>

      </div>

      {/* CONTENIDO */}

      <div className="admin-two-columns">

        {/* FORMULARIO */}

        <section className="admin-form-card">

          <div className="admin-card-header">

            <div>

              <span className="admin-label">
                {editandoId === null
                  ? "NUEVO REGISTRO"
                  : "EDITANDO"}
              </span>

              <h2>
                {editandoId === null
                  ? "Crear producto"
                  : "Editar producto"}
              </h2>

            </div>

            {editandoId !== null && (
              <button
                className="admin-close-button"
                onClick={limpiarFormulario}
              >
                ×
              </button>
            )}

          </div>

          <form
            className="admin-form"
            onSubmit={guardarProducto}
          >

            <label>
              Nombre del producto

              <input
                type="text"
                value={nombre}
                onChange={(event) =>
                  setNombre(event.target.value)
                }
                placeholder="Ej. Laptop Lenovo"
                required
                minLength={2}
              />
            </label>

            <label>
              Descripción

              <textarea
                value={descripcion}
                onChange={(event) =>
                  setDescripcion(
                    event.target.value
                  )
                }
                placeholder="Describe el producto..."
                rows={4}
              />
            </label>

            <label>
              Precio

              <div className="admin-input-prefix">
                <span>$</span>

                <input
                  type="number"
                  value={precio}
                  onChange={(event) =>
                    setPrecio(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </label>

            <label>
              Stock disponible

              <input
                type="number"
                value={stock}
                onChange={(event) =>
                  setStock(
                    event.target.value
                  )
                }
                placeholder="0"
                min="0"
                step="1"
                required
              />
            </label>

            <div className="admin-form-actions">

              <button
                type="submit"
                className="admin-button primary full"
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : editandoId === null
                    ? "Crear producto"
                    : "Guardar cambios"}
              </button>

              {editandoId !== null && (
                <button
                  type="button"
                  className="admin-button secondary full"
                  onClick={limpiarFormulario}
                >
                  Cancelar edición
                </button>
              )}

            </div>

          </form>

        </section>

        {/* LISTADO */}

        <section className="admin-list-card">

          <div className="admin-card-header">

            <div>
              <span className="admin-label">
                CATÁLOGO
              </span>

              <h2>
                Productos registrados
              </h2>
            </div>

            <span className="admin-count">
              {productos.length}
            </span>

          </div>

          {cargando ? (

            <div className="admin-loading">
              Cargando productos...
            </div>

          ) : productos.length === 0 ? (

            <div className="admin-empty">

              <div>
                🛒
              </div>

              <h3>
                No hay productos
              </h3>

              <p>
                Crea el primer producto desde
                el formulario.
              </p>

            </div>

          ) : (

            <div className="admin-product-list">

              {productos.map(
                (producto) => (

                  <article
                    className="admin-product-item"
                    key={producto.id}
                  >

                    <div className="admin-product-image">
                      🛒
                    </div>

                    <div className="admin-product-info">

                      <div className="admin-product-title">

                        <strong>
                          {producto.nombre}
                        </strong>

                        <span>
                          #{producto.id}
                        </span>

                      </div>

                      <p>
                        {producto.descripcion ||
                          "Sin descripción"}
                      </p>

                      <div className="admin-product-meta">

                        <strong>
                          $
                          {producto.precio.toFixed(
                            2
                          )}
                        </strong>

                        <span
                          className={
                            producto.stock === 0
                              ? "stock-badge empty"
                              : producto.stock <= 5
                                ? "stock-badge low"
                                : "stock-badge"
                          }
                        >
                          {producto.stock === 0
                            ? "Sin stock"
                            : producto.stock <= 5
                              ? `Stock bajo · ${producto.stock}`
                              : `Stock · ${producto.stock}`}
                        </span>

                      </div>

                    </div>

                    <div className="admin-item-actions">

                      <button
                        className="admin-icon-button edit"
                        onClick={() =>
                          editarProducto(
                            producto
                          )
                        }
                        title="Editar producto"
                      >
                        ✎
                      </button>

                      <button
                        className="admin-icon-button delete"
                        onClick={() =>
                          eliminarProducto(
                            producto.id
                          )
                        }
                        title="Eliminar producto"
                      >
                        🗑
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </section>
  );
}

export default AdminProductosPage;