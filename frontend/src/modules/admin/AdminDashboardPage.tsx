import {
  useEffect,
  useState,
} from "react";

import "../../admin.css";

import { useAuth } from "../../context/AuthContext";

import { authService } from "../../services/authService";
import { productoService } from "../../services/productoService";
import { pedidoService } from "../../services/pedidoService";

import { analyticsService } from "../../services/analyticsService";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import type { PeriodoIngresos } from "../../services/analyticsService";

import type { Usuario } from "../../types/usuario";
import type { Producto } from "../../types/producto";
import type { Pedido } from "../../types/pedido";

function AdminDashboardPage() {
  const { usuario } = useAuth();

  const [usuarios, setUsuarios] =
    useState<Usuario[]>([]);

  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [pedidos, setPedidos] =
    useState<Pedido[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");
  
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [periodo, setPeriodo] =
    useState<PeriodoIngresos>("day");
  
  const [analiticas, setAnaliticas] =
    useState<any>(null);
  
  const [cargandoAnaliticas, setCargandoAnaliticas] =
    useState(false);
  
  const [errorAnaliticas, setErrorAnaliticas] =
  useState("");

  async function cargarDashboard() {
    try {
      setCargando(true);
      setError("");

      const [
        usuariosData,
        productosData,
        pedidosData,
      ] = await Promise.all([
        authService.obtenerUsuarios(),
        productoService.obtenerProductos(),
        pedidoService.obtenerPedidos(),
      ]);

      setUsuarios(usuariosData);
      setProductos(productosData);
      setPedidos(pedidosData);
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible cargar la información administrativa."
      );
    } finally {
      setCargando(false);
    }
  }
  
async function cargarAnaliticas() {
  try {
    setCargandoAnaliticas(true);
    setErrorAnaliticas("");

    const filtros = {
      ...(desde ? { desde } : {}),
      ...(hasta ? { hasta } : {}),
    };

    const [
      productosTop,
      ingresos,
      estadosPedidos,
      ticketPromedio,
    ] = await Promise.all([
      analyticsService.obtenerProductosTop(5, filtros),
      analyticsService.obtenerIngresos(periodo, filtros),
      analyticsService.obtenerEstadosPedidos(filtros),
      analyticsService.obtenerTicketPromedio(filtros),
    ]);

    setAnaliticas({
      productosTop,
      ingresos,
      estadosPedidos,
      ticketPromedio,
    });
  } catch (error: any) {
    setErrorAnaliticas(
      error.response?.data?.error ??
        "No fue posible cargar las analíticas."
    );
  } finally {
    setCargandoAnaliticas(false);
  }
}


  useEffect(() => {
    cargarAnaliticas();
  }, [desde, hasta, periodo]);


  async function eliminarUsuario(
    id: number
  ) {
    const confirmar =
      window.confirm(
        "¿Deseas eliminar este usuario?"
      );

    if (!confirmar) return;

    try {
      await authService.eliminarUsuario(id);
      await cargarDashboard();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible eliminar el usuario."
      );
    }
  }

  async function eliminarProducto(
    id: number
  ) {
    const confirmar =
      window.confirm(
        "¿Deseas eliminar este producto?"
      );

    if (!confirmar) return;

    try {
      await productoService.eliminarProducto(id);
      await cargarDashboard();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible eliminar el producto."
      );
    }
  }

  async function cambiarEstadoPedido(
    id: number,
    estado: Pedido["estado"]
  ) {
    try {
      await pedidoService.actualizarPedido(
        id,
        { estado }
      );

      await cargarDashboard();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible actualizar el pedido."
      );
    }
  }

  async function eliminarPedido(
    id: number
  ) {
    const confirmar =
      window.confirm(
        "¿Deseas eliminar este pedido?"
      );

    if (!confirmar) return;

    try {
      await pedidoService.eliminarPedido(id);
      await cargarDashboard();
    } catch (error: any) {
      setError(
        error.response?.data?.error ??
          "No fue posible eliminar el pedido."
      );
    }
  }

  return (
    <section className="admin-dashboard">
    
      {/* ANALÍTICAS DE VENTAS */}
      <section className="admin-section analytics-section">
        <span className="admin-label">REPORTES</span>
        <h2>Analíticas de ventas</h2>
        <p>Consulta ingresos, pedidos y productos más vendidos.</p>

        <div className="analytics-filters">
          <label className="analytics-field">
            Desde
            <input
              type="date"
              value={desde}
              max={hasta || undefined}
              onChange={(e) => setDesde(e.target.value)}
            />
          </label>

          <label className="analytics-field">
            Hasta
            <input
              type="date"
              value={hasta}
              min={desde || undefined}
              onChange={(e) => setHasta(e.target.value)}
            />
          </label>

          <label className="analytics-field">
            Agrupar ingresos por
            <select
              value={periodo}
              onChange={(e) =>
                setPeriodo(e.target.value as PeriodoIngresos)
              }
            >
              <option value="day">Día</option>
              <option value="week">Semana</option>
              <option value="month">Mes</option>
            </select>
          </label>
        </div>

        {errorAnaliticas && (
          <div className="analytics-error">{errorAnaliticas}</div>
        )}

        {cargandoAnaliticas ? (
          <div className="analytics-message">
            Cargando analíticas...
          </div>
        ) : analiticas ? (
          <>
            <div className="analytics-kpis">
              <div className="analytics-kpi">
                <span>Ingresos totales</span>
                <strong>
                  {Number(
                    analiticas.ticketPromedio.totalIngresos
                  ).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </strong>
              </div>

              <div className="analytics-kpi">
                <span>Pedidos contabilizados</span>
                <strong>
                  {analiticas.ticketPromedio.pedidosContabilizados}
                </strong>
              </div>

              <div className="analytics-kpi">
                <span>Ticket promedio por pedido</span>
                <strong>
                  {Number(
                    analiticas.ticketPromedio.ticketPromedioPedido
                  ).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </strong>
              </div>

              <div className="analytics-kpi">
                <span>Ingreso promedio por usuario</span>
                <strong>
                  {Number(
                    analiticas.ticketPromedio.ingresoPromedioPorUsuario
                  ).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </strong>
              </div>
            </div>

            <div className="analytics-grid">
              <article className="analytics-card">
                <h3>Ingresos a lo largo del tiempo</h3>
                <p>Importe y cantidad de pedidos por periodo.</p>

                {analiticas.ingresos.length === 0 ? (
                  <div className="analytics-message">
                    No hay ingresos para este rango de fechas.
                  </div>
                ) : (
                  <div className="analytics-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analiticas.ingresos}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="periodo"
                          tickFormatter={(v) =>
                            String(v).slice(0, 10)
                          }
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="ingresos"
                          name="Ingresos ($)"
                          stroke="#2563eb"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="pedidos"
                          name="Pedidos"
                          stroke="#16a34a"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </article>

              <article className="analytics-card">
                <h3>Estados de los pedidos</h3>
                <p>Distribución de pedidos por estado.</p>

                {analiticas.estadosPedidos.length === 0 ? (
                  <div className="analytics-message">
                    No hay pedidos para mostrar.
                  </div>
                ) : (
                  <div className="analytics-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analiticas.estadosPedidos}
                          dataKey="cantidad"
                          nameKey="estado"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label={(props) => {
                            const dato = props as typeof props & {
                              payload?: {
                                estado?: string;
                                porcentaje?: number;
                              };
                            };
                          
                            return `${dato.payload?.estado ?? ""}: ${
                              dato.payload?.porcentaje ?? 0
                            }%`;
                          }}
                        >
                          {analiticas.estadosPedidos.map(
                            (item: { estado: string }, index: number) => (
                              <Cell
                                key={item.estado}
                                fill={[
                                  "#2563eb",
                                  "#16a34a",
                                  "#f59e0b",
                                  "#8b5cf6",
                                  "#ef4444",
                                  "#64748b",
                                ][index % 6]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </article>

              <article className="analytics-card">
                <h3>Productos más vendidos</h3>
                <p>Ranking por unidades vendidas.</p>

                {analiticas.productosTop.porUnidades.length === 0 ? (
                  <div className="analytics-message">
                    No hay ventas de productos en este periodo.
                  </div>
                ) : (
                  <div className="analytics-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analiticas.productosTop.porUnidades}
                        layout="vertical"
                        margin={{ left: 12, right: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                          type="category"
                          dataKey="nombre"
                          width={110}
                          tick={{ fontSize: 11 }}
                        />
                        <Tooltip />
                        <Bar
                          dataKey="unidades"
                          name="Unidades vendidas"
                          fill="#2563eb"
                          radius={[0, 5, 5, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </article>

              <article className="analytics-card">
                <h3>Productos con más ingresos</h3>
                <p>Ranking según el importe vendido.</p>

                {analiticas.productosTop.porIngresos.length === 0 ? (
                  <div className="analytics-message">
                    No hay ingresos por productos en este periodo.
                  </div>
                ) : (
                  <div className="analytics-ranking">
                    {analiticas.productosTop.porIngresos.map(
                      (producto: {
                        productoId: number;
                        nombre: string;
                        ingresos: number;
                      }) => (
                        <div
                          className="analytics-ranking-item"
                          key={producto.productoId}
                        >
                          <strong>{producto.nombre}</strong>
                          <span>
                            {Number(producto.ingresos).toLocaleString(
                              "es-MX",
                              {
                                style: "currency",
                                currency: "MXN",
                              }
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </article>
            </div>
          </>
        ) : (
          <div className="analytics-message">
            No hay información analítica disponible.
          </div>
        )}
      </section>


      {/* ENCABEZADO */}

      <div className="admin-header">

        <div>
          <span className="admin-label">
            PANEL DE ADMINISTRACIÓN
          </span>

          <h1>
            Bienvenido, {usuario?.nombre}
          </h1>

          <p>
            Administra toda la plataforma
            desde este panel.
          </p>
        </div>

        <button
          type="button"
          onClick={cargarDashboard}
        >
          Actualizar
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* ESTADÍSTICAS */}

      <div className="admin-stats">

        <div className="admin-stat">

          <div className="admin-stat-icon">
            👥
          </div>

          <h3>
            Usuarios
          </h3>

          <strong>
            {usuarios.length}
          </strong>

        </div>

        <div className="admin-stat">

          <div className="admin-stat-icon">
            🛒
          </div>

          <h3>
            Productos
          </h3>

          <strong>
            {productos.length}
          </strong>

        </div>

        <div className="admin-stat">

          <div className="admin-stat-icon">
            📦
          </div>

          <h3>
            Pedidos
          </h3>

          <strong>
            {pedidos.length}
          </strong>

        </div>

      </div>

      {/* CARGANDO */}

      {cargando ? (

        <div className="admin-section">
          Cargando información
          administrativa...
        </div>

      ) : (

        <>

          {/* ============================
              USUARIOS
             ============================ */}

          <section className="admin-section">

            <span className="admin-label">
              ADMINISTRACIÓN
            </span>

            <h2>
              Usuarios
            </h2>

            <p>
              Consulta y administra las
              cuentas registradas.
            </p>

            {usuarios.length === 0 ? (

              <div className="empty">
                No existen usuarios registrados.
              </div>

            ) : (

              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Registro</th>
                      <th>Acciones</th>
                    </tr>

                  </thead>

                  <tbody>

                    {usuarios.map(
                      (usuarioItem) => (

                        <tr
                          key={usuarioItem.id}
                        >

                          <td>
                            #{usuarioItem.id}
                          </td>

                          <td>
                            <strong>
                              {usuarioItem.nombre}
                            </strong>
                          </td>

                          <td>
                            {usuarioItem.email}
                          </td>

                          <td>

                            <span
                              className={
                                usuarioItem.rol ===
                                "ADMIN"
                                  ? "role-badge admin"
                                  : "role-badge"
                              }
                            >
                              {usuarioItem.rol}
                            </span>

                          </td>

                          <td>
                            {usuarioItem.creadoEn
                              ? new Date(
                                  usuarioItem.creadoEn
                                ).toLocaleDateString(
                                  "es-MX"
                                )
                              : "—"}
                          </td>

                          <td>

                            <button
                              type="button"
                              className="danger"
                              onClick={() =>
                                eliminarUsuario(
                                  usuarioItem.id
                                )
                              }
                            >
                              Eliminar
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

          {/* ============================
              PRODUCTOS
             ============================ */}

          <section className="admin-section">

            <span className="admin-label">
              CATÁLOGO
            </span>

            <h2>
              Productos
            </h2>

            <p>
              Consulta el catálogo y controla
              el inventario.
            </p>

            {productos.length === 0 ? (

              <div className="empty">
                No existen productos registrados.
              </div>

            ) : (

              <div className="management-list">

                {productos.map(
                  (producto) => (

                    <article
                      key={producto.id}
                      className="management-item"
                    >

                      <div>

                        <h3>
                          {producto.nombre}
                        </h3>

                        <p>
                          {producto.descripcion}
                        </p>

                        <strong>
                          $
                          {producto.precio.toFixed(
                            2
                          )}
                        </strong>

                        <p>
                          Stock: {producto.stock}
                        </p>

                      </div>

                      <div className="item-actions">

                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            eliminarProducto(
                              producto.id
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

          {/* ============================
              PEDIDOS
             ============================ */}

          <section className="admin-section">

            <span className="admin-label">
              OPERACIONES
            </span>

            <h2>
              Pedidos
            </h2>

            <p>
              Consulta y actualiza el estado
              de los pedidos.
            </p>

            {pedidos.length === 0 ? (

              <div className="empty">
                No existen pedidos registrados.
              </div>

            ) : (

              <div className="orders-list">

                {pedidos.map(
                  (pedido) => (

                    <article
                      key={pedido.id}
                      className="order-card"
                    >

                      <div className="order-header">

                        <div>

                          <span className="admin-label">
                            PEDIDO
                          </span>

                          <h3>
                            #{pedido.id}
                          </h3>

                          <p>
                            Usuario #
                            {pedido.usuarioId}
                          </p>

                        </div>

                        <strong>
                          $
                          {pedido.total.toFixed(
                            2
                          )}
                        </strong>

                      </div>

                      <div className="order-products">

                        {pedido.productos.map(
                          (producto) => (

                            <div
                              key={
                                producto.productoId
                              }
                              className="order-product"
                            >

                              <span>
                                {
                                  producto.nombreProducto
                                }

                                {" × "}

                                {
                                  producto.cantidad
                                }
                              </span>

                              <span>
                                $
                                {(
                                  producto.precioUnitario *
                                  producto.cantidad
                                ).toFixed(2)}
                              </span>

                            </div>

                          )
                        )}

                      </div>

                      <div className="order-footer">

                        <div>

                          <span>
                            Estado
                          </span>

                          <select
                            value={
                              pedido.estado
                            }
                            onChange={(
                              event
                            ) =>
                              cambiarEstadoPedido(
                                pedido.id,
                                event.target
                                  .value as Pedido["estado"]
                              )
                            }
                          >

                            <option value="PENDIENTE">
                              PENDIENTE
                            </option>

                            <option value="PAGADO">
                              PAGADO
                            </option>

                            <option value="ENVIADO">
                              ENVIADO
                            </option>

                            <option value="ENTREGADO">
                              ENTREGADO
                            </option>

                            <option value="CANCELADO">
                              CANCELADO
                            </option>

                          </select>

                        </div>

                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            eliminarPedido(
                              pedido.id
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        </>

      )}

    </section>
  );
}

export default AdminDashboardPage;