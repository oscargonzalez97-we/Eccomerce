import { Request, Response } from "express";
import { useCases } from "../../../container.js";

export class ProductoController {
  async crear(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const producto =
        await useCases.productos.crear.execute(
          req.body
        );

      res.status(201).json(producto);
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error al crear producto",
      });
    }
  }

  async obtenerTodos(
    _req: Request,
    res: Response
  ): Promise<void> {
    try {
      const productos =
        await useCases.productos.obtenerTodos.execute();

      res.json(productos);
    } catch {
      res.status(500).json({
        error: "Error al obtener productos",
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
          error: "El ID del producto no es válido",
        });
        return;
      }

      const producto =
        await useCases.productos.obtenerPorId.execute(
          id
        );

      res.json(producto);
    } catch (error) {
      res.status(404).json({
        error:
          error instanceof Error
            ? error.message
            : "Producto no encontrado",
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
          error: "El ID del producto no es válido",
        });
        return;
      }

      const producto =
        await useCases.productos.actualizar.execute({
          id,
          ...req.body,
        });

      res.json(producto);
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error al actualizar producto",
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
          error: "El ID del producto no es válido",
        });
        return;
      }

      await useCases.productos.eliminar.execute(id);

      res.status(204).send();
    } catch (error) {
      res.status(404).json({
        error:
          error instanceof Error
            ? error.message
            : "Producto no encontrado",
      });
    }
  }
}
