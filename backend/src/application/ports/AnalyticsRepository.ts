export type AnalyticsFilters = {
  desde?: string;
  hasta?: string;
};

export type Granularity = "day" | "week" | "month";

export interface AnalyticsRepository {
  topProducts(
    limit: number,
    filters: AnalyticsFilters
  ): Promise<{
    porUnidades: Array<{
      productoId: number;
      nombre: string;
      unidades: number;
      ingresos: number;
    }>;
    porIngresos: Array<{
      productoId: number;
      nombre: string;
      unidades: number;
      ingresos: number;
    }>;
  }>;

  revenueTrend(
    granularity: Granularity,
    filters: AnalyticsFilters
  ): Promise<Array<{
    periodo: string;
    ingresos: number;
    pedidos: number;
  }>>;

  orderStatuses(
    filters: AnalyticsFilters
  ): Promise<Array<{
    estado: string;
    cantidad: number;
    porcentaje: number;
  }>>;

  averageTicket(
    filters: AnalyticsFilters
  ): Promise<{
    totalIngresos: number;
    pedidosContabilizados: number;
    usuariosConPedidos: number;
    ticketPromedioPedido: number;
    ingresoPromedioPorUsuario: number;
  }>;
}
