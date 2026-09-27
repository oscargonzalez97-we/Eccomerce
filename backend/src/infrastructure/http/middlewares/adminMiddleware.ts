import {
  Request,
  Response,
  NextFunction,
} from "express";

export function requerirAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {

  if (!req.usuario) {
    res.status(401).json({
      error: "Debes iniciar sesión",
    });

    return;
  }

  if (req.usuario.rol !== "ADMIN") {
    res.status(403).json({
      error:
        "No tienes permisos para realizar esta operación",
    });

    return;
  }

  next();
}
