import {
  Pedido,
  PedidoProducto,
  EstadoPedido,
} from "../../domain/entities/Pedido.js";

import { PedidoRepository } from "../../application/ports/PedidoRepository.js";

import { query } from "../database/PostgresConnection.js";

interface PedidoRow {
  id: number;
  usuario_id: number;
  estado: EstadoPedido;
  total: string | number;
  creado_en: Date;
}

interface PedidoProductoRow {
  pedido_id: number;
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: string | number;
}

export class PedidoRepositoryPostgres
  implements PedidoRepository
{
  /**
   * Obtiene todos los productos asociados
   * a un pedido específico.
   */
  private async obtenerProductosPedido(
    pedidoId: number
  ): Promise<PedidoProducto[]> {
    const resultado =
      await query<PedidoProductoRow>(
        `
        SELECT
          pp.pedido_id,
          pp.producto_id,
          p.nombre AS nombre_producto,
          pp.cantidad,
          pp.precio_unitario
        FROM pedido_productos pp
        INNER JOIN productos p
          ON p.id = pp.producto_id
        WHERE pp.pedido_id = $1
        ORDER BY pp.producto_id ASC
        `,
        [pedidoId]
      );

    return resultado.rows.map(
      (row: PedidoProductoRow) => ({
        productoId: row.producto_id,
        nombreProducto: row.nombre_producto,
        cantidad: row.cantidad,
        precioUnitario: Number(
          row.precio_unitario
        ),
      })
    );
  }

  /**
   * Convierte una fila de PostgreSQL
   * en una entidad de dominio Pedido.
   */
  private async mapearPedido(
    row: PedidoRow
  ): Promise<Pedido> {
    const productos =
      await this.obtenerProductosPedido(
        row.id
      );

    return new Pedido({
      id: row.id,
      usuarioId: row.usuario_id,
      productos,
      estado: row.estado,
      total: Number(row.total),
      creadoEn: row.creado_en,
    });
  }

  /**
   * Crea un pedido y sus productos asociados.
   */
  async crear(
    pedido: Pedido
  ): Promise<Pedido> {
    const pedidoResult =
      await query<PedidoRow>(
        `
        INSERT INTO pedidos
          (
            usuario_id,
            estado,
            total
          )
        VALUES
          ($1, $2, $3)
        RETURNING
          id,
          usuario_id,
          estado,
          total,
          creado_en
        `,
        [
          pedido.usuarioId,
          pedido.estado,
          pedido.total,
        ]
      );

    const pedidoCreado =
      pedidoResult.rows[0];

    if (!pedidoCreado) {
      throw new Error(
        "No fue posible crear el pedido"
      );
    }

    for (const producto of pedido.productos) {
      await query(
        `
        INSERT INTO pedido_productos
          (
            pedido_id,
            producto_id,
            cantidad,
            precio_unitario
          )
        VALUES
          ($1, $2, $3, $4)
        `,
        [
          pedidoCreado.id,
          producto.productoId,
          producto.cantidad,
          producto.precioUnitario,
        ]
      );
    }

    return this.mapearPedido(
      pedidoCreado
    );
  }

  /**
   * Obtiene todos los pedidos.
   */
  async obtenerTodos(): Promise<Pedido[]> {
    const resultado =
      await query<PedidoRow>(
        `
        SELECT
          id,
          usuario_id,
          estado,
          total,
          creado_en
        FROM pedidos
        ORDER BY id DESC
        `
      );

    const pedidos: Pedido[] = [];

    for (const row of resultado.rows) {
      pedidos.push(
        await this.mapearPedido(row)
      );
    }

    return pedidos;
  }

  /**
   * Obtiene un pedido por su ID.
   */
  async obtenerPorId(
    id: number
  ): Promise<Pedido | null> {
    const resultado =
      await query<PedidoRow>(
        `
        SELECT
          id,
          usuario_id,
          estado,
          total,
          creado_en
        FROM pedidos
        WHERE id = $1
        `,
        [id]
      );

    if (resultado.rows.length === 0) {
      return null;
    }

    return this.mapearPedido(
      resultado.rows[0]
    );
  }

  /**
   * Obtiene todos los pedidos
   * pertenecientes a un usuario.
   */
  async obtenerPorUsuario(
    usuarioId: number
  ): Promise<Pedido[]> {
    const resultado =
      await query<PedidoRow>(
        `
        SELECT
          id,
          usuario_id,
          estado,
          total,
          creado_en
        FROM pedidos
        WHERE usuario_id = $1
        ORDER BY id DESC
        `,
        [usuarioId]
      );

    const pedidos: Pedido[] = [];

    for (const row of resultado.rows) {
      pedidos.push(
        await this.mapearPedido(row)
      );
    }

    return pedidos;
  }

  /**
   * Actualiza el estado y total
   * de un pedido.
   */
  async actualizar(
    pedido: Pedido
  ): Promise<Pedido> {
    const resultado =
      await query<PedidoRow>(
        `
        UPDATE pedidos
        SET
          estado = $1,
          total = $2
        WHERE id = $3
        RETURNING
          id,
          usuario_id,
          estado,
          total,
          creado_en
        `,
        [
          pedido.estado,
          pedido.total,
          pedido.id,
        ]
      );

    if (resultado.rows.length === 0) {
      throw new Error(
        "Pedido no encontrado"
      );
    }

    return this.mapearPedido(
      resultado.rows[0]
    );
  }

  /**
   * Elimina un pedido por su ID.
   */
  async eliminar(
    id: number
  ): Promise<void> {
    const resultado = await query(
      `
      DELETE FROM pedidos
      WHERE id = $1
      `,
      [id]
    );

    if (resultado.rowCount === 0) {
      throw new Error(
        "Pedido no encontrado"
      );
    }
  }
}