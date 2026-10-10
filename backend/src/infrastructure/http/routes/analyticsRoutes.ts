import { Router, type Request, type Response } from "express";

import { useCases } from "../../../container.js";
import { requerirAutenticacion } from "../middlewares/authMiddleware.js";
import { requerirAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();

router.use(requerirAutenticacion, requerirAdmin);

function filtros(req: Request) {
  const desde = req.query.desde;
  const hasta = req.query.hasta;

  if (
    (desde !== undefined && typeof desde !== "string") ||
    (hasta !== undefined && typeof hasta !== "string")
  ) {
    throw new Error("Los parámetros desde y hasta deben ser fechas de texto");
  }

  return {
    desde: desde as string | undefined,
    hasta: hasta as string | undefined,
  };
}

function errorResponse(res: Response, error: unknown) {
  const message = error instanceof Error
    ? error.message
    : "Error interno al consultar analítica";

  const status = /fecha|límite|periodo|desde|parámetros/i.test(message)
    ? 400
    : 500;

  res.status(status).json({ error: message });
}

router.get("/productos-top", async (req, res) => {
  try {
    const rawLimit = req.query.limite ?? "5";
    const limit = Number(rawLimit);

    if (![5, 10].includes(limit)) {
      res.status(400).json({
        error: "El parámetro limite debe ser 5 o 10",
      });
      return;
    }

    res.json(
      await useCases.analytics.resumenProductos(limit, filtros(req))
    );
  } catch (error) {
    errorResponse(res, error);
  }
});

router.get("/ingresos", async (req, res) => {
  try {
    const raw = req.query.periodo ?? "day";

    if (
      raw !== "day" &&
      raw !== "week" &&
      raw !== "month"
    ) {
      res.status(400).json({
        error: "El parámetro periodo debe ser day, week o month",
      });
      return;
    }

    res.json(
      await useCases.analytics.ingresos(raw, filtros(req))
    );
  } catch (error) {
    errorResponse(res, error);
  }
});

router.get("/estados-pedidos", async (req, res) => {
  try {
    res.json(
      await useCases.analytics.estadosPedidos(filtros(req))
    );
  } catch (error) {
    errorResponse(res, error);
  }
});

router.get("/ticket-promedio", async (req, res) => {
  try {
    res.json(
      await useCases.analytics.ticketPromedio(filtros(req))
    );
  } catch (error) {
    errorResponse(res, error);
  }
});

export default router;
