import api from "./api";

import type {
  Producto,
  CrearProductoRequest,
  ActualizarProductoRequest,
} from "../types/producto";

export const productoService = {
  async obtenerProductos(): Promise<Producto[]> {
    const response =
      await api.get<Producto[]>(
        "/productos"
      );

    return response.data;
  },

  async obtenerProducto(
    id: number
  ): Promise<Producto> {
    const response =
      await api.get<Producto>(
        `/productos/${id}`
      );

    return response.data;
  },

  async crearProducto(
    datos: CrearProductoRequest
  ): Promise<Producto> {
    const response =
      await api.post<Producto>(
        "/productos",
        datos
      );

    return response.data;
  },

  async actualizarProducto(
    id: number,
    datos: ActualizarProductoRequest
  ): Promise<Producto> {
    const response =
      await api.put<Producto>(
        `/productos/${id}`,
        datos
      );

    return response.data;
  },

  async eliminarProducto(
    id: number
  ): Promise<void> {
    await api.delete(
      `/productos/${id}`
    );
  },
};
