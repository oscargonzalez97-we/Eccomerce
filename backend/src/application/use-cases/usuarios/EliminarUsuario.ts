import { UsuarioRepository } from "../../ports/UsuarioRepository.js";

export class EliminarUsuario {
  constructor(
    private readonly usuarioRepository: UsuarioRepository
  ) {}

  async execute(id: number): Promise<void> {
    const usuario =
      await this.usuarioRepository.obtenerPorId(id);

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    await this.usuarioRepository.eliminar(id);
  }
}
