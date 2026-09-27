export type RolUsuario = "CLIENTE" | "ADMIN";

export interface UsuarioProps {
  id?: number;
  nombre: string;
  email: string;
  passwordHash: string;
  rol?: RolUsuario;
  creadoEn?: Date;
}

export class Usuario {
  public readonly id?: number;
  public nombre: string;
  public email: string;
  public passwordHash: string;
  public rol: RolUsuario;
  public readonly creadoEn?: Date;

  constructor(props: UsuarioProps) {
    if (!props.nombre || props.nombre.trim().length < 2) {
      throw new Error("El nombre debe tener al menos 2 caracteres");
    }

    if (!props.email || !Usuario.esEmailValido(props.email)) {
      throw new Error("El correo electrónico no es válido");
    }

    if (!props.passwordHash || props.passwordHash.trim().length === 0) {
      throw new Error("La contraseña protegida es obligatoria");
    }

    this.id = props.id;
    this.nombre = props.nombre.trim();
    this.email = props.email.trim().toLowerCase();
    this.passwordHash = props.passwordHash;
    this.rol = props.rol ?? "CLIENTE";
    this.creadoEn = props.creadoEn;
  }

  private static esEmailValido(email: string): boolean {
    const expresion =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresion.test(email);
  }

  public cambiarNombre(nombre: string): void {
    if (!nombre || nombre.trim().length < 2) {
      throw new Error(
        "El nombre debe tener al menos 2 caracteres"
      );
    }

    this.nombre = nombre.trim();
  }

  public cambiarEmail(email: string): void {
    if (!email || !Usuario.esEmailValido(email)) {
      throw new Error("El correo electrónico no es válido");
    }

    this.email = email.trim().toLowerCase();
  }

  public cambiarRol(rol: RolUsuario): void {
    this.rol = rol;
  }
}
