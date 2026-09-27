import { Router } from "express";

import { ProductoController } from "../controllers/ProductoController.js";

import {
  requerirAutenticacion,
} from "../middlewares/authMiddleware.js";

import {
  requerirAdmin,
} from "../middlewares/adminMiddleware.js";

const router = Router();

const controller = new ProductoController();

/*
 * Catálogo público.
 *
 * Cualquier visitante puede consultar productos.
 */
router.get("/", (req, res) =>
  controller.obtenerTodos(req, res)
);

router.get("/:id", (req, res) =>
  controller.obtenerPorId(req, res)
);

/*
 * Administración del catálogo.
 *
 * Solo ADMIN.
 */
router.post(
  "/",
  requerirAutenticacion,
  requerirAdmin,
  (req, res) =>
    controller.crear(req, res)
);

router.put(
  "/:id",
  requerirAutenticacion,
  requerirAdmin,
  (req, res) =>
    controller.actualizar(req, res)
);

router.delete(
  "/:id",
  requerirAutenticacion,
  requerirAdmin,
  (req, res) =>
    controller.eliminar(req, res)
);

export default router;