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
  stillProcessing
}) => {
  return (
    <div className="footer">
      <Slider
        max={max}
        onChange={handleChange}
        value={presentSnapIndex}
        disabled={stillProcessing}
        railStyle={{ color: "blue" }}
      />
      <h5>
        {presentSnapIndex} / {max} actions taken
      </h5>
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
