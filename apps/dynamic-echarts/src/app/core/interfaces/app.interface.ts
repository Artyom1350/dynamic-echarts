export interface IChartRequest {
  periodStart: Date,
  periodEnd: Date,
  step: number
}

export interface IChartDataZoomEvent {
  startValue: number,
  endValue: number
}

export type ChartResponseType<T> = Array<[T, number | null]>;

export type ApiChartResponseType = ChartResponseType<string>;

export type ChartDataType = ChartResponseType<Date>;
