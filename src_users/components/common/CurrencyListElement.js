import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Button, Glyphicon } from "react-bootstrap";

import { createAction } from "redux-actions";
import {
  branch,
  withProps,
  compose,
  renderNothing,
  withHandlers
} from "recompose";

import actionTypes from "../../action-types";
import { getTime } from "../../util";
import { getReqJobById, getRequestsMounted } from "../../selectors";

// User List Element component
class CurrencyListElement extends React.Component {
  componentWillMount() {
    if (!this.props.inProcess) {
      this.props.makeRequest(this.props.id);
    }
  }

  // render
  render() {
    const {
      handleClickCancel,
      id,
      fiat,
      timeComplete,
      timeEnqueued,
      timeStarted,
      status,
      symbol,
      value
    } = this.props;
    return (
      <tr>
        <td>#{id.substring(0, 4)}</td>
        <td>{symbol}</td>
        <td>{value || 0}</td>
        <td>{fiat}</td>
        <td
        >{`${timeEnqueued.getHours()}: ${timeEnqueued.getMinutes()}: ${timeEnqueued.getSeconds()}`}</td>
        <td>
          {timeStarted
            ? ((timeStarted.getTime() - timeEnqueued.getTime()) / 1000).toFixed(
                2
              )
            : "..."}
        </td>
        <td>
          {timeComplete
            ? ((timeComplete.getTime() - timeStarted.getTime()) / 1000).toFixed(
                2
              )
            : "..."}
        </td>
        <td>{status}</td>
        <td>
          <Button
            bsSize="xsmall"
            className="user-delete"
            onClick={handleClickCancel}
            disabled={Boolean(timeComplete)}
          >
            Cancel <Glyphicon glyph="remove-circle" />
          </Button>
        </td>
      </tr>
    );
  }
}

const getHasBeenMounted = (state, id) => {
  if (getReqJobById) return getRequestsMounted(state).has(id);
};

export default compose(
  connect(
    (state, { currencyRequestId }) => ({
      currencyRequest: getReqJobById(state, currencyRequestId),
      inProcess: getHasBeenMounted(state, currencyRequestId)
    }),
    {
      cancelRequest: createAction(actionTypes.CANCEL_REQUEST)
    }
  ),
  withProps(({ currencyRequest }) => ({
    id: currencyRequest.get("id"),
    symbol: currencyRequest.get("symbol"),
    fiat: currencyRequest.get("fiat"),
    value: currencyRequest.get("value"),
    status: currencyRequest.get("status"),
    timeComplete: currencyRequest.get("timeComplete"),
    timeStarted: currencyRequest.get("timeStarted"),
    timeEnqueued: currencyRequest.get("timeEnqueued")
  })),
  withHandlers({
    handleClickCancel: ({ cancelRequest, id }) => _ => cancelRequest(id)
  })
)(CurrencyListElement);
