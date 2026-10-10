import { query } from "../database/PostgresConnection.js";

import type {
  AnalyticsRepository,
  AnalyticsFilters,
  Granularity,
} from "../../application/ports/AnalyticsRepository.js";

type ProductRow = {
  producto_id: number;
  nombre: string;
  unidades: string | number;
  ingresos: string | number;
};

type TrendRow = {
  periodo: string | Date;
  ingresos: string | number;
  pedidos: string | number;
};

type StatusRow = {
  estado: string;
  cantidad: string | number;
  porcentaje: string | number;
};

type TicketRow = {
  total_ingresos: string | number;
  pedidos_contabilizados: string | number;
  usuarios_con_pedidos: string | number;
  ticket_promedio_pedido: string | number;
  ingreso_promedio_por_usuario: string | number;
};

function numero(value: string | number): number {
  return Number(value);
}

function whereDates(
  filters: AnalyticsFilters,
  startIndex = 1
): { sql: string; params: string[] } {
  const conditions: string[] = [];
  const params: string[] = [];

  if (filters.desde) {
    params.push(filters.desde);
    conditions.push(
      `p.creado_en >= $${startIndex + params.length - 1}::date`
    );
  }

  if (filters.hasta) {
    params.push(filters.hasta);
    conditions.push(
      `p.creado_en < ($${startIndex + params.length - 1}::date + INTERVAL '1 day')`
    );
  }

  return {
    sql: conditions.length
      ? `AND ${conditions.join(" AND ")}`
      : "",
    params,
  };
}

const pedidosValidos = `
  UPPER(TRIM(p.estado)) NOT IN
  ('CANCELADO', 'CANCELADA', 'CANCELED', 'CANCELLED')
`;

export class AnalyticsRepositoryAdapter
implements AnalyticsRepository {
  async topProducts(
    limit: number,
    filters: AnalyticsFilters
  ) {
    const dates = whereDates(filters);

    const baseSql = `
      SELECT
        pr.id AS producto_id,
        pr.nombre,
        COALESCE(SUM(pp.cantidad), 0)::int AS unidades,
        COALESCE(
          SUM(pp.cantidad * pp.precio_unitario), 0
        )::numeric AS ingresos
      FROM pedido_productos pp
      INNER JOIN pedidos p ON p.id = pp.pedido_id
      INNER JOIN productos pr ON pr.id = pp.producto_id
      WHERE ${pedidosValidos}
      ${dates.sql}
      GROUP BY pr.id, pr.nombre
    `;

    const byUnits = await query<ProductRow>(
      `${baseSql}
       ORDER BY unidades DESC, ingresos DESC
       LIMIT $${dates.params.length + 1}`,
      [...dates.params, limit]
    );

    const byRevenue = await query<ProductRow>(
      `${baseSql}
       ORDER BY ingresos DESC, unidades DESC
       LIMIT $${dates.params.length + 1}`,
      [...dates.params, limit]
    );

    const mapProducts = (rows: ProductRow[]) =>
      rows.map((row) => ({
        productoId: numero(row.producto_id),
        nombre: row.nombre,
        unidades: numero(row.unidades),
        ingresos: numero(row.ingresos),
      }));

    return {
      porUnidades: mapProducts(byUnits.rows),
      porIngresos: mapProducts(byRevenue.rows),
    };
  }

  async revenueTrend(
    granularity: Granularity,
    filters: AnalyticsFilters
  ) {
    const dates = whereDates(filters);

    // El valor se valida en el servicio y se restringe aquí también.
    const trunc: Record<Granularity, string> = {
      day: "day",
      week: "week",
      month: "month",
    };

    const result = await query<TrendRow>(
      `
      SELECT
        date_trunc('${trunc[granularity]}', p.creado_en)
          AS periodo,
        COALESCE(SUM(p.total), 0)::numeric AS ingresos,
        COUNT(*)::int AS pedidos
      FROM pedidos p
      WHERE ${pedidosValidos}
      ${dates.sql}
      GROUP BY date_trunc('${trunc[granularity]}', p.creado_en)
      ORDER BY periodo ASC
      `,
      dates.params
    );

    return result.rows.map((row) => ({
      periodo: row.periodo instanceof Date
        ? row.periodo.toISOString()
        : String(row.periodo),
      ingresos: numero(row.ingresos),
      pedidos: numero(row.pedidos),
    }));
  }

  async orderStatuses(filters: AnalyticsFilters) {
    const dates = whereDates(filters);

    const result = await query<StatusRow>(
      `
      SELECT
        p.estado,
        COUNT(*)::int AS cantidad,
        ROUND(
          COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0),
          2
        ) AS porcentaje
      FROM pedidos p
      WHERE 1 = 1
      ${dates.sql}
      GROUP BY p.estado
      ORDER BY cantidad DESC, p.estado ASC
      `,
      dates.params
    );

    return result.rows.map((row) => ({
      estado: row.estado,
      cantidad: numero(row.cantidad),
      porcentaje: numero(row.porcentaje),
    }));
  }

  async averageTicket(filters: AnalyticsFilters) {
    const dates = whereDates(filters);

    const result = await query<TicketRow>(
      `
      SELECT
        COALESCE(SUM(p.total), 0)::numeric AS total_ingresos,
        COUNT(*)::int AS pedidos_contabilizados,
        COUNT(DISTINCT p.usuario_id)::int AS usuarios_con_pedidos,
        COALESCE(AVG(p.total), 0)::numeric AS ticket_promedio_pedido,
        COALESCE(
          SUM(p.total) / NULLIF(COUNT(DISTINCT p.usuario_id), 0),
          0
        )::numeric AS ingreso_promedio_por_usuario
      FROM pedidos p
      WHERE ${pedidosValidos}
      ${dates.sql}
      `,
      dates.params
    );

    const row = result.rows[0];

    return {
      totalIngresos: numero(row.total_ingresos),
      pedidosContabilizados: numero(row.pedidos_contabilizados),
      usuariosConPedidos: numero(row.usuarios_con_pedidos),
      ticketPromedioPedido: numero(row.ticket_promedio_pedido),
      ingresoPromedioPorUsuario: numero(
        row.ingreso_promedio_por_usuario
      ),
    };
  }
}
