import { createSelector } from "reselect";
import { Map, Set } from "immutable";

export const getJobs = state => state.jobs;

export const getRequestsById = createSelector([getJobs], jobs =>
  jobs.get("requestsById", Map())
);

export const getReqJobById = (state, id) =>
  getRequestsById(state).get(id, Map());

export const getRequestsMounted = createSelector([getJobs], jobs =>
  jobs.get("requestsMounted", Set())
);

export const getCanceledJobs = createSelector([getJobs], jobs =>
  jobs.get("requestsCanceled", Set())
);

export const getIsJobCanceled = (state, id) => getCanceledJobs(state).has(id);
