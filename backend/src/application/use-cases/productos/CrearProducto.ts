import { Producto } from "../../../domain/entities/Producto.js";
import { ProductoRepository } from "../../ports/ProductoRepository.js";

export interface CrearProductoInput {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
}

export class CrearProducto {
  constructor(
    private readonly productoRepository: ProductoRepository
  ) {}

  async execute(
    input: CrearProductoInput
  ): Promise<Producto> {
    const producto = new Producto({
      nombre: input.nombre,
      descripcion: input.descripcion,
      precio: input.precio,
      stock: input.stock,
    });

    return this.productoRepository.crear(producto);
  }
}
