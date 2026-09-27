import api from "./api";

import type {
  Usuario,
  CrearUsuarioRequest,
  ActualizarUsuarioRequest,
  LoginRequest,
  LoginResponse,
} from "../types/usuario";

export const authService = {

  async iniciarSesion(
    datos: LoginRequest
  ): Promise<LoginResponse> {

    const response =
      await api.post<LoginResponse>(
        "/usuarios/login",
        datos
      );

    return response.data;
  },

  async registrar(
    datos: CrearUsuarioRequest
  ): Promise<Usuario> {

    const response =
      await api.post<Usuario>(
        "/usuarios",
        datos
      );

    return response.data;
  },

  async obtenerUsuarios(): Promise<Usuario[]> {

    const response =
      await api.get<Usuario[]>(
        "/usuarios"
      );

    return response.data;
  },

  async obtenerUsuario(
    id: number
  ): Promise<Usuario> {

    const response =
      await api.get<Usuario>(
        `/usuarios/${id}`
      );

    return response.data;
  },

  async actualizarUsuario(
    id: number,
    datos: ActualizarUsuarioRequest
  ): Promise<Usuario> {

    const response =
      await api.put<Usuario>(
        `/usuarios/${id}`,
        datos
      );

    return response.data;
  },

  async eliminarUsuario(
    id: number
  ): Promise<void> {

    await api.delete(
      `/usuarios/${id}`
    );
  },
};