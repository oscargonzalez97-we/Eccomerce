import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { testDatabaseConnection } from "./infrastructure/database/PostgresConnection.js";

import usuarioRoutes from "./infrastructure/http/routes/usuarioRoutes.js";
import productoRoutes from "./infrastructure/http/routes/productoRoutes.js";
import pedidoRoutes from "./infrastructure/http/routes/pedidoRoutes.js";
import analyticsRoutes from "./infrastructure/http/routes/analyticsRoutes.js";

dotenv.config();

const app = express();

const PORT = Number(
  process.env.PORT ?? 3000
);

const CORS_ORIGIN =
  process.env.CORS_ORIGIN ??
  "http://localhost:5173";

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    mensaje:
      "API de comercio electrónico funcionando",
    estado: "OK",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    estado: "OK",
    servicio: "ecommerce-backend",
  });
});

app.use(
  "/api/usuarios",
  usuarioRoutes
);

app.use(
  "/api/productos",
  productoRoutes
);

app.use(
  "/api/pedidos",
  pedidoRoutes
);

app.use("/api/analytics", analyticsRoutes);

app.use(
  (
    _req,
    res
  ) => {
    res.status(404).json({
      error: "Ruta no encontrada",
    });
  }
);

async function main(): Promise<void> {
  try {
    await testDatabaseConnection();

    app.listen(
      PORT,
      () => {
        console.log(
          `🚀 Servidor ejecutándose en http://localhost:${PORT}`
        );

        console.log(
          `📦 API de usuarios: http://localhost:${PORT}/api/usuarios`
        );

        console.log(
          `🛒 API de productos: http://localhost:${PORT}/api/productos`
        );

        console.log(
          `📋 API de pedidos: http://localhost:${PORT}/api/pedidos`
        );

        console.log(
          `📊 API de analítica: http://localhost:${PORT}/api/analytics`
        );
      }
    );
  } catch (error) {
    console.error(
      "❌ No fue posible iniciar el servidor:",
      error
    );

    process.exit(1);
  }
}

main();