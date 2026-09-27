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

export interface Pedido {
  id: number;
  usuarioId: number;
  productos: PedidoProducto[];
  estado: EstadoPedido;
  total: number;
  creadoEn?: string;
}

export interface CrearPedidoProductoRequest {
  productoId: number;
  cantidad: number;
}

export interface CrearPedidoRequest {
  usuarioId: number;
  productos: CrearPedidoProductoRequest[];
}

export interface ActualizarPedidoRequest {
  estado: EstadoPedido;
}
