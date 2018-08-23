import React from "react";
import { connect } from "react-redux";
import CurrencyRequestList from "./common/CurrencyRequestList";
import Time from "./common/Time";

export default class Home extends React.Component {
  // render
  render() {
    return (
      <div
        className="page-home"
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap"
        }}
      >
        <CurrencyRequestList />
      </div>
    );
  }
}
