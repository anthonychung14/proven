import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";

import { getSnaps, getPresentIndex } from "../../selectors";
import { timeRequest } from "../../actions/requests";
import { mapSnapsAndIndex } from "../../mapState";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const TimeTravel = ({
  numActions: max,
  handleChange,
  presentSnapIndex,
  disabledSlider
}) => {
  return (
    <div className="footer">
      <Slider
        max={max}
        onChange={handleChange}
        value={presentSnapIndex}
        disabled={disabledSlider}
        railStyle={{ color: "blue" }}
      />
      <h4>
        {presentSnapIndex} / {max} actions taken
      </h4>
      <h5>Time Travel {disabledSlider ? "is not" : "is"} available</h5>
    </div>
  );
};

export default compose(
  connect(
    mapSnapsAndIndex,
    {
      timeRequest
    }
  ),
  withHandlers({
    handleChange: ({ timeRequest }) => change => {
      timeRequest(change);
    }
  })
)(TimeTravel);
