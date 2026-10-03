import { Pedido } from "../../domain/entities/Pedido.js";
import { Usuario } from "../../domain/entities/Usuario.js";

export interface EmailNotifier {
  enviarConfirmacionPedido(
    usuario: Usuario,
    pedido: Pedido
  ): Promise<void>;

  enviarNotificacionAdministrador(
    usuario: Usuario,
    pedido: Pedido
  ): Promise<void>;
}
