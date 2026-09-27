import { Usuario } from "../../../domain/entities/Usuario.js";
import { UsuarioRepository } from "../../ports/UsuarioRepository.js";

export class ObtenerUsuarios {
  constructor(
    private readonly usuarioRepository: UsuarioRepository
  ) {}

  async execute(): Promise<Usuario[]> {
    return this.usuarioRepository.obtenerTodos();
  }
}
