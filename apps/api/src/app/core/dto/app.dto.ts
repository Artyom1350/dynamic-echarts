import { IChartRequest } from "../interfaces/app.interface";

export class ChartRequestDto implements IChartRequest {

  public get startDate(): Date {
    return this._startDate;
  }

  public get endDate(): Date {
    return this._endDate;
  }

  public get step(): number {
    return this._step;
  }

  private _startDate = new Date();
  private _endDate = new Date();
  private _step = 30;

  constructor(data: Partial<IChartRequest>) {
    this._startDate = data.startDate ? new Date(data.startDate) : new Date();
    this._endDate = data.endDate ? new Date(data.endDate) : new Date();
    this._step = data.step ?? 30;
  }
}
