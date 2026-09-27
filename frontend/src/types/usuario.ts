export type RolUsuario =
  | "CLIENTE"
  | "ADMIN";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
  creadoEn?: string;
}

export interface CrearUsuarioRequest {
  nombre: string;
  email: string;
  password: string;
  rol?: RolUsuario;
}

export interface ActualizarUsuarioRequest {
  nombre?: string;
  email?: string;
  rol?: RolUsuario;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  usuario: Usuario;
  token: string;
}
