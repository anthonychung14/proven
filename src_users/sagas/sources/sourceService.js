import uuid from "uuid-v4";
import { Map, fromJS } from "immutable";
import { delay, buffers, channel, END, eventChannel } from "redux-saga";
import {
  actionChannel,
  all,
  cancel,
  call,
  fork,
  flush,
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
  getRequestsById,
  getCanceledJobs,
  getIsJobCanceled
} from "../../selectors";

import { createRequestWorkers } from "./sourceWorkers";
import { keyBy } from "../../actions/requests";

export default function* sourceService() {
  const createChannel = yield actionChannel(
    actionTypes.CREATE_REQUESTS,
    buffers.expanding(20)
  );

  const enqueueChannel = yield actionChannel(
    actionTypes.ENQUEUE_REQUEST,
    buffers.expanding(20)
  );

  const retryChannel = yield actionChannel(
    actionTypes.RETRY_REQUEST,
    buffers.expanding(20)
  );

  const completeChannel = yield actionChannel(
    actionTypes.COMPLETE_BATCH,
    buffers.expanding(20)
  );

  // take from the failChannel,
  // feed all failed/canceled into retry
  const unresolvedChannel = yield channel(buffers.expanding(20));

  yield all([
    fork(watchForRetry, retryChannel),
    fork(watchForCreate, createChannel, enqueueChannel, completeChannel)
  ]);
}

function* watchForRetry(retryChannel) {
  while (true) {
    const action = yield take(retryChannel);
    yield call(delay, 1000);
    const rest = yield flush(retryChannel);
    const batchId = uuid();

    // I think this should go in the reducer tbh
    const presentJobs = yield select(getRequestsById);

    const retryRequests = keyBy(
      fromJS(rest.concat(action).map(({ payload }) => payload))
        .toMap()
        .map(id =>
          Map({
            id,
            timeEnqueued: null,
            timeStarted: null,
            timeComplete: null,
            value: null
          })
        ),
      "id"
    );

    const stateRequests = retryRequests.map(r => presentJobs.get(r.get("id")));
    const mergedRequests = retryRequests.merge(stateRequests);

    yield put({
      type: actionTypes.CREATE_REQUESTS,
      payload: {
        requests: mergedRequests,
        batchId
      }
    });
  }
}

function* watchForCreate(createChannel, enqueueChannel, completeChannel) {
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

    const { pause, resolved, cancelled } = yield race({
      pause: take(actionTypes.PAUSE),
      resolved: take(completeChannel),
      cancelled: take(actionTypes.CANCEL_BATCH)
    });

    if (pause) {
      yield take(actionTypes.START_AGAIN);
    } else {
      // yield cancel(watchTask);
      // yield cancel(batchTask);
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
