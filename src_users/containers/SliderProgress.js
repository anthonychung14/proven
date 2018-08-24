import React from "react";
import { ProgressBar } from "react-bootstrap";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { connect } from "react-redux";
import {
  compose,
  withHandlers,
  pure,
  branch,
  renderComponent
} from "recompose";

import {
  getSnaps,
  getPresentIndex,
  getCompletePercentStats
} from "../selectors";
import { timeRequest } from "../actions/requests";
import { mapSnapsAndIndex } from "../mapState";

const mapCompleteAndTotal = state => ({ ...getCompletePercentStats(state) });

const SliderProgress = ({ denom, total, numerator, errors, cancel }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-start",
      padding: "10px",
      alignItems: "center",
      border: "0.5px solid #f2f2f2",
      backgroundColor: "#E6FFE8",
      borderRadius: "10px",
      width: "100%"
    }}
  >
    <h4 style={{ padding: "10px", margin: "5px" }}>
      {total ? `${total} total` : "Waiting"}
    </h4>
    <ProgressBar
      style={{
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        flexWrap: "wrap"
      }}
    >
      <ProgressBar
        now={numerator ? numerator - 0.5 : 0}
        label={`${numerator}% Success`}
        bsStyle="success"
      />

      <ProgressBar
        now={errors ? errors - 0.5 : 0}
        label={`${errors}% Error`}
        bsStyle="danger"
      />

      <ProgressBar
        now={cancel ? cancel - 0.5 : 0}
        label={`${cancel}% canceled`}
        bsStyle="warning"
        id="last"
      />
    </ProgressBar>
  </div>
);

export default connect(
  state => ({
    ...mapCompleteAndTotal(state)
  }),
  {}
)(SliderProgress);

// const withTimeTravelProps
