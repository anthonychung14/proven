import { fork, takeLatest, all } from "redux-saga/effects";
import { usersFetchList, usersAddEdit, usersDelete } from "./users";

import sourceService from "./sources/sourceService";

export function* sagas() {
  yield all([
    fork(takeLatest, "USERS_FETCH_LIST", usersFetchList),
    fork(takeLatest, "USERS_ADD_EDIT", usersAddEdit),
    fork(takeLatest, "USERS_DELETE", usersDelete),
    fork(sourceService)
  ]);
}
