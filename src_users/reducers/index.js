import { OrderedMap, Map, OrderedSet, fromJS, Set, Record } from "immutable";
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

export const Action = Record({
  historicAction: undefined,
  historicObject: undefined
});

const presentHasChanged = (present, past) => {
  const pres = present.get("requestsById");
  const pastRequests = past.get("requestsById");

  return pres.every(node => {
    const id = node.get("id");
    return !past.has(id) || pastRequests.get(id).equals(node);
  });
};

const addWorker = state => {
  const next = state.get("numWorkers") + 1;
  return next < 4 ? state.set("numWorkers", next) : 4;
};

const configReducer = (state = fromJS(config), action) => {
  switch (action.type) {
    case actionTypes.ADD_WORKER:
      return addWorker(state);
    default:
      return state;
  }
};

// const rootReducers = {
//   routing: routerReducer,
//   form: formReducer.plugin({
//     user_edit: (state, action) => {
//       // reset form (wipe state) when navigating away from the User edit page
//       switch (action.type) {
//         case "@@router/LOCATION_CHANGE":
//           return undefined;
//         default:
//           return state;
//       }
//     }
//   }),
//   jobs: requestReducer,
//   config: configReducer
// };

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
  config: configReducer
});
