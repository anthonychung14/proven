import { push } from "react-router-redux";

export const changePage = page => dispatch => {
  dispatch(push("/?page=" + page));
};
