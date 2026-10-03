import nodemailer from "nodemailer";

import { EmailNotifier } from "../../application/ports/EmailNotifier.js";
import { Pedido } from "../../domain/entities/Pedido.js";
import { Usuario } from "../../domain/entities/Usuario.js";

export class NodemailerEmailAdapter
  implements EmailNotifier
{
  private readonly transporter;

  private readonly adminEmail =
    process.env.ADMIN_EMAIL!;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure:
        process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async enviarConfirmacionPedido(
    usuario: Usuario,
    pedido: Pedido
  ): Promise<void> {
    const productos = pedido.productos
      .map(
        (producto) => `
          <tr>
            <td>${producto.nombreProducto}</td>
            <td>${producto.cantidad}</td>
            <td>$${producto.precioUnitario.toFixed(2)}</td>
            <td>
              $${(
                producto.precioUnitario *
                producto.cantidad
              ).toFixed(2)}
            </td>
          </tr>
        `
      )
      .join("");

    await this.transporter.sendMail({
      from: `"E-commerce" <${process.env.SMTP_USER}>`,
      to: usuario.email,
      subject: `Pedido #${pedido.id} - Pendiente de pago`,
      html: `
        <h1>¡Gracias por tu compra!</h1>

        <p>
          Hola <strong>${usuario.nombre}</strong>,
        </p>

        <p>
          Hemos recibido correctamente tu pedido.
        </p>

        <h2>Pedido #${pedido.id}</h2>

        <p>
          Estado:
          <strong>PENDIENTE DE PAGO</strong>
        </p>

        <table
          border="1"
          cellpadding="8"
          cellspacing="0"
          width="100%"
        >
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            ${productos}
          </tbody>
        </table>

        <h2>
          Total:
          $${pedido.total.toFixed(2)}
        </h2>

        <hr />

        <h2>Instrucciones de pago</h2>

        <p>
          Realiza el pago mediante transferencia bancaria
          utilizando los siguientes datos:
        </p>

        <ul>
          <li>
            Banco: ${process.env.BANK_NAME}
          </li>

          <li>
            Titular: ${process.env.BANK_OWNER}
          </li>

          <li>
            Cuenta: ${process.env.BANK_ACCOUNT}
          </li>

          <li>
            CLABE: ${process.env.BANK_CLABE}
          </li>
        </ul>

        <p>
          Utiliza como referencia el número de pedido
          <strong>#${pedido.id}</strong>.
        </p>

        <p>
          Una vez confirmado el pago,
          procederemos con el procesamiento de tu pedido.
        </p>
      `,
    });
  }

  async enviarNotificacionAdministrador(
    usuario: Usuario,
    pedido: Pedido
  ): Promise<void> {
    const productos = pedido.productos
      .map(
        (producto) => `
          <li>
            ${producto.nombreProducto}
            -
            ${producto.cantidad} x
            $${producto.precioUnitario.toFixed(2)}
          </li>
        `
      )
      .join("");

    await this.transporter.sendMail({
      from: `"E-commerce" <${process.env.SMTP_USER}>`,
      to: this.adminEmail,
      subject: `Nuevo pedido #${pedido.id}`,
      html: `
        <h1>Nuevo pedido recibido</h1>

        <h2>Pedido #${pedido.id}</h2>

        <p>
          <strong>Cliente:</strong>
          ${usuario.nombre}
        </p>

        <p>
          <strong>Email:</strong>
          ${usuario.email}
        </p>

        <p>
          <strong>Estado:</strong>
          ${pedido.estado}
        </p>

        <h3>Productos</h3>

        <ul>
          ${productos}
        </ul>

        <h2>
          Total:
          $${pedido.total.toFixed(2)}
        </h2>
      `,
    });
  }
}