export interface ProductoProps {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  creadoEn?: Date;
}

export class Producto {
  public readonly id?: number;
  public nombre: string;
  public descripcion: string;
  public precio: number;
  public stock: number;
  public readonly creadoEn?: Date;

  constructor(props: ProductoProps) {
    if (!props.nombre || props.nombre.trim().length < 2) {
      throw new Error(
        "El nombre del producto debe tener al menos 2 caracteres"
      );
    }

    if (props.precio < 0) {
      throw new Error(
        "El precio del producto no puede ser negativo"
      );
    }

    if (!Number.isInteger(props.stock) || props.stock < 0) {
      throw new Error(
        "El stock debe ser un número entero mayor o igual a 0"
      );
    }

    this.id = props.id;
    this.nombre = props.nombre.trim();
    this.descripcion = props.descripcion?.trim() ?? "";
    this.precio = Number(props.precio.toFixed(2));
    this.stock = props.stock;
    this.creadoEn = props.creadoEn;
  }

  public aumentarStock(cantidad: number): void {
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error(
        "La cantidad a agregar debe ser un entero positivo"
      );
    }

    this.stock += cantidad;
  }

  public reducirStock(cantidad: number): void {
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error(
        "La cantidad a reducir debe ser un entero positivo"
      );
    }

    if (cantidad > this.stock) {
      throw new Error(
        `Stock insuficiente para el producto ${this.nombre}`
      );
    }

    this.stock -= cantidad;
  }

  public actualizarPrecio(precio: number): void {
    if (precio < 0) {
      throw new Error(
        "El precio no puede ser negativo"
      );
    }

    this.precio = Number(precio.toFixed(2));
  }
}
