import { Injectable } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
import { ApiChartResponseType, ChartDataType, IChartRequest } from "../interfaces/app.interface";
import { HttpClient, HttpParams } from "@angular/common/http";
import { createData } from "../utils/app.utils";

@Injectable({ providedIn: 'root' })
export class AppService {

  constructor(
    private readonly _http: HttpClient
  ){}

  public loadChartdata(request: IChartRequest): Observable<ChartDataType> {
    const httpParams = new HttpParams()
      .set('startDate', request.periodStart.toJSON())
      .set('endDate', request.periodEnd.toJSON())
      .set('step', request.step);

    return this._http.get<ApiChartResponseType>('/api/chartData', { params: httpParams }).pipe(
      map(res => createData(res)),
      catchError(() => []),
    )
  }
}
