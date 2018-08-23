import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";

import { getSnaps, getPresentIndex } from "../../selectors";
import { timeJump } from "../../actions/requests";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const TimeTravel = ({ numActions: max, handleChange, presentSnapIndex }) => {
  return (
    <div>
      <h3>Time Travel is possible</h3>
      <Slider max={max} onChange={handleChange} value={presentSnapIndex} />
      <h4>
        Present: {presentSnapIndex} / {max}
      </h4>
    </div>
  );
};

const mapStateToProps = state => ({
  numActions: getSnaps(state).size - 1 || 1,
  presentSnapIndex: getPresentIndex(state)
});

export default compose(
  connect(
    mapStateToProps,
    {
      timeJump
    }
  ),
  withHandlers({
    handleChange: ({ timeJump }) => change => {
      timeJump(change);
    }
  })
)(TimeTravel);
