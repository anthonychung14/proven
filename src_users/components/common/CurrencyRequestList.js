import React from "react";
import { connect } from "react-redux";
import { Table, Pagination, ProgressBar } from "react-bootstrap";
import CurrencyListElement from "./CurrencyListElement";

import { createAction } from "redux-actions";
import actionTypes from "../../action-types";
import { changePage } from "../../routing-actions";
import { getRequestsById } from "../../selectors";

// User list component
class CurrencyRequestList extends React.Component {
  // constructor
  constructor(props) {
    super(props);

    // default ui local state
    this.state = {
      delete_show: false,
      delete_user: {}
    };

    // bind <this> to the event method
    this.showDelete = this.showDelete.bind(this);
    this.hideDelete = this.hideDelete.bind(this);
    this.userDelete = this.userDelete.bind(this);
  }

  // render
  render() {
    // pagination
    const { currencyRequests, page, numRequests, numEvents } = this.props;
    const per_page = 10;
    const pages = Math.ceil(currencyRequests.length / per_page);
    const start_offset = (page - 1) * per_page;
    let start_count = 0;

    const percent = parseInt((numEvents / numRequests) * 100);
    // show the list of users
    return (
      <div>
        <Table bordered hover responsive striped>
          <thead>
            <tr>
              <th>ID</th>
              <th>SYMBOL</th>
              <th>PRICE</th>
              <th>FIAT</th>
              <th>ENQUEUE</th>
              <th>STARTED</th>
              <th>RESOLVED</th>
              <th>STATUS</th>
              <th>CANCEL</th>
            </tr>
          </thead>
          <tbody>
            {currencyRequests.toList().map((currencyRequest, index) => {
              if (index >= start_offset && start_count < per_page) {
                start_count++;
                return (
                  <CurrencyListElement
                    key={index}
                    currencyRequestId={currencyRequest.get("id")}
                    showDelete={this.showDelete}
                  />
                );
              }
            })}
          </tbody>
        </Table>

        <Pagination
          className="users-pagination pull-right"
          bsSize="medium"
          maxButtons={10}
          first
          last
          next
          prev
          boundaryLinks
          items={pages}
          activePage={page}
          onSelect={this.props.changePage}
        />
      </div>
    );
  }

  // change the user lists' current page

  // show the delete user prompt
  showDelete(user) {
    // change the local ui state
    this.setState({
      delete_show: true,
      delete_user: user
    });
  }

  // hide the delete user prompt
  hideDelete() {
    // change the local ui state
    this.setState({
      delete_show: false,
      delete_user: {}
    });
  }

  // delete the user
  userDelete() {
    // delete the user
    this.props.dispatch({
      type: "USERS_DELETE",
      user_id: this.state.delete_user.id
    });

    // hide the prompt
    this.hideDelete();
  }
}

// export the connected class
function mapStateToProps(state) {
  return {
    currencyRequests: getRequestsById(state),
    numEvents: 0,
    numRequests: 10,

    // https://github.com/reactjs/react-router-redux#how-do-i-access-router-state-in-a-container-component
    // react-router-redux wants you to get the url data by passing the props through a million components instead of
    // reading it directly from the state, which is basically why you store the url data in the state (to have access to it)
    page: Number(state.routing.locationBeforeTransitions.query.page) || 1
  };
}

export default connect(
  mapStateToProps,
  {
    changePage
  }
)(CurrencyRequestList);