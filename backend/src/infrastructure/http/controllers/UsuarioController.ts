import { Request, Response } from "express";
import { useCases } from "../../../container.js";
import { generarToken } from "../../security/JwtService.js";
export class UsuarioController {
  async crear(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const usuario =
        await useCases.usuarios.crear.execute(
          req.body
        );

      res.status(201).json({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        creadoEn: usuario.creadoEn,
      });
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error al crear usuario",
      });
    }
  }
async iniciarSesion(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const usuario =
      await useCases.usuarios.iniciarSesion.execute(
        req.body
      );

    const token =
      generarToken({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      });

    res.json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        creadoEn: usuario.creadoEn,
      },
      token,
    });
  } catch (error) {
    res.status(401).json({
      error:
        error instanceof Error
          ? error.message
          : "Correo o contraseña incorrectos",
    });
  }
}

  async obtenerTodos(
    _req: Request,
    res: Response
  ): Promise<void> {
    try {
      const usuarios =
        await useCases.usuarios.obtenerTodos.execute();

      res.json(
        usuarios.map((usuario) => ({
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          creadoEn: usuario.creadoEn,
        }))
      );
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener usuarios",
      });
    }
  }

  async obtenerPorId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        res.status(400).json({
          error: "El ID del usuario no es válido",
        });
        return;
      }

      const usuario =
        await useCases.usuarios.obtenerPorId.execute(
          id
        );

      res.json({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        creadoEn: usuario.creadoEn,
      });
    } catch (error) {
      res.status(404).json({
        error:
          error instanceof Error
            ? error.message
            : "Usuario no encontrado",
      });
    }
  }

  async actualizar(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        res.status(400).json({
          error: "El ID del usuario no es válido",
        });
        return;
      }

      const usuario =
        await useCases.usuarios.actualizar.execute({
          id,
          ...req.body,
        });

      res.json({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        creadoEn: usuario.creadoEn,
      });
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error al actualizar usuario",
      });
    }
  }

  async eliminar(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        res.status(400).json({
          error: "El ID del usuario no es válido",
        });
        return;
      }

      await useCases.usuarios.eliminar.execute(id);

      res.status(204).send();
    } catch (error) {
      res.status(404).json({
        error:
          error instanceof Error
            ? error.message
            : "Usuario no encontrado",
      });
    }
  }
}
