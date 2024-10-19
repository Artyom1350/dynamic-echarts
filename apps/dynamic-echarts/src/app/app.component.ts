import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ChartBuilder } from './core/models/charts';
import { AppService } from './core/services/app.service';
import { Subscription, take, throttleTime } from 'rxjs';
import { IChartDataZoomEvent, IChartRequest } from './core/interfaces/app.interface';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [AppService]
})
export class AppComponent implements AfterViewInit {
    @ViewChild('chart') public set chart(val: ElementRef) {
      if(!this.chartBuilder) {
        this.chartBuilder = new ChartBuilder(val.nativeElement);
        this.chartBuilder.setItems([]);
      }
    }

    public chartBuilder?: ChartBuilder;
    public subscription: Subscription[] = [];

    constructor(
      private readonly _appService: AppService
    ){}

    public ngAfterViewInit(): void {
      this.subscribeChartBuilderDataZoom();
      this.loadChart({
        startValue: new Date(2024, 9, 1).getTime(),
        endValue: new Date(2024, 9, 20).getTime()
      })
    }

    public subscribeChartBuilderDataZoom(): void {
      if(this.chartBuilder) {
        this.subscription.push(
          this.chartBuilder?.dataZoomEvent.pipe(
            throttleTime(1000),
          ).subscribe(res => {
            this.loadChart(res);
          })
        )
      }
    }

    public loadChart(event: IChartDataZoomEvent): void {
      this._appService.loadChartdata(
        this.createIChartRequest(event)
      ).pipe(
        take(1)
      ).subscribe(
        res => this.chartBuilder?.updateData([
          [new Date(2024, 9, 1), null],
          ...res,
          [new Date(2024, 9, 20), null]
        ])
      )
    }

    public createIChartRequest(event: IChartDataZoomEvent): IChartRequest {
      const periodStart = new Date(event.startValue);
      periodStart.setSeconds(0);
      const periodEnd = new Date(event.endValue);
      periodEnd.setSeconds(0);

      return {
        periodStart,
        periodEnd,
        step: this.getStep(event.startValue, event.endValue),
      }
    }

    public getStep(periodStart: number, periodEnd: number): number {
      const deviation = periodEnd - periodStart

      if(deviation <= 1000 * 60 * 60) {
        return 30;
      }
      else if(deviation <= 1000 * 60 * 60 * 24 * 3) {
        return 60 * 60;
      }
      else if(deviation <= 1000 * 60 * 60 * 24 * 30) {
        return 60 * 60 * 24
      }
      else {
        return 3600 * 12 * 30;
      }
    }
}
