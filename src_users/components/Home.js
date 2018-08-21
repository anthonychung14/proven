import React from "react";
import { connect } from "react-redux";
import CurrencyRequestList from "./common/CurrencyRequestList";

// Home page component

const RequestReport = () => {};

export default class Home extends React.Component {
  // render
  render() {
    return (
      <div className="page-home">
        <CurrencyRequestList />
        <RequestReport />
      </div>
    );
  }
}
