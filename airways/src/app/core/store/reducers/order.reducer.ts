import { Action, createReducer, on } from '@ngrx/store';
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
import { OrderStateInterface } from '../store.models';

const initialState: OrderStateInterface = {
  origin: null,
  destination: null,
  departure: null,
  arrival: null,
  passengers: {
    adults: 1,
    child: 0,
    infant: 0,
  },
  isRound: true,
  isLoading: false,
};

const orderReducer = createReducer(
  initialState,
  on(
    updateOrderAction,
    (state): OrderStateInterface => ({
      ...state,
      isLoading: true,
    }),
  ),
  on(
    updateOrderSuccessAction,
    (state, action): OrderStateInterface => ({
      ...state,
      origin: action.order.origin,
      destination: action.order.destination,
      departure: action.order.departure,
      arrival: action.order.arrival,
      passengers: action.order.passengers,
      isRound: action.order.isRound,
      isLoading: false,
    }),
  ),
  on(
    updateOrderFailureAction,
    (state): OrderStateInterface => ({
      ...state,
      isLoading: false,
    }),
  ),
  on(updateOrderAirportAction, (state, action): OrderStateInterface => {
    const newState = { ...state };
    newState[action.param] = action.data;
    return newState;
  }),
  on(updateOrderDateAction, (state, action): OrderStateInterface => {
    const newState = { ...state };
    newState[action.param] = action.data;
    return newState;
  }),
  on(
    updateOrderPassengersAction,
    (state, action): OrderStateInterface => ({
      ...state,
      passengers: action.data,
    }),
  ),
  on(
    updateOrderTypeAction,
    (state, action): OrderStateInterface => ({
      ...state,
      isRound: action.data,
    }),
  ),
  on(
    swapAirportsAction,
    (state, action): OrderStateInterface => ({
      ...state,
      origin: action.destination,
      destination: action.origin,
    }),
  ),
);

export function reducer(state: OrderStateInterface, action: Action) {
  return orderReducer(state, action);
}
