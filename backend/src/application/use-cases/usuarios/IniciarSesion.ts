import {
  UsuarioRepository,
} from "../../ports/UsuarioRepository.js";

import {
  PasswordHasher,
} from "../../ports/PasswordHasher.js";

export interface IniciarSesionRequest {
  email: string;
  password: string;
}

export interface IniciarSesionResponse {
  id: number;
  nombre: string;
  email: string;
  rol: "CLIENTE" | "ADMIN";
  creadoEn?: Date;
}

export class IniciarSesion {

  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

    async execute(
      datos: IniciarSesionRequest
    ): Promise<IniciarSesionResponse> {

    const email =
      datos.email.trim().toLowerCase();

    if (!email) {
      throw new Error(
        "El correo electrónico es obligatorio"
      );
    }

    if (!datos.password) {
      throw new Error(
        "La contraseña es obligatoria"
      );
    }

    const usuario =
      await this.usuarioRepository.obtenerPorEmail(
        email
      );

    if (!usuario) {
      throw new Error(
        "Correo o contraseña incorrectos"
      );
    }

    const passwordCorrecta =
      await this.passwordHasher.compare(
        datos.password,
        usuario.passwordHash
      );

    if (!passwordCorrecta) {
      throw new Error(
        "Correo o contraseña incorrectos"
      );
    }

    return {
      id: usuario.id!,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      creadoEn: usuario.creadoEn,
    };
  }
}
