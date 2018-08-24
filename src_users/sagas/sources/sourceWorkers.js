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
import {
  getReqJobById,
  getConfig,
  getIsJobCanceled,
  getHasChaosStarted
} from "../../selectors";

import { withRandomFailure } from "../epochs";

export function* createRequestWorkers({
  enqueueChannel,
  doneChannel,
  batchId
}) {
  const config = yield select(getConfig);
  const numWorkers = config.get("numWorkers");

  for (let i = 0; i < numWorkers; ++i) {
    yield fork(createWorker, enqueueChannel, i, doneChannel, batchId);
  }
}

const isRequestToKill = requestId => action =>
  action.type === actionTypes.START_REQUEST && action.payload.id === requestId;

const isCancellable = requestId => action =>
  action.type === actionTypes.CANCEL_REQUEST && action.payload === requestId;

const isSuccessful = requestId => action =>
  action.type === actionTypes.COMPLETE_REQUEST &&
  action.meta &&
  action.meta === requestId;

const hasErrored = requestId => action =>
  action.type === actionTypes.ERROR_REQUEST &&
  action.meta &&
  action.meta === requestId;

export function* createWorker(
  enqueueChannel,
  workerIndex,
  doneChannel,
  batchId
) {
  while (true) {
    const { payload } = yield take(enqueueChannel);
    yield call(delay, 500);
    const { requestId, batchId } = payload;

    if (yield select(getIsJobCanceled, requestId)) {
      yield put(doneChannel, { requestId, batchId });
      continue;
    }

    yield put({
      type: actionTypes.START_REQUEST,
      payload: { id: requestId, timeStarted: new Date() }
    });

    const subToSuccess = isSuccessful(requestId);
    const subToFailure = hasErrored(requestId);
    const subToCancel = isCancellable(requestId);

    const chaosStarted = yield select(getHasChaosStarted);
    const fetchTask = chaosStarted
      ? withRandomFailure(fetchCryptoTask, isRequestToKill, requestId)
      : fetchCryptoTask;

    const winner = yield race({
      task: fork(fetchTask, { requestId, batchId }),
      success: take(subToSuccess),
      failure: take(subToFailure),
      cancelJob: take(subToCancel)
    });

    const winnerKey = Object.keys(winner)[0]; // there can only be one
    const winnerPayload = winner[winnerKey];

    yield put(doneChannel, winnerPayload);
  }
}

export function* fetchCryptoTask({ requestId, batchId }) {
  try {
    const request = yield select(getReqJobById, requestId);
    const fiat = request.get("fiat");
    const symbol = request.get("symbol");

    const result = yield call(getResource, { fiat, symbol });
    const price = result[fiat];

    yield put({
      type: actionTypes.COMPLETE_REQUEST,
      payload: {
        id: requestId,
        timeComplete: new Date(),
        price
      },
      meta: requestId
    });
  } catch (error) {
    yield put({
      type: actionTypes.ERROR_REQUEST,
      payload: error,
      meta: requestId
    });
  }
}
