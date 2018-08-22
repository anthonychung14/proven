/* 
    I take some job and report on the progress
    I affect some reducer node in the store
        Right now, I affect my assigned ID of row data
*/
import { delay } from "redux-saga";
import { call, fork, put, select, take, race } from "redux-saga/effects";
import { fromJS } from "immutable";

import { getResource } from "../../api/util";
import actionTypes from "../../action-types";
import { getReqJobById, getConfig, getIsJobCanceled } from "../../selectors";

export function* createRequestWorkers({
  enqueueChannel,
  doneChannel,
  batchId
}) {
  const config = yield select(getConfig);
  const numWorkers = config.get("numWorkers");
  const workers = [];

  for (let i = 0; i < numWorkers; ++i) {
    workers[i] = yield fork(
      createWorker,
      enqueueChannel,
      i,
      doneChannel,
      batchId
    );
  }
}

const isCancellable = requestId => action =>
  action.type === actionTypes.CANCEL_REQUEST && action.payload === requestId;

export function* createWorker(
  enqueueChannel,
  workerIndex,
  doneChannel,
  batchId
) {
  while (true) {
    const { payload } = yield take(enqueueChannel);
    yield call(delay, 1000);
    const { requestId, batchId } = payload;

    if (yield select(getIsJobCanceled, requestId)) {
      console.log("canceled job");
      yield put(doneChannel, { requestId, batchId });
      continue;
    }

    const { task, cancelJob } = yield race({
      task: call(fetchCryptoTask, { requestId, batchId }),
      cancelJob: take(isCancellable(requestId))
    });

    if (task) {
      yield put({
        type: actionTypes.COMPLETE_REQUEST,
        payload: {
          id: requestId,
          timeComplete: new Date(),
          price: task
        }
      });
      yield put(doneChannel, task);
    }

    if (cancelJob) {
      console.log("job is canceled");
      yield put(doneChannel, payload);
    }
  }
}

export function* fetchCryptoTask({ requestId, batchId }) {
  let res;
  try {
    // always transform immediately upon getting result
    yield put({
      type: actionTypes.START_REQUEST,
      payload: { id: requestId, timeStarted: new Date() }
    });
    const request = yield select(getReqJobById, requestId);
    const fiat = request.get("fiat");
    const symbol = request.get("symbol");
    const result = yield call(getResource, { fiat, symbol });
    const price = result[fiat];

    res = price;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    return res;
  }
}
