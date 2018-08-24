/* eslint-disable no-constant-condition */
import { take, all, fork, call, put, cancel, race } from "redux-saga/effects";

import actionTypes from "../action-types";

export function withRandomFailure(generator, actionSelector, requestId) {
  if (!actionSelector) throw new Error("Must include selector");
  function* randomFailure(selector, id, task) {
    try {
      while (true) {
        yield take(selector);
        const random = Math.random() < 0.3;

        if (random) {
          yield put({
            type: actionTypes.ERROR_REQUEST,
            payload: id,
            meta: id
          });

          break;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  return function* randomlyFail(...args) {
    try {
      const task = yield;
      yield race({
        task: call(generator, ...args),
        fail: call(randomFailure, actionSelector, requestId)
      });
    } catch (error) {
      throw error;
    }
  };
}
