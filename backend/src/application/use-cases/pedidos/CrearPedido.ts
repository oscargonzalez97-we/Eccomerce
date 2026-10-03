import {
  Pedido,
  PedidoProducto,
} from "../../../domain/entities/Pedido.js";

import { PedidoRepository } from "../../ports/PedidoRepository.js";
import { ProductoRepository } from "../../ports/ProductoRepository.js";
import { UsuarioRepository } from "../../ports/UsuarioRepository.js";

import { EmailNotifier } from "../../ports/EmailNotifier.js";

export interface CrearPedidoProductoInput {
  productoId: number;
  cantidad: number;
}

export interface CrearPedidoInput {
  usuarioId: number;
  productos: CrearPedidoProductoInput[];
}

export class CrearPedido {
  constructor(
    private readonly pedidoRepository: PedidoRepository,
    private readonly productoRepository: ProductoRepository,
    private readonly usuarioRepository: UsuarioRepository,
    private readonly emailNotifier: EmailNotifier
  ) {}

  async execute(
    input: CrearPedidoInput
  ): Promise<Pedido> {
    /*
     * 1. Comprobar que el usuario existe
     */
    const usuario =
      await this.usuarioRepository.obtenerPorId(
        input.usuarioId
      );

    if (!usuario) {
      throw new Error("El usuario no existe");
    }

    /*
     * 2. Validar que exista al menos un producto
     */
    if (
      !input.productos ||
      input.productos.length === 0
    ) {
      throw new Error(
        "El pedido debe contener al menos un producto"
      );
    }

    const productosPedido: PedidoProducto[] = [];

    /*
     * 3. Buscar cada producto y comprobar stock
     */
    for (const item of input.productos) {
      if (
        !Number.isInteger(item.cantidad) ||
        item.cantidad <= 0
      ) {
        throw new Error(
          "La cantidad de cada producto debe ser mayor a 0"
        );
      }

      const producto =
        await this.productoRepository.obtenerPorId(
          item.productoId
        );

      if (!producto) {
        throw new Error(
          `El producto ${item.productoId} no existe`
        );
      }

      if (producto.stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}`
        );
      }

      productosPedido.push({
        productoId: producto.id!,
        nombreProducto: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
      });
    }

    /*
     * 4. Crear entidad Pedido
     *
     * La entidad calcula automáticamente
     * el monto total.
     */
    const pedido = new Pedido({
      usuarioId: input.usuarioId,
      productos: productosPedido,
    });

    /*
     * 5. Descontar stock
     */
    for (const item of input.productos) {
      const producto =
        await this.productoRepository.obtenerPorId(
          item.productoId
        );

      if (!producto) {
        throw new Error(
          `El producto ${item.productoId} no existe`
        );
      }

      producto.reducirStock(item.cantidad);

      await this.productoRepository.actualizar(
        producto
      );
    }

    /*
 * 6. Guardar el pedido
 */
  const pedidoCreado =
    await this.pedidoRepository.crear(pedido);
    
  /*
   * 7. Enviar notificaciones
   */
  await this.emailNotifier.enviarConfirmacionPedido(
    usuario,
    pedidoCreado
  );
  
  await this.emailNotifier.enviarNotificacionAdministrador(
    usuario,
    pedidoCreado
  );
  
  return pedidoCreado;
  }
}
