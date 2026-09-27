import { Producto } from "../../domain/entities/Producto.js";

export interface ProductoRepository {
  crear(producto: Producto): Promise<Producto>;

  obtenerTodos(): Promise<Producto[]>;

  obtenerPorId(id: number): Promise<Producto | null>;

  actualizar(producto: Producto): Promise<Producto>;

  eliminar(id: number): Promise<void>;
}
