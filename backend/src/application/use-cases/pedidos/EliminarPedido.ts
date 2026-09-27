import { PedidoRepository } from "../../ports/PedidoRepository.js";

export class EliminarPedido {
  constructor(
    private readonly pedidoRepository: PedidoRepository
  ) {}

  async execute(id: number): Promise<void> {
    const pedido =
      await this.pedidoRepository.obtenerPorId(id);

    if (!pedido) {
      throw new Error("Pedido no encontrado");
    }

    await this.pedidoRepository.eliminar(id);
  }
}
