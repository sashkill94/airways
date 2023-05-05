import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AviasalesApiService } from './aviasales-api.service';
import moment from 'moment';
import { Store } from '@ngrx/store';
import { selectCurrencyFormat } from '../store/selectors/formats.selectors';
import { forkJoin, of, catchError, map, Observable } from 'rxjs';
import { ExtendedTicketInterface, TicketInterface } from '../models/ticket.models';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private currency$ = this.store.select(selectCurrencyFormat);

  private currencyLowerCase = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: AviasalesApiService,
    private store: Store,
  ) {
    this.currency$.subscribe((val) => {
      this.currencyLowerCase = val.toLocaleLowerCase();
    });
  }

  public getTicketsArray(): Observable<ExtendedTicketInterface[][]> {
    const params = this.route.snapshot.queryParams;

    if (params['type'] === 'round-trip') {
      return forkJoin([
        this.getRequestObservable(params, false),
        this.getRequestObservable(params, true),
      ]);
    }

    return forkJoin([this.getRequestObservable(params, false), of([])]);
  }

  private getRandomSeats(): number {
    const maxSeats = 100;
    const minSeats = 1;
    return Math.floor(Math.random() * (maxSeats - minSeats + 1)) + minSeats;
  }

  private getRequestObservable(
    params: Params,
    isBack: boolean,
  ): Observable<ExtendedTicketInterface[]> {
    let origin = params['origin'];
    let destination = params['destination'];
    let date = moment(params['departure'], 'MM-DD-YYYY');

    if (isBack) {
      //если билет возвратный то меняем местами origin и destination
      origin = params['destination'];
      destination = params['origin'];
      date = moment(params['arrival'], 'MM-DD-YYYY');
    }

    const monthToAdd = date.date() >= 15 ? 1 : -1; //if date is more than 15 then we'll request tickets for further month and vice versa
    const additionalMonthDeparture = date.clone().add(monthToAdd, 'months');

    const currentMonthTickets$ = this.apiService.getTicketsMapDyDate(
      origin,
      destination,
      date,
      this.currencyLowerCase,
    );

    const additionalMonthTickets$ = this.apiService.getTicketsMapDyDate(
      origin,
      destination,
      additionalMonthDeparture,
      this.currencyLowerCase,
    );

    return forkJoin([currentMonthTickets$, additionalMonthTickets$]).pipe(
      map((elem: TicketInterface[][]) => {
        const ticketsArray = elem.flat();
        const dateNow = moment.utc();
        const dateString = date.format('MM-DD-YYYY').toString();

        const ticketsWithAdditionalFields: ExtendedTicketInterface[] = ticketsArray.map(
          (item, index) => {
            const departureTicketString = moment(item.departure_at).format('MM-DD-YYYY').toString();
            const timeZone = moment.parseZone(item.departure_at).utcOffset() / 60;
            const dateTicket = moment.utc(item.departure_at);

            return {
              ...item,
              isActive: dateString === departureTicketString,
              index,
              utcOffset: `UTC${timeZone >= 0 ? `+${timeZone}` : timeZone}`,
              isOutdated: dateNow > dateTicket ? true : false,
              seats: this.getRandomSeats(),
              maxSeats: 100,
            };
          },
        );

        return ticketsWithAdditionalFields;
      }),
      catchError(() => {
        return of([]);
      }),
    );
  }
}
