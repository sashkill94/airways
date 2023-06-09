import { Params } from '@angular/router';
import { createAction, props } from '@ngrx/store';
import { PassengersInterface } from 'src/app/modules/shared/models/passenger-types.models';
import { OrderActionTypes } from '../action-types/order.action-types';
import { AirportResponseInterface } from '../../models/airport-response.interface';
import { OrderInterface } from '../../models/order.models';

export const updateOrderAction = createAction(
  OrderActionTypes.UPDATE_ORDER,
  props<{ params: Params }>(),
);
export const updateOrderSuccessAction = createAction(
  OrderActionTypes.UPDATE_ORDER_SUCCESS,
  props<{ order: OrderInterface }>(),
);

export const updateOrderAirportAction = createAction(
  OrderActionTypes.UPDATE_ORDER_AIRPORT,
  props<{ param: 'origin' | 'destination'; data: AirportResponseInterface | null }>(),
);

export const updateOrderDateAction = createAction(
  OrderActionTypes.UPDATE_ORDER_DATE,
  props<{ param: 'arrival' | 'departure'; data: string }>(),
);

export const updateOrderPassengersAction = createAction(
  OrderActionTypes.UPDATE_ORDER_PASSENGERS,
  props<{ param: 'passengers'; data: PassengersInterface }>(),
);

export const updateOrderTypeAction = createAction(
  OrderActionTypes.UPDATE_ORDER_TYPE,
  props<{ param: 'isRound'; data: boolean }>(),
);

export const swapAirportsAction = createAction(
  OrderActionTypes.SWAP_AIRPORTS,
  props<{ origin: AirportResponseInterface; destination: AirportResponseInterface }>(),
);

export const updateOrderFailureAction = createAction(OrderActionTypes.UPDATE_ORDER_FAILURE);
