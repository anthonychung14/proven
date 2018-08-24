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

const SliderProgress = ({ denom, header, numerator, errors, cancel }) => (
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
    <h5>{header}</h5>
    <ProgressBar
      style={{
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        flexWrap: "wrap"
      }}
    >
      {numerator ? (
        <ProgressBar
          now={numerator - 0.5}
          label={`${numerator}% Success`}
          bsStyle="success"
        />
      ) : null}
      {errors ? (
        <ProgressBar
          now={errors - 0.5}
          label={`${errors}% Error`}
          bsStyle="danger"
        />
      ) : null}
      {cancel ? (
        <ProgressBar
          now={cancel - 0.5}
          label={`${cancel}% Error`}
          bsStyle="warning"
          id="last"
        />
      ) : null}
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
