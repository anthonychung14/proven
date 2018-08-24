import React from "react";
import { connect } from "react-redux";
import { Nav, NavItem, Glyphicon, Button, ButtonGroup } from "react-bootstrap";
import { IndexLinkContainer, LinkContainer } from "react-router-bootstrap";

import {
  addWorker,
  clearRequests,
  startChaos,
  startRequests,
  startTimeChannel,
  stopTime,
  toggleTimeTravel,
  toggleTrack
} from "../../actions/requests";

// I bet these buttons can be turned into enhancers
/*
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
            onClick={() => {
              this.props.startChaos();
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
        </ButtonGroup>
*/
class Menu extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          paddingBottom: "15px",
          padding: "10px"
        }}
      >
        <ButtonGroup
          style={{
            justifyContent: "center",
            display: "flex",
            flexWrap: "wrap",
            width: "100%"
          }}
          className="menu"
        >
          <Button
            bsStyle="info"
            style={{ padding: "5px" }}
            onClick={() => {
              this.props.startRequests();
            }}
          >
            <Glyphicon glyph={"plus"} />
            CREATE
          </Button>
          <Button
            bsStyle="info"
            style={{ padding: "5px" }}
            onClick={() => {
              this.props.clearRequests();
            }}
          >
            <Glyphicon glyph={"remove"} />
            CLEAR
          </Button>
          <Button
            bsStyle="info"
            style={{ padding: "5px" }}
            onClick={() => {
              this.props.toggleTimeTravel();
            }}
          >
            <Glyphicon glyph={"time"} />
            TIME
          </Button>
          <Button
            bsStyle="info"
            style={{ padding: "5px" }}
            onClick={() => {
              this.props.toggleTrack();
            }}
          >
            <Glyphicon glyph={"signal"} />
            TRACK
          </Button>
          <Button
            bsStyle="info"
            style={{ padding: "5px" }}
            onClick={() => {
              this.props.startChaos();
            }}
          >
            <Glyphicon glyph={"fire"} />
            CHAOS
          </Button>
          <Button
            bsStyle="info"
            style={{ padding: "5px" }}
            onClick={() => {
              this.props.startTimeChannel();
            }}
          >
            <Glyphicon glyph={"flash"} />
            REAL-TIME
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default connect(
  null,
  {
    addWorker,
    clearRequests,
    startChaos,
    startRequests,
    startTimeChannel,
    stopTime
  }
)(Menu);

/* 
      <LinkContainer to="/user-edit">a
          <NavItem>
            Add User <Glyphicon glyph="plus-sign" />
          </NavItem>
        </LinkContainer>


        <div style={{ display: "flex" }}>
          
          <Nav bsStyle="pills">a
            <IndexLinkContainer to="/ask">
              <NavItem>Ask</NavItem>
            </IndexLinkContainer>
          </Nav>
        </div>
*/
