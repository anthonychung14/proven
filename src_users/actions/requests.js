import { Map, fromJS } from "immutable";
import uuid from "uuid-v4";

import { createAction } from "redux-actions";
import actionTypes from "../action-types";

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

export const startTimeChannel = createAction(actionTypes.CREATE_CHANNEL);
export const clearRequests = createAction(actionTypes.CLEAR_REQUESTS);
export const stopTime = createAction(actionTypes.PAUSE);
export const addWorker = createAction(actionTypes.ADD_WORKER);
