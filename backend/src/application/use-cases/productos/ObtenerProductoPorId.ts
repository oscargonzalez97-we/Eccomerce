import { Producto } from "../../../domain/entities/Producto.js";
import { ProductoRepository } from "../../ports/ProductoRepository.js";

export class ObtenerProductoPorId {
  constructor(
    private readonly productoRepository: ProductoRepository
  ) {}

  async execute(id: number): Promise<Producto> {
    const producto =
      await this.productoRepository.obtenerPorId(id);

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    return producto;
  }
}
