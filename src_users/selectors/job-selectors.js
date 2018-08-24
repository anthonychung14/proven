import { createSelector } from "reselect";
import { Map, Set, fromJS, OrderedMap, OrderedSet, List } from "immutable";
import Ring from "ringjs";

import { initialJobsState } from "../reducers/requests";

export const getJobs = state => state.jobs;

export const getSnapsFromJobState = jobs => jobs.get("snaps", initialJobsState);
export const getPresentKeyFromJobState = jobs => jobs.get("present", "HOME");

export const getCanceledJobsFromPresent = jobs =>
  jobs.get("requestsCanceled", Set());

export const getRequestsMountedFromPresent = jobs =>
  jobs.get("requestsMounted", Set());

export const getCurrentBatchFromPresent = jobs => jobs.get("activeBatch");

export const getPresentJobsFromJobState = createSelector(
  [getSnapsFromJobState, getPresentKeyFromJobState],
  (snaps, key) => snaps.get(key)
);

export const getSnaps = createSelector([getJobs], getSnapsFromJobState);
export const getPresentKey = createSelector(
  [getJobs],
  getPresentKeyFromJobState
);

export const getPresentJobs = createSelector(
  [getSnaps, getPresentKey],
  (snaps, presentKey) => snaps.get(presentKey)
);

export const getBatches = createSelector([getPresentJobs], jobs =>
  jobs.get("batches").push(jobs.get("activeBatch"))
);

export const getPresentIndex = createSelector(
  [getSnaps, getPresentKey],
  (snaps, presentKey) => snaps.keySeq().indexOf(presentKey)
);

export const getRequestsById = createSelector([getPresentJobs], presentJobs =>
  presentJobs.get("requestsById")
);

export const getRequestsMounted = createSelector(
  [getPresentJobs],
  getRequestsMountedFromPresent
);

export const getCanceledJobs = createSelector(
  [getPresentJobs],
  getCanceledJobsFromPresent
);

export const getCurrentBatchId = createSelector(
  [getPresentJobs],
  getCurrentBatchFromPresent
);

export const getIsJobCanceled = (state, id) => getCanceledJobs(state).has(id);
export const getReqJobById = (state, id) =>
  getRequestsById(state).get(id, Map());

export const getCompletePercentStats = state => {
  // get the current batch id
  const currRequests = getRequestsById(state).size;

  const currComplete = getRequestsById(state).filter(
    request => request.get("status") === "COMPLETE"
  ).size;

  const currCancel = getRequestsById(state).filter(
    request => request.get("status") === "CANCELLED"
  ).size;

  const currErrors = getRequestsById(state).filter(
    request => request.get("status") === "ERROR"
  ).size;

  const nowDec = (currComplete / currRequests) * 100;
  const nowErrors = (currErrors / currRequests) * 100;
  const nowCancel = (currCancel / currRequests) * 100;

  const now = Math.round(nowDec * 10) / 10;
  const errors = Math.round((nowErrors * 10) / 10);
  const cancel = Math.round((nowCancel * 10) / 10);

  return {
    total: currRequests,
    numerator: now,
    errors,
    cancel
  };
};

export const isProcessing = createSelector([getJobs], jobs => {
  // if the present !== past, we're jumping
  if (
    jobs.get("present") !==
    jobs
      .get("snaps")
      .keySeq()
      .last()
  ) {
    return false;
  }

  return jobs
    .get("snaps")
    .last()
    .get("requestsById")
    .some(request => !request.get("timeComplete"));
});
// if the presentsnapShot is not the last one, we know we're traveling and it's cool

// export const makeBatchSelector = batchId => createSelector([getComple]);
