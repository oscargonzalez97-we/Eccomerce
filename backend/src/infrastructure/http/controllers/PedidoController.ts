import { Request, Response } from "express";
import { useCases } from "../../../container.js";

export class PedidoController {
  async crear(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const pedido =
        await useCases.pedidos.crear.execute(
          req.body
        );

      res.status(201).json(pedido);
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error al crear pedido",
      });
    }
  }

  async obtenerTodos(
    _req: Request,
    res: Response
  ): Promise<void> {
    try {
      const pedidos =
        await useCases.pedidos.obtenerTodos.execute();

      res.json(pedidos);
    } catch {
      res.status(500).json({
        error: "Error al obtener pedidos",
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
          error: "El ID del pedido no es válido",
        });
        return;
      }

      const pedido =
        await useCases.pedidos.obtenerPorId.execute(
          id
        );

      res.json(pedido);
    } catch (error) {
      res.status(404).json({
        error:
          error instanceof Error
            ? error.message
            : "Pedido no encontrado",
      });
    }
  }

  async obtenerPorUsuario(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const usuarioId = Number(
        req.params.usuarioId
      );

      if (!Number.isInteger(usuarioId)) {
        res.status(400).json({
          error: "El ID del usuario no es válido",
        });
        return;
      }

      const pedidos =
        await useCases.pedidos.obtenerPorUsuario.execute(
          usuarioId
        );

      res.json(pedidos);
    } catch {
      res.status(500).json({
        error:
          "Error al obtener pedidos del usuario",
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
          error: "El ID del pedido no es válido",
        });
        return;
      }

      const pedido =
        await useCases.pedidos.actualizar.execute({
          id,
          ...req.body,
        });

      res.json(pedido);
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error al actualizar pedido",
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
          error: "El ID del pedido no es válido",
        });
        return;
      }

      await useCases.pedidos.eliminar.execute(id);

      res.status(204).send();
    } catch (error) {
      res.status(404).json({
        error:
          error instanceof Error
            ? error.message
            : "Pedido no encontrado",
      });
    }
  }
}
