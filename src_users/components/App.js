import React from "react";
import { connect } from "react-redux";
import { Nav, NavItem, Glyphicon } from "react-bootstrap";
import { IndexLinkContainer, LinkContainer } from "react-router-bootstrap";

import { fetchUser } from "../actions/questions";
import "../stylesheets/main.scss";

const Header = () => (
  <div className="header">
    <img src="/media/logo.svg" />
    <span>
      <strong className="mfga">MFGA</strong>
    </span>
  </div>
);

const Routes = () => (
  <Nav bsStyle="pills">
    <IndexLinkContainer to="/">
      <NavItem>Home</NavItem>
    </IndexLinkContainer>
    <LinkContainer to="/answer">
      <NavItem>
        Answer <Glyphicon glyph="plus-sign" />
      </NavItem>
    </LinkContainer>
  </Nav>
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
      <div
        className="container"
        style={{
          width: "95%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "flex-start"
        }}
      >
        <Header />
        <Routes />
        <div>{children}</div>
      </div>
    );
  }
}

// export the connected class
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(App);
