import { Pedido } from "../../domain/entities/Pedido.js";
import { Usuario } from "../../domain/entities/Usuario.js";

export interface EmailNotificationPort {
  enviarComprobanteCliente(
    pedido: Pedido,
    usuario: Usuario
  ): Promise<void>;

  notificarAdministrador(
    pedido: Pedido,
    usuario: Usuario
  ): Promise<void>;
}
