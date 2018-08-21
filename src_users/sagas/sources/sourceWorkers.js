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
import { getReqJobById } from "../../selectors";

export function* createRequestWorkers({
  enqueueChannel,
  doneChannel,
  batchId
}) {
  const numWorkers = 3;
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
    yield call(delay, 600);

    const { requestId, batchId } = payload;
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

// export function* createSourceWorkers(
//   sourceChannel,
//   doneChannel,
//   jobId,
//   folderId
// ) {
//   const numWorkers = 5;
//   const workers = [];

//   for (let i = 0; i < numWorkers; ++i) {
//     workers[i] = yield fork(
//       workWorkWork,
//       sourceChannel,
//       i,
//       doneChannel,
//       folderId
//     );
//   }
// }

// export function* workWorkWork(
//   sourceChannel,
//   workerIndex,
//   doneChannel,
//   folderId
// ) {
//   while (true) {
//     const sourceData = yield take(sourceChannel);
//     const { id } = sourceData;

//     yield fork(
//       uploadJob,
//       { id, formData, assemblyStr, structuralNodeIds, mediaType, jobId },
//       workerIndex
//     );

//     const action = yield take(({ type, meta = {} }) => {
//       const {
//         workerIndex: currWorkerIndex = null,
//         jobId: currJobId = null
//       } = meta;
//       // subscribe to worker message that upload failed
//       return (
//         (type === actionTypes.COMPLETE || type === actionTypes.ERROR) &&
//         currWorkerIndex === workerIndex &&
//         currJobId === jobId
//       );
//     });

//     if (action.type === actionTypes.ERROR) {
//       yield put({
//         type: actionTypes.ERROR,
//         payload: { ...uploadData },
//         meta: { jobId, id, folderId }
//       });
//     }

//     const { payload, meta } = action;
//     yield put(doneChannel, { payload, meta });
//   }
// }
