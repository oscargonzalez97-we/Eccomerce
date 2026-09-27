import { Producto } from "../../../domain/entities/Producto.js";
import { ProductoRepository } from "../../ports/ProductoRepository.js";

export interface ActualizarProductoInput {
  id: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
}

export class ActualizarProducto {
  constructor(
    private readonly productoRepository: ProductoRepository
  ) {}

  async execute(
    input: ActualizarProductoInput
  ): Promise<Producto> {
    const producto =
      await this.productoRepository.obtenerPorId(
        input.id
      );

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    if (input.nombre !== undefined) {
      if (input.nombre.trim().length < 2) {
        throw new Error(
          "El nombre debe tener al menos 2 caracteres"
        );
      }

      producto.nombre = input.nombre.trim();
    }

    if (input.descripcion !== undefined) {
      producto.descripcion =
        input.descripcion.trim();
    }

    if (input.precio !== undefined) {
      producto.actualizarPrecio(input.precio);
    }

    if (input.stock !== undefined) {
      if (
        !Number.isInteger(input.stock) ||
        input.stock < 0
      ) {
        throw new Error(
          "El stock debe ser un entero mayor o igual a 0"
        );
      }

      producto.stock = input.stock;
    }

    return this.productoRepository.actualizar(
      producto
    );
  }
}
