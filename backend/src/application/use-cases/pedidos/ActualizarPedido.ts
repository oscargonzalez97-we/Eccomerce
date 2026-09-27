import {
  EstadoPedido,
  Pedido,
} from "../../../domain/entities/Pedido.js";

import { PedidoRepository } from "../../ports/PedidoRepository.js";

export interface ActualizarPedidoInput {
  id: number;
  estado?: EstadoPedido;
}

export class ActualizarPedido {
  constructor(
    private readonly pedidoRepository: PedidoRepository
  ) {}

  async execute(
    input: ActualizarPedidoInput
  ): Promise<Pedido> {
    const pedido =
      await this.pedidoRepository.obtenerPorId(
        input.id
      );

    if (!pedido) {
      throw new Error("Pedido no encontrado");
    }

    if (input.estado) {
      pedido.cambiarEstado(input.estado);
    }

    return this.pedidoRepository.actualizar(
      pedido
    );
  }
}
