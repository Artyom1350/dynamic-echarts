import * as echarts from 'echarts';
import { Observable } from 'rxjs';
import { ChartDataType, IChartDataZoomEvent } from '../interfaces/app.interface';

export class ChartBuilder {

  private echartsBuilder?: echarts.EChartsType;

  public get dataZoomEvent(): Observable<IChartDataZoomEvent> {
    return new Observable((observer) => {
      this.echartsBuilder?.on('dataZoom', () => {
        observer.next((this.echartsBuilder?.getOption() as any)['dataZoom']?.[0]);
      })
    })
  }

  constructor(el: HTMLElement){
    this.init(el)
  }

  public init(el: HTMLElement): void {
    this.echartsBuilder = echarts.init(el);
  }

  public setItems(data: ChartDataType): void {
    const options = this.createOptions(data);

    this.echartsBuilder?.setOption(options);
  }

  public updateData(data: ChartDataType): void {
    console.log(data);

    this.echartsBuilder?.setOption({
      //@ts-ignore
      series: this.createSeries(data),
    })
  }

  public createOptions(data: ChartDataType): any {
    return {
      xAxis: this.createXAxis(),
      yAxis: this.createYAxis(),
      grid: this.createGrid(),
      series: this.createSeries(data),
      dataZoom: this.createDataZoom(),
    }
  }

  public createDataZoom(): echarts.DataZoomComponentOption[] {
    return [
      {
        type: 'inside',
        xAxisIndex: 0,
      },
      {
        type: 'slider',
        xAxisIndex: 0,
      }
  ]
  }

  public createXAxis(): echarts.XAXisComponentOption[] {
    return [{
      type: 'time',
    }]
  }

  public createYAxis(): echarts.YAXisComponentOption[] {
    return [{
      type: 'value',
    }]
  }

  public createGrid(): echarts.GridComponentOption[] {
    return [
      {

      }
    ]
  }

  public createSeries(data: ChartDataType): echarts.LineSeriesOption[] {
    return [{
      type: 'line',
      data: data
    }]
  }
}
