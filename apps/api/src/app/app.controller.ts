import { Controller, Get, Param, Query } from '@nestjs/common';

import { AppService } from './app.service';
import { Observable, of } from 'rxjs';
import { IChartRequest } from './core/interfaces/app.interface';
import { ChartRequestDto } from './core/dto/app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('chartData')
  public chartData(@Query() data: Partial<IChartRequest>): Observable<Array<[Date, number | null]>> {
    return this.appService.getChartData(new ChartRequestDto(data));
  }
}
