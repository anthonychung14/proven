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

export const getPresentRequestsById = createSelector(
  [getPresentJobsFromJobState],
  jobs => jobs.get("requestsById", Map())
);

export const getSnaps = createSelector([getJobs], getSnapsFromJobState);
export const getPresentKey = createSelector(
  [getJobs],
  getPresentKeyFromJobState
);

// don't think this works :l
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

export const getRequestsById = createSelector(
  [getJobs],
  getPresentRequestsById
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
    header: `${currRequests} in batch`,
    numerator: now,
    errors,
    cancel
  };
};

// export const makeBatchSelector = batchId => createSelector([getComple]);
