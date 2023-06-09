import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { DEFAULT_PASSENGERS } from 'src/app/modules/shared/constants/passenger.constants';
import { PassengersInterface } from 'src/app/modules/shared/models/passenger-types.models';
import { environment } from 'src/environments/environment';
import { AirportResponseInterface } from '../models/airport-response.interface';
import { OrderInterface } from '../models/order.models';
import { AutocompleteService } from './autocomplete.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private autoCompleteService: AutocompleteService) {}

  getOrderInformation(params: Params): Observable<OrderInterface> {
    const { origin, destination, departure, arrival, passengers, isRound } = params;
    const from$: Observable<AirportResponseInterface | null> =
      this.autoCompleteService.getAirportByCode(origin);
    const destination$: Observable<AirportResponseInterface | null> =
      this.autoCompleteService.getAirportByCode(destination);
    const departureDate = this.getDate(departure);
    const arrivalDate = this.getDate(arrival);
    const passengersObj = this.getPassengersObj(passengers);
    const isRoundValue = isRound ? isRound !== 'false' : true;
    const orderState$: Observable<OrderInterface> = forkJoin({
      origin: from$,
      destination: destination$,
      departure: of(departureDate),
      arrival: of(arrivalDate),
      passengers: of(passengersObj),
      isRound: of(Boolean(isRoundValue)),
    });
    return orderState$;
  }

  //FORMAT MM-DD-YYYY
  getDate(date: string): string | null {
    const parsedDate = Date.parse(date);
    return parsedDate ? new Date(parsedDate).toISOString() : null;
  }

  getPassengersObj(passengers: string): PassengersInterface {
    if (!passengers) return DEFAULT_PASSENGERS;
    const [adults, child, infant] = passengers.split(environment.paramDelimiter);
    return {
      adults: this.validatePassengerNumber(adults) ? parseInt(adults) : DEFAULT_PASSENGERS.adults,
      child: this.validatePassengerNumber(child) ? parseInt(child) : DEFAULT_PASSENGERS.child,
      infant: this.validatePassengerNumber(infant) ? parseInt(infant) : DEFAULT_PASSENGERS.infant,
    };
  }

  validatePassengerNumber(potentialNum: string): boolean {
    if (!potentialNum) return false;
    const result = parseInt(potentialNum);
    return !(isNaN(result) && result < 0);
  }
}
