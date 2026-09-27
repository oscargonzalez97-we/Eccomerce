import { Producto } from "../../domain/entities/Producto.js";

import { ProductoRepository } from "../../application/ports/ProductoRepository.js";

import { query } from "../database/PostgresConnection.js";

interface ProductoRow {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: string | number;
  stock: number;
  creado_en: Date;
}

export class ProductoRepositoryPostgres
  implements ProductoRepository
{
  private mapearProducto(
    row: ProductoRow
  ): Producto {
    return new Producto({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion ?? "",
      precio: Number(row.precio),
      stock: row.stock,
      creadoEn: row.creado_en,
    });
  }

  async crear(
    producto: Producto
  ): Promise<Producto> {
    const resultado = await query<ProductoRow>(
      `
      INSERT INTO productos
        (nombre, descripcion, precio, stock)
      VALUES
        ($1, $2, $3, $4)
      RETURNING
        id,
        nombre,
        descripcion,
        precio,
        stock,
        creado_en
      `,
      [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.stock,
      ]
    );

    return this.mapearProducto(
      resultado.rows[0]
    );
  }

  async obtenerTodos(): Promise<Producto[]> {
    const resultado = await query<ProductoRow>(
      `
      SELECT
        id,
        nombre,
        descripcion,
        precio,
        stock,
        creado_en
      FROM productos
      ORDER BY id ASC
      `
    );

    return resultado.rows.map(
      (row: ProductoRow) => this.mapearProducto(row)
    );
  }

  async obtenerPorId(
    id: number
  ): Promise<Producto | null> {
    const resultado = await query<ProductoRow>(
      `
      SELECT
        id,
        nombre,
        descripcion,
        precio,
        stock,
        creado_en
      FROM productos
      WHERE id = $1
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return null;
    }

    return this.mapearProducto(
      resultado.rows[0]
    );
  }

  async actualizar(
    producto: Producto
  ): Promise<Producto> {
    const resultado = await query<ProductoRow>(
      `
      UPDATE productos
      SET
        nombre = $1,
        descripcion = $2,
        precio = $3,
        stock = $4
      WHERE id = $5
      RETURNING
        id,
        nombre,
        descripcion,
        precio,
        stock,
        creado_en
      `,
      [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.stock,
        producto.id,
      ]
    );

    if (resultado.rows.length === 0) {
      throw new Error("Producto no encontrado");
    }

    return this.mapearProducto(
      resultado.rows[0]
    );
  }

  async eliminar(id: number): Promise<void> {
    const resultado = await query(
      `
      DELETE FROM productos
      WHERE id = $1
      `,
      [id]
    );

    if (resultado.rowCount === 0) {
      throw new Error("Producto no encontrado");
    }
  }
}
