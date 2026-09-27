export type EstadoPedido =
  | "PENDIENTE"
  | "PAGADO"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO";

export interface PedidoProducto {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
}

export interface PedidoProps {
  id?: number;
  usuarioId: number;
  productos: PedidoProducto[];
  estado?: EstadoPedido;
  total?: number;
  creadoEn?: Date;
}

export class Pedido {
  public readonly id?: number;
  public readonly usuarioId: number;
  public productos: PedidoProducto[];
  public estado: EstadoPedido;
  public total: number;
  public readonly creadoEn?: Date;

  constructor(props: PedidoProps) {
    if (!Number.isInteger(props.usuarioId) || props.usuarioId <= 0) {
      throw new Error("El usuario del pedido no es válido");
    }

    if (!props.productos || props.productos.length === 0) {
      throw new Error(
        "El pedido debe contener al menos un producto"
      );
    }

    this.id = props.id;
    this.usuarioId = props.usuarioId;
    this.productos = props.productos;
    this.estado = props.estado ?? "PENDIENTE";
    this.total = this.calcularTotal();
    this.creadoEn = props.creadoEn;
  }

  private calcularTotal(): number {
    const total = this.productos.reduce(
      (acumulado, producto) => {
        if (
          !Number.isInteger(producto.cantidad) ||
          producto.cantidad <= 0
        ) {
          throw new Error(
            "La cantidad de productos debe ser mayor a 0"
          );
        }

        if (producto.precioUnitario < 0) {
          throw new Error(
            "El precio unitario no puede ser negativo"
          );
        }

        return (
          acumulado +
          producto.precioUnitario * producto.cantidad
        );
      },
      0
    );

    return Number(total.toFixed(2));
  }

  public recalcularTotal(): void {
    this.total = this.calcularTotal();
  }

  public cambiarEstado(estado: EstadoPedido): void {
    this.estado = estado;
  }

  public agregarProducto(producto: PedidoProducto): void {
    if (producto.cantidad <= 0) {
      throw new Error(
        "La cantidad debe ser mayor a 0"
      );
    }

    this.productos.push(producto);

    this.recalcularTotal();
  }

  public eliminarProducto(productoId: number): void {
    const productosRestantes =
      this.productos.filter(
        producto =>
          producto.productoId !== productoId
      );

    if (
      productosRestantes.length ===
      this.productos.length
    ) {
      throw new Error(
        "El producto no se encuentra en el pedido"
      );
    }

    if (productosRestantes.length === 0) {
      throw new Error(
        "El pedido debe contener al menos un producto"
      );
    }

    this.productos = productosRestantes;

    this.recalcularTotal();
  }
}
