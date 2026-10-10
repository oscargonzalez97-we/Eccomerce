import { CrearUsuario } from "./application/use-cases/usuarios/CrearUsuario.js";
import { ObtenerUsuarios } from "./application/use-cases/usuarios/ObtenerUsuarios.js";
import { ObtenerUsuarioPorId } from "./application/use-cases/usuarios/ObtenerUsuarioPorId.js";
import { ActualizarUsuario } from "./application/use-cases/usuarios/ActualizarUsuario.js";
import { EliminarUsuario } from "./application/use-cases/usuarios/EliminarUsuario.js";
import { IniciarSesion } from "./application/use-cases/usuarios/IniciarSesion.js";

import { CrearProducto } from "./application/use-cases/productos/CrearProducto.js";
import { ObtenerProductos } from "./application/use-cases/productos/ObtenerProductos.js";
import { ObtenerProductoPorId } from "./application/use-cases/productos/ObtenerProductoPorId.js";
import { ActualizarProducto } from "./application/use-cases/productos/ActualizarProducto.js";
import { EliminarProducto } from "./application/use-cases/productos/EliminarProducto.js";

import { CrearPedido } from "./application/use-cases/pedidos/CrearPedido.js";
import { ObtenerPedidos } from "./application/use-cases/pedidos/ObtenerPedidos.js";
import { ObtenerPedidoPorId } from "./application/use-cases/pedidos/ObtenerPedidoPorId.js";
import { ObtenerPedidosPorUsuario } from "./application/use-cases/pedidos/ObtenerPedidosPorUsuario.js";
import { ActualizarPedido } from "./application/use-cases/pedidos/ActualizarPedido.js";
import { EliminarPedido } from "./application/use-cases/pedidos/EliminarPedido.js";

import { UsuarioRepositoryPostgres } from "./infrastructure/repositories/UsuarioRepositoryPostgres.js";
import { ProductoRepositoryPostgres } from "./infrastructure/repositories/ProductoRepositoryPostgres.js";
import { PedidoRepositoryPostgres } from "./infrastructure/repositories/PedidoRepositoryPostgres.js";
import { AnalyticsRepositoryAdapter } from "./infrastructure/repositories/AnalyticsRepositoryAdapter.js";
import { AnalyticsService } from "./application/use-cases/analytics/AnalyticsService.js";

import { Argon2PasswordHasher } from "./infrastructure/security/Argon2PasswordHasher.js";

import { NodemailerEmailAdapter } from "./infrastructure/notifications/NodemailerEmailAdapter.js";


const usuarioRepository =
  new UsuarioRepositoryPostgres();

const productoRepository =
  new ProductoRepositoryPostgres();

const pedidoRepository =
  new PedidoRepositoryPostgres();

const analyticsRepository =
  new AnalyticsRepositoryAdapter();

const analyticsService =
  new AnalyticsService(analyticsRepository);

const passwordHasher =
  new Argon2PasswordHasher();
  
const emailNotifier =
  new NodemailerEmailAdapter();

export const useCases = {
  analytics: {
    resumenProductos: (limit: number, filters: import("./application/ports/AnalyticsRepository.js").AnalyticsFilters) => analyticsService.resumenProductos(limit, filters),
    ingresos: (periodo: import("./application/ports/AnalyticsRepository.js").Granularity, filters: import("./application/ports/AnalyticsRepository.js").AnalyticsFilters) => analyticsService.ingresos(periodo, filters),
    estadosPedidos: (filters: import("./application/ports/AnalyticsRepository.js").AnalyticsFilters) => analyticsService.estadosPedidos(filters),
    ticketPromedio: (filters: import("./application/ports/AnalyticsRepository.js").AnalyticsFilters) => analyticsService.ticketPromedio(filters),
  },
  usuarios: {
    crear: new CrearUsuario(
      usuarioRepository,
      passwordHasher
    ),
  
    iniciarSesion: new IniciarSesion(
      usuarioRepository,
      passwordHasher
    ),
  
    obtenerTodos: new ObtenerUsuarios(
      usuarioRepository
    ),
  
    obtenerPorId: new ObtenerUsuarioPorId(
      usuarioRepository
    ),
  
    actualizar: new ActualizarUsuario(
      usuarioRepository
    ),
  
    eliminar: new EliminarUsuario(
      usuarioRepository
    ),
  },
  productos: {
    crear: new CrearProducto(
      productoRepository
    ),

    obtenerTodos: new ObtenerProductos(
      productoRepository
    ),

    obtenerPorId: new ObtenerProductoPorId(
      productoRepository
    ),

    actualizar: new ActualizarProducto(
      productoRepository
    ),

    eliminar: new EliminarProducto(
      productoRepository
    ),
  },

  pedidos: {
    crear: new CrearPedido(
      pedidoRepository,
      productoRepository,
      usuarioRepository,
      emailNotifier
    ),

    obtenerTodos: new ObtenerPedidos(
      pedidoRepository
    ),

    obtenerPorId: new ObtenerPedidoPorId(
      pedidoRepository
    ),

    obtenerPorUsuario:
      new ObtenerPedidosPorUsuario(
        pedidoRepository
      ),

    actualizar: new ActualizarPedido(
      pedidoRepository
    ),

    eliminar: new EliminarPedido(
      pedidoRepository
    ),
  },
};
