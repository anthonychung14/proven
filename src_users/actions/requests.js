import { Map, fromJS } from "immutable";
import uuid from "uuid-v4";

import { createAction } from "redux-actions";
import actionTypes from "../action-types";
import { getRequestsById } from "../selectors";

const initCurrencyRequest = ({ currency, fiat }) =>
  Map({
    id: uuid(),
    symbol: currency,
    timeEnqueued: null,
    timeStarted: null,
    timeComplete: null,
    fiat,
    value: null,
    status: "CREATED"
  });

export const keyBy = (items, key) =>
  items.reduce((keyed, item) => keyed.set(item.get(key), item), Map());

export const startRequests = () => (dispatch, getState) => {
  const state = getState();
  const { currencies, fiats } = state.config.toJS();
  const batchId = uuid();

  const requests = keyBy(
    fromJS(currencies)
      .map(currency =>
        fromJS(fiats).map(fiat => initCurrencyRequest({ currency, fiat }))
      )
      .flatten(1),
    "id"
  ).map(i => i.set("batchId", batchId));

  dispatch({
    type: actionTypes.CREATE_REQUESTS,
    payload: { requests, batchId }
  });
};

/* 
  This has to do some stuff with the request
  Mostly for reusability's sake
*/
// export const retryRequest = id => (dispatch, getState) => {
//   const state = getState();
//   const batchId = getRequestsById(state);

//   dispatch({
//     type: actionTypes.ENQUEUE_REQUEST,
//     payload: {
//       requestId: id,
//       batchId,
//       timeEnqueued: new Date()
//     }
//   });
// };

/* 
  After some thought, I think it's unnecessary
  Combining event data and state can be done within the handler
  Now, we have a 1:1 relationship between actionTypes and their respective actions
    less abstraction in a structure that doesn't behoove side-effect handling
*/

// These go straight from the reducer
export const startTimeChannel = createAction(actionTypes.CREATE_CHANNEL);
export const clearRequests = createAction(actionTypes.CLEAR_REQUESTS);
export const stopTime = createAction(actionTypes.PAUSE);
export const addWorker = createAction(actionTypes.ADD_WORKER);
export const timeJump = createAction(actionTypes.TIME_JUMP);
export const timeRequest = createAction(actionTypes.TIME_REQUEST);
export const cancelRequest = createAction(actionTypes.CANCEL_REQUEST);
export const startChaos = createAction(actionTypes.START_CHAOS);
export const retryRequest = createAction(actionTypes.RETRY_REQUEST);
