
import api from "./api";

export type FiltrosAnalitica = {
  desde?: string;
  hasta?: string;
};

export type PeriodoIngresos = "day" | "week" | "month";

export const analyticsService = {
  async obtenerProductosTop(
    limite: 5 | 10 = 5,
    filtros: FiltrosAnalitica = {}
  ) {
    const respuesta = await api.get(
      "/analytics/productos-top",
      {
        params: { limite, ...filtros },
      }
    );

    return respuesta.data;
  },

  async obtenerIngresos(
    periodo: PeriodoIngresos = "day",
    filtros: FiltrosAnalitica = {}
  ) {
    const respuesta = await api.get(
      "/analytics/ingresos",
      {
        params: { periodo, ...filtros },
      }
    );

    return respuesta.data;
  },

  async obtenerEstadosPedidos(
    filtros: FiltrosAnalitica = {}
  ) {
    const respuesta = await api.get(
      "/analytics/estados-pedidos",
      { params: filtros }
    );

    return respuesta.data;
  },

  async obtenerTicketPromedio(
    filtros: FiltrosAnalitica = {}
  ) {
    const respuesta = await api.get(
      "/analytics/ticket-promedio",
      { params: filtros }
    );

    return respuesta.data;
  },
};

