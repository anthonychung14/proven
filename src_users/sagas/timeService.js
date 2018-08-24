import { delay } from "redux-saga";
import { put, call, takeLatest } from "redux-saga/effects";

import actionTypes from "../action-types";

function* performJump({ payload }) {
  // yield call(delay, 200);
  yield put({
    type: actionTypes.TIME_JUMP,
    payload
  });
}

export default function* timeService() {
  yield takeLatest(actionTypes.TIME_REQUEST, performJump);
}
