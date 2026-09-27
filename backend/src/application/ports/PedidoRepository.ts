import { Pedido } from "../../domain/entities/Pedido.js";

export interface PedidoRepository {
  crear(pedido: Pedido): Promise<Pedido>;

  obtenerTodos(): Promise<Pedido[]>;

  obtenerPorId(id: number): Promise<Pedido | null>;

  obtenerPorUsuario(
    usuarioId: number
  ): Promise<Pedido[]>;

  actualizar(pedido: Pedido): Promise<Pedido>;

  eliminar(id: number): Promise<void>;
}

