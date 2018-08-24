import { delay } from "redux-saga";
import { all, put, call, takeLatest } from "redux-saga/effects";

import actionTypes from "../action-types";

function* performJump({ payload }) {
  // yield call(delay, 200);
  yield put({
    type: actionTypes.TIME_JUMP,
    payload
  });
}

function makeTimeChannel() {
  const timeChannel = eventChannel(emitter => {
    const timeEmitter = setInterval(() => {
      emitter({ time: new Date() });
    }, 500);
    // The subscriber must return an unsubscribe function
    return () => {
      timeEmitter();
    };
  });

  return { timeChannel };
}

function* watchTimeChannel() {
  const { timeChannel } = makeTimeChannel();
  while (true) {
    const { time } = yield take(timeChannel);
    yield put({
      type: actionTypes.EMIT_TIME,
      payload: { time }
    });
  }
}

export default function* timeService() {
  yield all([
    takeLatest(actionTypes.TIME_REQUEST, performJump),
    takeLatest(actionTypes.CREATE_CHANNEL, watchTimeChannel)
  ]);
}
