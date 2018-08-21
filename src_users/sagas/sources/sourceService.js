import uuid from "uuid-v4";
import { delay, buffers, channel } from "redux-saga";
import {
  actionChannel,
  all,
  call,
  fork,
  put,
  race,
  select,
  take
} from "redux-saga/effects";

import actionTypes from "../../action-types";
import { getCurrenciesFromConfig, getFiatFromConfig } from "../../selectors";

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
  const failChannel = yield channel(buffers.expanding(20));

  yield all([
    fork(watchForCreate, createChannel, enqueueChannel)
    // fork(watchFailedOrCanceled, failChannel)
  ]);
}

function* watchForCreate(createChannel, enqueueChannel) {
  const doneChannel = channel(buffers.expanding(20));

  while (true) {
    // we have to make sure that only one is being created at a time
    const {
      payload: { requests, batchId }
    } = yield take(createChannel);
    const requestIds = requests
      .map(i => i.get("id"))
      .toList()
      .toJS();

    // batchId -> [1,2,3,4,5]
    const batchTask = yield fork(createRequestWorkers, {
      enqueueChannel,
      doneChannel,
      batchId
    });

    const watchTask = yield fork(watchForBatchResolved, {
      requestIds,
      batchId
    });

    // Put each in a channel for workers to consume
    yield requestIds.map(request =>
      put({
        type: actionTypes.ENQUEUE_REQUEST,
        payload: {
          requestId: request,
          batchId,
          timeEnqueued: new Date()
        }
      })
    );

    // how do we know when we're done?
    yield take(actionTypes.BATCH_RESOLVED);
  }
}

// When a job is started
function* watchForBatchResolved({ requestIds, batchId }) {
  const numToBeResolved = requestIds.length;
  let numResolved = 0;

  while (numResolved < numToBeResolved) {
    yield take(actionTypes.COMPLETE_REQUEST);
    numResolved++;
  }

  yield put({
    type: actionTypes.BATCH_RESOLVED
  });
}
