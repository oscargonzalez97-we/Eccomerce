import type {
  AnalyticsRepository,
  AnalyticsFilters,
  Granularity,
} from "../../ports/AnalyticsRepository.js";

export class AnalyticsService {
  constructor(
    private readonly repository: AnalyticsRepository
  ) {}

  private validarFiltros(
    filters: AnalyticsFilters
  ): AnalyticsFilters {
    const validarFecha = (value?: string): void => {
      if (!value) return;

      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error("Las fechas deben tener formato YYYY-MM-DD");
      }

      const date = new Date(`${value}T00:00:00.000Z`);

      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== value
      ) {
        throw new Error(`Fecha inválida: ${value}`);
      }
    };

    validarFecha(filters.desde);
    validarFecha(filters.hasta);

    if (
      filters.desde &&
      filters.hasta &&
      filters.desde > filters.hasta
    ) {
      throw new Error("'desde' no puede ser posterior a 'hasta'");
    }

    return filters;
  }

  async resumenProductos(
    limit = 5,
    filters: AnalyticsFilters = {}
  ) {
    if (![5, 10].includes(limit)) {
      throw new Error("El límite debe ser 5 o 10");
    }

    return this.repository.topProducts(
      limit,
      this.validarFiltros(filters)
    );
  }

  async ingresos(
    granularity: Granularity = "day",
    filters: AnalyticsFilters = {}
  ) {
    if (!["day", "week", "month"].includes(granularity)) {
      throw new Error("El periodo debe ser day, week o month");
    }

    return this.repository.revenueTrend(
      granularity,
      this.validarFiltros(filters)
    );
  }

  async estadosPedidos(filters: AnalyticsFilters = {}) {
    return this.repository.orderStatuses(
      this.validarFiltros(filters)
    );
  }

  async ticketPromedio(filters: AnalyticsFilters = {}) {
    return this.repository.averageTicket(
      this.validarFiltros(filters)
    );
  }
}
