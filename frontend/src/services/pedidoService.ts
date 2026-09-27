import api from "./api";

import type {
  Pedido,
  CrearPedidoRequest,
  ActualizarPedidoRequest,
} from "../types/pedido";

export const pedidoService = {
  async obtenerPedidos(): Promise<Pedido[]> {
    const response =
      await api.get<Pedido[]>(
        "/pedidos"
      );

    return response.data;
  },

  async obtenerPedido(
    id: number
  ): Promise<Pedido> {
    const response =
      await api.get<Pedido>(
        `/pedidos/${id}`
      );

    return response.data;
  },

  async obtenerPedidosUsuario(
    usuarioId: number
  ): Promise<Pedido[]> {
    const response =
      await api.get<Pedido[]>(
        `/pedidos/usuario/${usuarioId}`
      );

    return response.data;
  },

  async crearPedido(
    datos: CrearPedidoRequest
  ): Promise<Pedido> {
    const response =
      await api.post<Pedido>(
        "/pedidos",
        datos
      );

    return response.data;
  },

  async actualizarPedido(
    id: number,
    datos: ActualizarPedidoRequest
  ): Promise<Pedido> {
    const response =
      await api.put<Pedido>(
        `/pedidos/${id}`,
        datos
      );

    return response.data;
  },

  async eliminarPedido(
    id: number
  ): Promise<void> {
    await api.delete(
      `/pedidos/${id}`
    );
  },
};
