import {
  Usuario,
  RolUsuario,
} from "../../domain/entities/Usuario.js";

import { UsuarioRepository } from "../../application/ports/UsuarioRepository.js";
import { query } from "../database/PostgresConnection.js";

interface UsuarioRow {
  id: number;
  nombre: string;
  email: string;
  password_hash: string;
  rol: RolUsuario;
  creado_en: Date;
}

export class UsuarioRepositoryPostgres
  implements UsuarioRepository
{
  private mapearUsuario(row: UsuarioRow): Usuario {
    return new Usuario({
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      passwordHash: row.password_hash,
      rol: row.rol,
      creadoEn: row.creado_en,
    });
  }

  async crear(usuario: Usuario): Promise<Usuario> {
    const resultado = await query<UsuarioRow>(
      `
      INSERT INTO usuarios
        (nombre, email, password_hash, rol)
      VALUES
        ($1, $2, $3, $4)
      RETURNING
        id,
        nombre,
        email,
        password_hash,
        rol,
        creado_en
      `,
      [
        usuario.nombre,
        usuario.email,
        usuario.passwordHash,
        usuario.rol,
      ]
    );

    return this.mapearUsuario(resultado.rows[0]);
  }

  async obtenerTodos(): Promise<Usuario[]> {
    const resultado = await query<UsuarioRow>(
      `
      SELECT
        id,
        nombre,
        email,
        password_hash,
        rol,
        creado_en
      FROM usuarios
      ORDER BY id ASC
      `
    );

    return resultado.rows.map(
      (row: UsuarioRow) => this.mapearUsuario(row)
    );
  }

  async obtenerPorId(
    id: number
  ): Promise<Usuario | null> {
    const resultado = await query<UsuarioRow>(
      `
      SELECT
        id,
        nombre,
        email,
        password_hash,
        rol,
        creado_en
      FROM usuarios
      WHERE id = $1
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return null;
    }

    return this.mapearUsuario(resultado.rows[0]);
  }

  async obtenerPorEmail(
    email: string
  ): Promise<Usuario | null> {
    const resultado = await query<UsuarioRow>(
      `
      SELECT
        id,
        nombre,
        email,
        password_hash,
        rol,
        creado_en
      FROM usuarios
      WHERE email = $1
      `,
      [email.trim().toLowerCase()]
    );

    if (resultado.rows.length === 0) {
      return null;
    }

    return this.mapearUsuario(resultado.rows[0]);
  }

  async actualizar(
    usuario: Usuario
  ): Promise<Usuario> {
    const resultado = await query<UsuarioRow>(
      `
      UPDATE usuarios
      SET
        nombre = $1,
        email = $2,
        rol = $3
      WHERE id = $4
      RETURNING
        id,
        nombre,
        email,
        password_hash,
        rol,
        creado_en
      `,
      [
        usuario.nombre,
        usuario.email,
        usuario.rol,
        usuario.id,
      ]
    );

    if (resultado.rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    return this.mapearUsuario(resultado.rows[0]);
  }

  async eliminar(id: number): Promise<void> {
    const resultado = await query(
      `
      DELETE FROM usuarios
      WHERE id = $1
      `,
      [id]
    );

    if (resultado.rowCount === 0) {
      throw new Error("Usuario no encontrado");
    }
  }
}

