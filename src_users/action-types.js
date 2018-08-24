const actionTypes = Object.freeze({
  ADD_WORKER: "ADD_WORKER",
  ANSWER_QUESTION: "ANSWER_QUESTION",
  BEGIN_REQUEST: "BEGIN_REQUEST",
  CANCEL_BATCH: "CANCEL_BATCH",
  CANCEL_REQUEST: "CANCEL_REQUEST",
  CLEAR_REQUESTS: "CLEAR_REQUESTS",
  COMPLETE_BATCH: "COMPLETE_BATCH",
  COMPLETE_REQUEST: "COMPLETE_REQUEST",
  CREATE_CHANNEL: "CREATE_CHANNEL",
  CREATE_REQUESTS: "CREATE_REQUESTS",
  ENQUEUE_REQUEST: "ENQUEUE_REQUEST",
  ERROR_REQUEST: "ERROR_REQUEST",
  GOT_ANSWERS: "GOT_ANSWERS",
  GOT_QUESTIONS: "GOT_QUESTIONS",
  FAIL: "FAIL",
  GOOD: "GOOD",
  INCOMPLETE: "INCOMPLETE",
  PAUSE: "PAUSE",
  RETRY_REQUEST: "RETRY_REQUEST",
  START_AGAIN: "START_AGAIN",
  START_CHAOS: "START_CHAOS",
  START_REQUEST: "START_REQUEST",
  TIME_JUMP: "TIME_JUMP",
  TIME_REQUEST: "TIME_REQUEST",
  WARN: "WARN"
});

export default actionTypes;
