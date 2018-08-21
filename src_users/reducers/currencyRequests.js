export const startRequest = (state, action) => {
  const id = action.payload;
  const request = getRequestFromJobs(state, id);

  return state.setIn(["requestsById", id], request.set("status", "STARTED"));
};

export const resolveRequest = (state, action) => {};

export const failRequest = (state, action) => {};
