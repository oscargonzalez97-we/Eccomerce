import { Producto } from "../../../domain/entities/Producto.js";
import { ProductoRepository } from "../../ports/ProductoRepository.js";

export class ObtenerProductos {
  constructor(
    private readonly productoRepository: ProductoRepository
  ) {}

  async execute(): Promise<Producto[]> {
    return this.productoRepository.obtenerTodos();
  }
}
