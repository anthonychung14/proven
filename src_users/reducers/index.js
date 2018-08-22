import { OrderedMap, Map, OrderedSet, fromJS, Set, Record } from "immutable";
import uuid from "uuid-v4";
import Ring from "ringjs";

import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as formReducer } from "redux-form";
import users from "./users";

import config from "../config/currency-config";
import { getTime } from "../util";
import {
  getCurrenciesFromConfig,
  getFiatFromConfig,
  getPresentJobsFromJobState,
  getReqJobById
} from "../selectors";

import actionTypes from "../action-types";
import { startRequest, resolveRequest, failRequest } from "./currencyRequests";

export const Action = Record({
  historicAction: undefined,
  historicObject: undefined
});

export const Snapshot = Record({
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

const createCurrencyRequests = (state, action) => {
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

const enqueueRequestData = (state, action) => {
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

const beginRequestData = (state, { payload: { id, timeStarted } }) => {
  return state
    .setIn(["requestsById", id, "timeStarted"], timeStarted)
    .setIn(["requestsById", id, "status"], "STARTED");
};

const cancelRequestData = (state, { payload }) => {
  return state
    .setIn(["requestsById", payload, "timeComplete"], new Date())
    .setIn(["requestsById", payload, "status"], "CANCELLED")
    .set("requestsCanceled", state.get("requestsCanceled").add(payload));
};

const resolveRequestData = (
  state,
  { payload: { id, timeComplete, price } }
) => {
  const request = state.getIn(["requestsById", id]);

  return state
    .setIn(["requestsById", id, "timeComplete"], timeComplete)
    .setIn(["requestsById", id, "status"], "COMPLETE")
    .setIn(["requestsById", id, "value"], price);
};

const clearRequests = state => initialJobsState;

const jobs = (state = initialSnapshotState, action) => {
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
      presentJobState = clearRequests(prevJobState);
      break;

    default:
      presentJobState = prevJobState;
  }

  const nextSnapId = uuid();

  return presentHasChanged(presentJobState, prevJobState)
    ? state
        .setIn(["snaps", nextSnapId], presentJobState)
        .set("present", nextSnapId)
    : state;
};

const presentHasChanged = (present, past) => {
  const pres = present.get("requestsById");
  const pastRequests = past.get("requestsById");

  return pres.every(node => {
    const id = node.get("id");
    return !past.has(id) || pastRequests.get(id).equals(node);
  });
};

const configReducer = (state = fromJS(config), action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// main reducers
export const reducers = combineReducers({
  routing: routerReducer,
  form: formReducer.plugin({
    user_edit: (state, action) => {
      // reset form (wipe state) when navigating away from the User edit page
      switch (action.type) {
        case "@@router/LOCATION_CHANGE":
          return undefined;
        default:
          return state;
      }
    }
  }),
  users,
  jobs,
  config: configReducer
});
