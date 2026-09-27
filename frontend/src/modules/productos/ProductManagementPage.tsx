import {
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

import { productoService } from "../../services/productoService";

import type { Producto } from "../../types/producto";

function ProductManagementPage() {

  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [nombre, setNombre] =
    useState("");

  const [descripcion, setDescripcion] =
    useState("");

  const [precio, setPrecio] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [mensaje, setMensaje] =
    useState("");

  const [error, setError] =
    useState("");

  async function cargarProductos() {

    const datos =
      await productoService.obtenerProductos();

    setProductos(datos);

  }

  useEffect(() => {

    cargarProductos().catch(() => {
      setError(
        "No fue posible cargar los productos."
      );
    });

  }, []);

  function limpiarFormulario() {

    setNombre("");
    setDescripcion("");
    setPrecio("");
    setStock("");
    setEditandoId(null);

  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setMensaje("");
    setError("");

    try {

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

    }
  }

  function editarProducto(
    producto: Producto
  ) {

    setEditandoId(producto.id);

    setNombre(producto.nombre);

    setDescripcion(
      producto.descripcion
    );

    setPrecio(
      String(producto.precio)
    );

    setStock(
      String(producto.stock)
    );

  }

  async function eliminarProducto(
    id: number
  ) {

    const confirmar =
      window.confirm(
        "¿Deseas eliminar este producto?"
      );

    if (!confirmar) {
      return;
    }

    try {

      await productoService.eliminarProducto(
        id
      );

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

  return (
    <section className="page">

      <h1>
        Gestión de productos
      </h1>

      <div className="management-layout">

        <div className="form-container">

          <h2>

            {editandoId === null
              ? "Nuevo producto"
              : "Editar producto"}

          </h2>

          <form
            onSubmit={handleSubmit}
            className="form"
          >

            <label>

              Nombre

              <input
                type="text"
                value={nombre}
                onChange={(event) =>
                  setNombre(
                    event.target.value
                  )
                }
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
              />

            </label>

            <label>

              Precio

              <input
                type="number"
                value={precio}
                onChange={(event) =>
                  setPrecio(
                    event.target.value
                  )
                }
                min="0"
                step="0.01"
                required
              />

            </label>

            <label>

              Stock

              <input
                type="number"
                value={stock}
                onChange={(event) =>
                  setStock(
                    event.target.value
                  )
                }
                min="0"
                step="1"
                required
              />

            </label>

            <div className="form-actions">

              <button type="submit">

                {editandoId === null
                  ? "Crear producto"
                  : "Guardar cambios"}

              </button>

              {editandoId !== null && (

                <button
                  type="button"
                  className="secondary"
                  onClick={
                    limpiarFormulario
                  }
                >
                  Cancelar
                </button>

              )}

            </div>

          </form>

          {mensaje && (
            <div className="success">
              {mensaje}
            </div>
          )}

          {error && (
            <div className="error">
              {error}
            </div>
          )}

        </div>

        <div>

          <h2>
            Productos registrados
          </h2>

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
                      $
                      {producto.precio.toFixed(
                        2
                      )}
                      {" · "}
                      Stock:
                      {" "}
                      {producto.stock}
                    </p>

                  </div>

                  <div className="item-actions">

                    <button
                      onClick={() =>
                        editarProducto(
                          producto
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
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

        </div>

      </div>

    </section>
  );
}

export default ProductManagementPage;
