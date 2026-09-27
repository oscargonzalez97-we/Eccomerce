import { Usuario } from "../../domain/entities/Usuario.js";

export interface UsuarioRepository {
  crear(usuario: Usuario): Promise<Usuario>;

  obtenerTodos(): Promise<Usuario[]>;

  obtenerPorId(id: number): Promise<Usuario | null>;

  obtenerPorEmail(email: string): Promise<Usuario | null>;

  actualizar(usuario: Usuario): Promise<Usuario>;

  eliminar(id: number): Promise<void>;

}
