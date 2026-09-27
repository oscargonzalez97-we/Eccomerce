import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  verificarToken,
  UsuarioToken,
} from "../../security/JwtService.js";

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioToken;
    }
  }
}

/**
 * Verifica que la petición tenga un JWT válido.
 *
 * Este middleware NO comprueba roles.
 * Solamente comprueba que exista una sesión válida.
 */
export function requerirAutenticacion(
  req: Request,
  res: Response,
  next: NextFunction
): void {

  const authorization =
    req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      error:
        "Debes iniciar sesión para realizar esta operación",
    });

    return;
  }

  const partes =
    authorization.split(" ");

  if (
    partes.length !== 2 ||
    partes[0] !== "Bearer" ||
    !partes[1]
  ) {
    res.status(401).json({
      error:
        "Formato de autorización inválido",
    });

    return;
  }

  const token = partes[1];

  try {

    const usuario =
      verificarToken(token);

    req.usuario = usuario;

    next();

  } catch {

    res.status(401).json({
      error:
        "La sesión no es válida o ha expirado",
    });

    return;
  }
}


/**
 * Permite únicamente usuarios con rol ADMIN.
 *
 * IMPORTANTE:
 * Este middleware debe utilizarse DESPUÉS de
 * requerirAutenticacion().
 */
export function requerirAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {

  if (!req.usuario) {
    res.status(401).json({
      error:
        "Debes iniciar sesión para realizar esta operación",
    });

    return;
  }

  if (req.usuario.rol !== "ADMIN") {
    res.status(403).json({
      error:
        "No tienes permisos de administrador para realizar esta operación",
    });

    return;
  }

  next();
}