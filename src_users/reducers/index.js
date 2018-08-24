import { OrderedMap, Map, OrderedSet, fromJS, Set, List } from "immutable";
import uuid from "uuid-v4";
import Ring from "ringjs";

import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as formReducer } from "redux-form";

import config from "../config/currency-config";
import { getTime } from "../util";
import {
  getCurrenciesFromConfig,
  getFiatFromConfig,
  getPresentJobsFromJobState,
  getReqJobById
} from "../selectors";

import actionTypes from "../action-types";
import requestReducer from "./requests";

const addWorker = state => {
  const next = state.get("numWorkers") + 1;
  return next <= 4 ? state.set("numWorkers", next) : state;
};

const toggleChaos = state => state.set("chaos", !state.get("chaos"));
const toggleTime = state => state.set("time", !state.get("time"));
const toggleTrack = state => state.set("track", !state.get("track"));

const configReducer = (state = fromJS(config), action) => {
  switch (action.type) {
    case actionTypes.ADD_WORKER:
      return addWorker(state);
    case actionTypes.START_CHAOS:
      return toggleChaos(state);
    case actionTypes.TOGGLE_TIME:
      return toggleTime(state);
    case actionTypes.TOGGLE_TRACK:
      return toggleTrack(state);
    default:
      return state;
  }
};

const updateAnswers = (state = List(), action) =>
  console.log(action) || fromJS(action.payload).map(i => i.get("answer"));

const answers = (state = List(), action) => {
  switch (action.type) {
    case actionTypes.GOT_ANSWERS:
      debugger;
      return updateAnswers(state, action);
    default:
      return state;
  }
};

const questions = (state = List(), action) => {
  switch (action.type) {
    case actionTypes.GOT_QUESTIONS:
      debugger;
      return updateAnswers(state, action);
    default:
      return state;
  }
};

// reducers need to be split from original state
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
  jobs: requestReducer,
  config: configReducer,
  answers,
  questions
});
