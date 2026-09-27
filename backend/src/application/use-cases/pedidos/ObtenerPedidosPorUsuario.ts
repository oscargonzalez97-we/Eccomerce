import { Pedido } from "../../../domain/entities/Pedido.js";
import { PedidoRepository } from "../../ports/PedidoRepository.js";

export class ObtenerPedidosPorUsuario {
  constructor(
    private readonly pedidoRepository: PedidoRepository
  ) {}

  async execute(usuarioId: number): Promise<Pedido[]> {
    return this.pedidoRepository.obtenerPorUsuario(
      usuarioId
    );
  }
}
