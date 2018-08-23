import { fork, takeLatest, all } from "redux-saga/effects";

import sourceService from "./sources/sourceService";

export function* sagas() {
  yield all([fork(sourceService)]);
}
