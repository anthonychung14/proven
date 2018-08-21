import React from "react";
import CurrencyRequestList from "./common/CurrencyRequestList";

// Home page component
export default class Home extends React.Component {
  // render
  render() {
    return (
      <div className="page-home">
        <CurrencyRequestList />
      </div>
    );
  }
}
