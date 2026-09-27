import { Router } from "express";

import { PedidoController } from "../controllers/PedidoController.js";
import { requerirAutenticacion } from "../middlewares/authMiddleware.js";
import { requerirAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();

const controller = new PedidoController();

/*
 * CLIENTE AUTENTICADO
 * Puede consultar sus propios pedidos.
 *
 * IMPORTANTE:
 * Esta ruta debe estar antes de /:id
 */
router.get(
  "/usuario/:usuarioId",
  requerirAutenticacion,
  (req, res) =>
    controller.obtenerPorUsuario(req, res)
);

/*
 * ADMIN
 * Puede consultar todos los pedidos.
 */
router.get(
  "/",
  requerirAutenticacion,
  requerirAdmin,
  (req, res) =>
    controller.obtenerTodos(req, res)
);

/*
 * CLIENTE AUTENTICADO
 * Puede crear un pedido.
 */
router.post(
  "/",
  requerirAutenticacion,
  (req, res) =>
    controller.crear(req, res)
);

/*
 * PEDIDO INDIVIDUAL
 * Requiere iniciar sesión.
 */
router.get(
  "/:id",
  requerirAutenticacion,
  (req, res) =>
    controller.obtenerPorId(req, res)
);

/*
 * ADMIN
 * Puede actualizar pedidos.
 */
router.put(
  "/:id",
  requerirAutenticacion,
  requerirAdmin,
  (req, res) =>
    controller.actualizar(req, res)
);

/*
 * ADMIN
 * Puede eliminar pedidos.
 */
router.delete(
  "/:id",
  requerirAutenticacion,
  requerirAdmin,
  (req, res) =>
    controller.eliminar(req, res)
);

export default router;