export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  creadoEn?: string;
}

export interface CrearProductoRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
}

export interface ActualizarProductoRequest {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
}
