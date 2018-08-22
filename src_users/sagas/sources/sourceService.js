import uuid from "uuid-v4";
import { delay, buffers, channel, END, eventChannel } from "redux-saga";
import {
  actionChannel,
  all,
  call,
  fork,
  put,
  race,
  select,
  take,
  takeLatest
} from "redux-saga/effects";

import actionTypes from "../../action-types";
import {
  getCurrenciesFromConfig,
  getFiatFromConfig,
  getCanceledJobs,
  getIsJobCanceled
} from "../../selectors";

import { createRequestWorkers } from "./sourceWorkers";

export default function* sourceService() {
  const createChannel = yield actionChannel(
    actionTypes.CREATE_REQUESTS,
    buffers.expanding(20)
  );

  const enqueueChannel = yield actionChannel(
    actionTypes.ENQUEUE_REQUEST,
    buffers.expanding(20)
  );

  // take from the failChannel,
  // feed all failed/canceled into retry
  const unresolvedChannel = yield channel(buffers.expanding(20));

  yield all([
    fork(watchForCreate, createChannel, enqueueChannel),
    takeLatest(actionTypes.CREATE_CHANNEL, watchTimeChannel)
    // fork(watchFailedOrCanceled, failChannel)
  ]);
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

function* watchForCreate(createChannel, enqueueChannel) {
  const doneChannel = channel(buffers.expanding(20));

  while (true) {
    // we have to make sure that only one is being created at a time
    const {
      payload: { requests, batchId }
    } = yield take(createChannel);

    const onlyIds = requests
      .map(i => i.get("id"))
      .toList()
      .toJS();

    const canceledJobs = yield select(getCanceledJobs);
    const requestIds = onlyIds.filter(
      requestId => !canceledJobs.has(requestId)
    );

    // before enqueuing, make sure that it hasn't been canceled yet

    // batchId -> [1,2,3,4,5]
    const batchTask = yield fork(createRequestWorkers, {
      enqueueChannel,
      doneChannel,
      batchId
    });

    const watchTask = yield fork(
      watchForBatchResolved,
      {
        requestIds,
        batchId
      },
      doneChannel
    );

    // Put each in a channel for workers to consume
    for (let i = 0; i < requestIds.length; i++) {
      const requestId = requestIds[i];
      const isCanceled = yield select(getIsJobCanceled, requestId);

      if (isCanceled) {
        yield put(doneChannel, { requestId });
        continue;
      }

      yield put({
        type: actionTypes.ENQUEUE_REQUEST,
        payload: {
          requestId: requestId,
          batchId,
          timeEnqueued: new Date()
        }
      });

      yield call(delay, 500);
    }

    const { pause, resolved, cancel } = yield race({
      pause: take(actionTypes.PAUSE),
      resolved: take(actionTypes.COMPLETE_BATCH),
      cancel: take(actionTypes.CANCEL_BATCH)
    });

    if (pause) {
      console.log("wait to start again");
      yield take(actionTypes.START_AGAIN);
    }
  }
}

// When a job is started
function* watchForBatchResolved({ requestIds, batchId }, doneChannel) {
  const numToBeResolved = requestIds.length;
  let numResolved = 0;

  while (numResolved < numToBeResolved) {
    const done = yield take(doneChannel);
    numResolved++;
  }

  yield put({
    type: actionTypes.COMPLETE_BATCH
  });
}
