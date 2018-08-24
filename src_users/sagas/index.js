import { fork, takeLatest, all } from "redux-saga/effects";

import sourceService from "./sources/sourceService";
import timeService from "./timeService";

export function* sagas() {
  yield all([fork(sourceService), fork(timeService)]);
}
