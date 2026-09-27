import { ProductoRepository } from "../../ports/ProductoRepository.js";

export class EliminarProducto {
  constructor(
    private readonly productoRepository: ProductoRepository
  ) {}

  async execute(id: number): Promise<void> {
    const producto =
      await this.productoRepository.obtenerPorId(id);

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    await this.productoRepository.eliminar(id);
  }
}
