import { Pedido } from "../../../domain/entities/Pedido.js";
import { PedidoRepository } from "../../ports/PedidoRepository.js";

export class ObtenerPedidos {
  constructor(
    private readonly pedidoRepository: PedidoRepository
  ) {}

  async execute(): Promise<Pedido[]> {
    return this.pedidoRepository.obtenerTodos();
  }
}
