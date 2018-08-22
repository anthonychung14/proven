import React from "react";
import { connect } from "react-redux";
import { ProgressBar } from "react-bootstrap";
import Menu from "./common/Menu";

import { fetchUser } from "../actions/questions";
import { getJobs } from "../selectors";
import "../stylesheets/main.scss";

// App component
export class App extends React.Component {
  // pre-render logic
  componentWillMount() {
    // the first time we load the app, we need that users list
    this.props.dispatch({ type: "USERS_FETCH_LIST" });
  }

  // render
  render() {
    // show the loading state while we wait for the app to load
    const { users, children } = this.props;
    if (!users.length) {
      return <ProgressBar active now={100} />;
    }

    // render
    return (
      <div className="container" style={{ width: "95%" }}>
        <div className="header">
          <img src="/media/logo.svg" />
          <span>
            <strong className="mfga">MFGA</strong>
          </span>
        </div>
        <div>
          <Menu />
        </div>
        <div style={{ paddingTop: "20px" }}>{children}</div>
      </div>
    );
  }
}

// export the connected class
function mapStateToProps(state) {
  return {
    jobs: getJobs(state),
    users: state.users || []
  };
}

export default connect(mapStateToProps)(App);
