import {
  Usuario,
} from "../../../domain/entities/Usuario.js";

import { UsuarioRepository } from "../../ports/UsuarioRepository.js";
import { PasswordHasher } from "../../ports/PasswordHasher.js";

export interface CrearUsuarioInput {
  nombre: string;
  email: string;
  password: string;
}

export class CrearUsuario {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(
    input: CrearUsuarioInput
  ): Promise<Usuario> {

    const usuarioExistente =
      await this.usuarioRepository.obtenerPorEmail(
        input.email
      );

    if (usuarioExistente) {
      throw new Error(
        "Ya existe un usuario con ese correo electrónico"
      );
    }

    if (
      !input.password ||
      input.password.length < 8
    ) {
      throw new Error(
        "La contraseña debe tener al menos 8 caracteres"
      );
    }

    const passwordHash =
      await this.passwordHasher.hash(
        input.password
      );

    /*
     * IMPORTANTE:
     *
     * Todo usuario registrado públicamente
     * comienza como CLIENTE.
     *
     * El rol NO viene desde el frontend.
     * Esto evita que alguien pueda crear
     * una cuenta ADMIN modificando la petición HTTP.
     */

    const usuario = new Usuario({
      nombre: input.nombre,
      email: input.email,
      passwordHash,
      rol: "CLIENTE",
    });

    return this.usuarioRepository.crear(
      usuario
    );
  }
}