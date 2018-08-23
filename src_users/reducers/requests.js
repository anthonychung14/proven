import { OrderedMap, Map, OrderedSet, fromJS, Set, Record } from "immutable";
import uuid from "uuid-v4";
import Ring from "ringjs";

import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as formReducer } from "redux-form";

import config from "../config/currency-config";
import { getTime } from "../util";
import actionTypes from "../action-types";

import {
  getCurrenciesFromConfig,
  getFiatFromConfig,
  getPresentJobsFromJobState,
  getReqJobById
} from "../selectors";

export const Action = Record({
  historicAction: undefined,
  historicObject: undefined
});

const Snapshot = Record({
  id: undefined,
  creator: undefined,
  action: Action(),
  jobs: Map()
});

export const initialJobsState = fromJS({
  requestsById: OrderedMap(),
  requestsMounted: OrderedSet(),
  requestsCanceled: Set(),
  timeSeries: {
    time: new Date(),
    events: new Ring(200),
    percentile50Out: new Ring(100),
    percentile90Out: new Ring(100)
  }
});

const initialSnapshotState = Map({
  snaps: OrderedMap({
    HOME: initialJobsState
  }),
  present: "HOME"
});

const presentHasChanged = (present, past) => {
  const pres = present.get("requestsById");
  const pastRequests = past.get("requestsById");

  return pres.every(node => {
    const id = node.get("id");
    return !past.has(id) || pastRequests.get(id).equals(node);
  });
};

export const createCurrencyRequests = (state, action) => {
  const {
    payload: { requests, batchId }
  } = action;

  const newRequestsMounted = requests.reduce(
    (acc, curr) => acc.add(curr.get("id")),
    state.get("requestsMounted")
  );

  const newRequests = requests.reduce(
    (acc, curr) => acc.set(curr.get("id"), curr),
    state.get("requestsById")
  );

  return state
    .set("requestsById", newRequests)
    .set("requestsMounted", newRequestsMounted);
};

export const enqueueRequestData = (state, action) => {
  const requestsMounted = state.get("requestsMounted");
  const {
    payload: { requestId, batchId, timeEnqueued }
  } = action;

  return state
    .set("requestsMounted", requestsMounted.add(requestId))
    .set("batchProcessing", batchId)
    .setIn(["requestsById", requestId, "timeEnqueued"], timeEnqueued)
    .setIn(["requestsById", requestId, "status"], "ENQUEUED");
};

export const beginRequestData = (state, { payload: { id, timeStarted } }) => {
  return state
    .setIn(["requestsById", id, "timeStarted"], timeStarted)
    .setIn(["requestsById", id, "status"], "STARTED");
};

export const cancelRequestData = (state, { payload }) => {
  return state
    .setIn(["requestsById", payload, "timeComplete"], new Date())
    .setIn(["requestsById", payload, "status"], "CANCELLED")
    .set("requestsCanceled", state.get("requestsCanceled").add(payload));
};

export const resolveRequestData = (
  state,
  { payload: { id, timeComplete, price } }
) => {
  const request = state.getIn(["requestsById", id]);

  return state
    .setIn(["requestsById", id, "timeComplete"], timeComplete)
    .setIn(["requestsById", id, "status"], "COMPLETE")
    .setIn(["requestsById", id, "value"], price);
};

export const clearRequests = state => initialSnapshotState;

const messilyJumpOverTime = (state, action) => {
  // we expect to change the present key
  // as a result, the selectors will update the job map
  const snaps = state.get("snaps");
  return state.set("present", snaps.keySeq().get(action.payload));
};

const requests = (state = initialSnapshotState, action) => {
  const prevState = state;
  const prevJobState = getPresentJobsFromJobState(prevState);

  let presentJobState;
  switch (action.type) {
    case actionTypes.CREATE_REQUESTS:
      presentJobState = createCurrencyRequests(prevJobState, action);
      break;

    case actionTypes.ENQUEUE_REQUEST:
      presentJobState = enqueueRequestData(prevJobState, action);
      break;

    case actionTypes.START_REQUEST:
      presentJobState = beginRequestData(prevJobState, action);
      break;

    case actionTypes.COMPLETE_REQUEST:
      presentJobState = resolveRequestData(prevJobState, action);
      break;

    case actionTypes.CANCEL_REQUEST:
      presentJobState = cancelRequestData(prevJobState, action);
      break;

    case actionTypes.CLEAR_REQUESTS:
      return clearRequests(prevJobState);

    case actionTypes.TIME_JUMP:
      return messilyJumpOverTime(prevState, action);

    default:
      return prevState;
  }

  const nextSnapId = uuid();

  return presentHasChanged(presentJobState, prevJobState)
    ? state
        .setIn(["snaps", nextSnapId], presentJobState)
        .set("present", nextSnapId)
    : state;
};

export default requests;
