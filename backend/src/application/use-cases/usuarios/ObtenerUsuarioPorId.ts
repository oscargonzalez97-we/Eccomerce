import { Usuario } from "../../../domain/entities/Usuario.js";
import { UsuarioRepository } from "../../ports/UsuarioRepository.js";

export class ObtenerUsuarioPorId {
  constructor(
    private readonly usuarioRepository: UsuarioRepository
  ) {}

  async execute(id: number): Promise<Usuario> {
    const usuario =
      await this.usuarioRepository.obtenerPorId(id);

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    return usuario;
  }
}
