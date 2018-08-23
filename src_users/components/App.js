import React from "react";
import { connect } from "react-redux";
import { ProgressBar } from "react-bootstrap";
import Menu from "./common/Menu";

import { fetchUser } from "../actions/questions";
import "../stylesheets/main.scss";

import TimeTravel from "./common/TimeTravel";

const Header = () => (
  <div className="header">
    <img src="/media/logo.svg" />
    <span>
      <strong className="mfga">MFGA</strong>
    </span>
  </div>
);

const FeatureMenu = () => (
  <div>
    <Menu />
  </div>
);

// App component
export class App extends React.Component {
  // pre-render logic
  componentWillMount() {
    // the first time we load the app, we need that users list
    // this.props.dispatch({ type: "USERS_FETCH_LIST" });
  }

  // render
  render() {
    // show the loading state while we wait for the app to load
    const { children } = this.props;
    // if (!users.length) {
    //   return <ProgressBar active now={100} />;
    // }

    // render
    return (
      <div className="container" style={{ width: "95%" }}>
        <Header />
        <FeatureMenu />
        <div style={{ paddingTop: "20px" }}>{children}</div>
        <TimeTravel />
      </div>
    );
  }
}

// export the connected class
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(App);
