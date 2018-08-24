import React from "react";
import { connect } from "react-redux";
import CurrencyRequestList from "./common/CurrencyRequestList";
import Time from "./common/Time";
import TimeTravel from "./common/TimeTravel";
import Menu from "./common/Menu";

export default class Home extends React.Component {
  // render
  render() {
    return (
      <div
        className="page-home"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flexWrap: "wrap",
          padding: "10px"
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around"
          }}
        >
          <div>
            <Menu />
            <CurrencyRequestList />
          </div>
          <Time />
        </div>
        <TimeTravel />
      </div>
    );
  }
}
