import { ApiChartResponseType, ChartDataType } from "../interfaces/app.interface";

export function createData(data: ApiChartResponseType): ChartDataType {
  return data.map(item => [new Date(item[0]), item[1]]);
}
