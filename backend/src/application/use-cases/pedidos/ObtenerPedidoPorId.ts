import { Pedido } from "../../../domain/entities/Pedido.js";
import { PedidoRepository } from "../../ports/PedidoRepository.js";

export class ObtenerPedidoPorId {
  constructor(
    private readonly pedidoRepository: PedidoRepository
  ) {}

  async execute(id: number): Promise<Pedido> {
    const pedido =
      await this.pedidoRepository.obtenerPorId(id);

    if (!pedido) {
      throw new Error("Pedido no encontrado");
    }

    return pedido;
  }
}
