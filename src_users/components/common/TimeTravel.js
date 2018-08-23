import React from "react";
import { connect } from "react-redux";

import { getJobs } from "../../selectors";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const TimeTravel = ({ numActions: max }) => {
  return (
    <div>
      <h3>Time Travel is possible</h3>
      <Slider max={max} />
    </div>
  );
};

const mapStateToProps = state => ({
  numActions: getJobs(state).size || 1
});

export default connect(
  mapStateToProps,
  {}
)(TimeTravel);
