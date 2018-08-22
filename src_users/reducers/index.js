import { OrderedMap, Map, OrderedSet, fromJS, Set } from "immutable";
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
  getReqJobById
} from "../selectors";

import actionTypes from "../action-types";
import { startRequest, resolveRequest, failRequest } from "./currencyRequests";

const initialJobsState = fromJS({
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

const sources = (state = Map(), action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const createCurrencyRequests = (state, action) => {
  const {
    payload: { requests, batchId }
  } = action;

  const orderedSet = requests.reduce(
    (acc, curr) => acc.add(curr.get("id")),
    state.get("requestsMounted")
  );

  const oldRequests = state.get("requestsById");

  const newRequests = requests.reduce(
    (acc, curr) => acc.set(curr.get("id"), curr),
    oldRequests
  );

  return state
    .set("requestsById", newRequests)
    .set("requestsMounted", orderedSet);
};

const getRequestsMonted = state => {
  return state.get("requestsMounted", OrderedSet());
};

const enqueueRequestData = (state, action) => {
  const requestsMounted = getRequestsMonted(state);
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

const jobs = (state = initialJobsState, action) => {
  switch (action.type) {
    // creates a batch of jobs
    case actionTypes.CREATE_REQUESTS:
      return createCurrencyRequests(state, action);

    // takes the create_batch from the channel (supervisor)
    // supervisor selects and forks a configurable number of workersa
    case actionTypes.ENQUEUE_REQUEST:
      return enqueueRequestData(state, action);

    // Worker starts the request
    case actionTypes.START_REQUEST:
      return beginRequestData(state, action);
    case actionTypes.COMPLETE_REQUEST:
      return resolveRequestData(state, action);

    case actionTypes.CANCEL_REQUEST:
      return cancelRequestData(state, action);

    case actionTypes.CLEAR_REQUESTS:
      return clearRequests(state);
    default:
      return state;
  }
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
  sources,
  jobs,
  config: configReducer
});
