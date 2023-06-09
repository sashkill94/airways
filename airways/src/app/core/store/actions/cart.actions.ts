import { createAction, props } from '@ngrx/store';
import { CartItemInterface, CartItemWithFlagInterface } from '../../models/cart.models';
import { CartActionTypes } from '../action-types/cart.action-types';

export const addToCartAction = createAction(
  CartActionTypes.ADD_TO_CART,
  props<{ item: CartItemInterface }>(),
);

export const addToCartSuccessAction = createAction(
  CartActionTypes.ADD_TO_CART_SUCCESS,
  props<{ items: CartItemWithFlagInterface[] }>(),
);
export const addToCartFailureAction = createAction(CartActionTypes.ADD_TO_CART_FAILURE);

export const removeFromCartAction = createAction(
  CartActionTypes.REMOVE_FROM_CART,
  props<{ item: CartItemWithFlagInterface; index: number }>(),
);

export const removeFromCartSuccessAction = createAction(
  CartActionTypes.REMOVE_FROM_CART_SUCCESS,
  props<{ items: CartItemWithFlagInterface[] }>(),
);

export const removeFromCartFailureAction = createAction(CartActionTypes.REMOVE_FROM_CART_FAILURE);

export const updateCartAction = createAction(CartActionTypes.UPDATE_CART);

export const updateCartSuccessAction = createAction(
  CartActionTypes.UPDATE_CART_SUCCESS,
  props<{ items: CartItemWithFlagInterface[] }>(),
);

export const updateCartFailureAction = createAction(CartActionTypes.UPDATE_CART_FAILURE);

export const updateCartItemByIndexAction = createAction(
  CartActionTypes.UPDATE_CART_ITEM_BY_INDEX,
  props<{ item: CartItemWithFlagInterface; index: number }>(),
);

export const toggleCartItemsActiveAction = createAction(
  CartActionTypes.TOGGLE_ALL_CART_ITEMS_ACTIVE,
  props<{ isActive: boolean }>(),
);
