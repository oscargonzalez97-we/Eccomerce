import {
  Usuario,
  RolUsuario,
} from "../../../domain/entities/Usuario.js";
import { UsuarioRepository } from "../../ports/UsuarioRepository.js";

export interface ActualizarUsuarioInput {
  id: number;
  nombre?: string;
  email?: string;
  rol?: RolUsuario;
}

export class ActualizarUsuario {
  constructor(
    private readonly usuarioRepository: UsuarioRepository
  ) {}

  async execute(
    input: ActualizarUsuarioInput
  ): Promise<Usuario> {
    const usuario =
      await this.usuarioRepository.obtenerPorId(
        input.id
      );

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    if (input.email && input.email !== usuario.email) {
      const usuarioConEmail =
        await this.usuarioRepository.obtenerPorEmail(
          input.email
        );

      if (
        usuarioConEmail &&
        usuarioConEmail.id !== usuario.id
      ) {
        throw new Error(
          "El correo electrónico ya está registrado"
        );
      }

      usuario.cambiarEmail(input.email);
    }

    if (input.nombre) {
      usuario.cambiarNombre(input.nombre);
    }

    if (input.rol) {
      usuario.cambiarRol(input.rol);
    }

    return this.usuarioRepository.actualizar(usuario);
  }
}

