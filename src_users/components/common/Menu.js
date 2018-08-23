import React from "react";
import { connect } from "react-redux";
import { Nav, NavItem, Glyphicon, Button, ButtonGroup } from "react-bootstrap";
import { IndexLinkContainer, LinkContainer } from "react-router-bootstrap";

import {
  addWorker,
  clearRequests,
  startRequests,
  startTimeChannel,
  stopTime
} from "../../actions/requests";

class Menu extends React.Component {
  render() {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ButtonGroup
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex"
          }}
        >
          <Button
            bsStyle="info"
            bsSize="small"
            onClick={() => {
              this.props.startRequests();
            }}
          >
            Create Requests
          </Button>
          <Button
            bsStyle="info"
            bsSize="small"
            onClick={() => {
              this.props.clearRequests();
            }}
          >
            Clear Requests
          </Button>
          <Button
            bsStyle="info"
            bsSize="small"
            onClick={() => {
              this.props.addWorker();
            }}
          >
            Increment Workers
          </Button>
          <Button
            bsStyle="info"
            bsSize="small"
            disabled
            onClick={() => {
              this.props.startRequests();
            }}
          >
            Start Chaos
          </Button>
          <Button
            bsStyle="info"
            bsSize="small"
            onClick={() => {
              this.props.startTimeChannel();
            }}
          >
            Start TimeChannel
          </Button>
          <Button
            bsStyle="info"
            bsSize="small"
            onClick={() => {
              this.props.stopTime();
            }}
          >
            Pause
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default connect(
  null,
  { addWorker, startRequests, startTimeChannel, clearRequests, stopTime }
)(Menu);

/* 
<LinkContainer to="/user-edit">
          <NavItem>
            Add User <Glyphicon glyph="plus-sign" />
          </NavItem>
        </LinkContainer>


        <div style={{ display: "flex" }}>
          <Nav bsStyle="pills">
            <IndexLinkContainer to="/">
              <NavItem>Home</NavItem>
            </IndexLinkContainer>
          </Nav>
          <Nav bsStyle="pills">
            <IndexLinkContainer to="/questions">
              <NavItem>Questions</NavItem>
            </IndexLinkContainer>
          </Nav>
          <Nav bsStyle="pills">
            <IndexLinkContainer to="/ask">
              <NavItem>Ask</NavItem>
            </IndexLinkContainer>
          </Nav>
        </div>
*/
