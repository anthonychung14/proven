import React from "react";
import { connect } from "react-redux";
import { branch, compose, withHandlers, withProps } from "recompose";
import { Glyphicon, Button } from "react-bootstrap";

import { mapSnapsAndIndex } from "../mapState";
import { retryRequest, cancelRequest } from "../actions/requests";

const GenericButton = ({
  buttonClass,
  buttonLogo,
  buttonText,
  disabled,
  handleClick
}) => (
  <Button
    bsSize="small"
    className={buttonClass}
    onClick={handleClick}
    disabled={disabled}
    style={{ display: "flex", justifyContent: "space-between", width: "100%" }}
  >
    {buttonText}
    <Glyphicon glyph={buttonLogo} />
  </Button>
);

// GOTCHA: I fixed this by having withHandlers first
// previously, the second arg of branch (cancel enhancer) wasn't firing onClick
// you should def know the order of operations within the compose if you plan to chain
const RetryEnhancer = compose(
  withHandlers({
    handleClick: ({ retryRequest, id }) => _ => retryRequest(id)
  }),
  withProps(props => ({
    buttonClass: "user-delete",
    buttonLogo: "repeat",
    buttonText: "Retry",
    disabled: false
  }))
);

const CancelEnhancer = compose(
  withHandlers({
    handleClick: ({ cancelRequest, id }) => _ => cancelRequest(id)
  }),
  withProps(({ timeComplete, numActions, presentSnapIndex }) => ({
    buttonClass: "user-delete",
    buttonLogo: "remove-circle",
    buttonText: "Cancel",
    disabled: Boolean(timeComplete || presentSnapIndex !== numActions)
  }))
);

// const FeatureEnhancer = compose(
//   withHandlers({

//   }),
//   withProps(

//   )
// )

export default compose(
  connect(
    mapSnapsAndIndex,
    { retryRequest, cancelRequest }
  ),
  branch(({ status }) => status === "ERROR", RetryEnhancer, CancelEnhancer)
)(GenericButton);
