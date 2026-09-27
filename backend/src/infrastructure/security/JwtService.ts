import jwt from "jsonwebtoken";

export interface UsuarioToken {
  id: number;
  nombre: string;
  email: string;
  rol: "CLIENTE" | "ADMIN";
}

const JWT_SECRET =
  process.env.JWT_SECRET ??
  "clave-temporal-no-usar-en-produccion";

export function generarToken(
  usuario: UsuarioToken
): string {

  return jwt.sign(
    {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
    JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
}

export function verificarToken(
  token: string
): UsuarioToken {

  return jwt.verify(
    token,
    JWT_SECRET
  ) as UsuarioToken;
}
