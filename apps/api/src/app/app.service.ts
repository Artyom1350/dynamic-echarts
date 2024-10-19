import { Injectable } from '@nestjs/common';
import { map, Observable, of, takeWhile, tap, timer } from 'rxjs';
import { IChartRequest } from './core/interfaces/app.interface';

@Injectable()
export class AppService {
  public data = new Map<number, number | null>();

  constructor(){
    this.init();
  }

  public init(): void {
    this._generateRandomData().subscribe(() => {
      console.log(`Сгенерировано ${this.data.size} элементов`)
    })
  }

  public getChartData(request: IChartRequest): Observable<Array<[Date, number | null]>> {
    return new Observable((observer) => {
      const data: Array<[Date, number | null]> = [];
      const step = request.step * 1000;

      let startDate = request.startDate.getTime();
      let index = 0;

      const fakeData = Array.from(this.data);

      timer(0, 1).pipe(
        tap(() => {
          for(let i = 0; i < 100; i++) {
            const res = fakeData.filter(item => item[0] > startDate && item[0] < startDate + step);
            startDate = startDate + step;

            if(res?.[0] != undefined) {
              data.push([new Date(startDate), res?.[0]?.[1] as number | null]);
            }
            else {
              data.push([new Date(startDate), data?.[index - 1]?.[1] ?? null]);
            }
            index++;

            if(startDate > request.endDate.getTime()) {
              break;
            }
          }
        }),
        takeWhile(() => startDate < request.endDate.getTime())
      ).subscribe({
        complete: () => {
          observer.next(data);
          observer.complete()
        }
      })
    })
  }

  private _generateRandomData(): Observable<boolean> {
    return new Observable((observer) => {
      let startDate = new Date(2024, 9, 1).getTime();
      let index = 0;

      timer(0, 1).pipe(
        map(() => {
          for(let i = 0; i < 1000; i++) {
            this.data.set(startDate, this.randomIntFromInterval());
            startDate+= 30 * 1000;
            index++;
          }
        }),
        takeWhile(() => index < 1000000)
      ).subscribe({
        complete: () => {
          observer.next(true);
          observer.complete();
        }
      })
    })
  }

  public randomIntFromInterval() {
    return Math.floor(Math.random() * (10 - 2 + 1) + 2);
  }
}
