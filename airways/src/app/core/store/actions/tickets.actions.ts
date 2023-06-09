import { createAction, props } from '@ngrx/store';
import { TicketsActionTypes } from '../action-types/tickets.action-types';
import { ExtendedTicketInterface } from '../../models/ticket.models';
import { Params } from '@angular/router';

export const ticketsLoadAction = createAction(
  TicketsActionTypes.LOAD,
  props<{ params?: Params }>(),
);
export const ticketsLoadSuccessAction = createAction(
  TicketsActionTypes.LOAD_SUCCESS,
  props<{ data: ExtendedTicketInterface[]; dataBack: ExtendedTicketInterface[] }>(),
);
export const ticketsChangeActive = createAction(
  TicketsActionTypes.CHANGE_ACTIVE,
  props<{ index: number; isBack: boolean }>(),
);
export const ticketsLoadFailureAction = createAction(TicketsActionTypes.LOAD_FAILURE);
