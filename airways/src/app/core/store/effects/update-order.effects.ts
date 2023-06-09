import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { OrderInterface } from '../../models/order.models';
import { OrderService } from '../../services/order.service';
import { UrlParamsService } from '../../services/url-params.service';
import {
  swapAirportsAction,
  updateOrderAction,
  updateOrderAirportAction,
  updateOrderDateAction,
  updateOrderFailureAction,
  updateOrderPassengersAction,
  updateOrderSuccessAction,
  updateOrderTypeAction,
} from '../actions/order.actions';

@Injectable()
export class UpdateOrderEffect {
  updateOrder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateOrderAction),
      switchMap(({ params }) => {
        return this.orderService.getOrderInformation(params).pipe(
          map((order: OrderInterface) => {
            return updateOrderSuccessAction({ order });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            console.warn(errorResponse);
            return of(updateOrderFailureAction());
          }),
        );
      }),
    );
  });

  updateOrderOption$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          updateOrderAirportAction,
          updateOrderDateAction,
          updateOrderPassengersAction,
          updateOrderTypeAction,
        ),
        tap(({ param, data }) => {
          this.urlParamsService.addParam(param, data);
        }),
      );
    },
    { dispatch: false },
  );

  swapAirports$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(swapAirportsAction),
        tap(({ origin, destination }) => {
          this.urlParamsService.swapAirports(origin, destination);
        }),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private orderService: OrderService,
    private urlParamsService: UrlParamsService,
  ) {}
}
