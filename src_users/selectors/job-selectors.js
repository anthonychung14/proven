import { createSelector } from "reselect";
import { Map, Set, fromJS, OrderedMap, OrderedSet } from "immutable";
import Ring from "ringjs";

import { initialJobsState } from "../reducers";

export const getJobs = state => state.jobs;

export const getSnapsFromJobState = jobs => jobs.get("snaps", initialJobsState);
export const getPresentKeyFromJobState = jobs => jobs.get("present", "HOME");

export const getCanceledJobsFromPresent = jobs =>
  jobs.get("requestsCanceled", Set());

export const getRequestsMountedFromPresent = jobs =>
  jobs.get("requestsMounted", Set());

export const getPresentJobsFromJobState = createSelector(
  [getSnapsFromJobState, getPresentKeyFromJobState],
  (snaps, key) => snaps.get(key)
);

export const getPresentRequestsMounted = createSelector(
  [getPresentJobsFromJobState],
  jobs => jobs.get("requestsById", Map())
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

export const getPresentJobs = createSelector(
  [getJobs],
  getPresentJobsFromJobState
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

export const getIsJobCanceled = (state, id) => getCanceledJobs(state).has(id);
export const getReqJobById = (state, id) =>
  getRequestsById(state).get(id, Map());
