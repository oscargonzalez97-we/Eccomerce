import { Router } from "express";

import { UsuarioController } from "../controllers/UsuarioController.js";

import {
  requerirAutenticacion,
} from "../middlewares/authMiddleware.js";

import {
  requerirAdmin,
} from "../middlewares/adminMiddleware.js";

const router = Router();

const controller = new UsuarioController();

/*
 * Registro público
 *
 * Cualquier persona puede crear una cuenta
 * como CLIENTE.
 */
router.post("/", (req, res) =>
  controller.crear(req, res)
);

/*
 * Login público
 */
router.post("/login", (req, res) =>
  controller.iniciarSesion(req, res)
);

/*
 * Administración de usuarios
 *
 * Requiere:
 * 1. JWT válido
 * 2. Rol ADMIN
 */
router.get(
  "/",
  requerirAutenticacion,
  requerirAdmin,
  (req, res) =>
    controller.obtenerTodos(req, res)
);

router.get(
  "/:id",
  requerirAutenticacion,
  requerirAdmin,
  (req, res) =>
    controller.obtenerPorId(req, res)
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