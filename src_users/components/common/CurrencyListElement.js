import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Button } from "react-bootstrap";
import {
  branch,
  withProps,
  compose,
  renderNothing,
  withHandlers
} from "recompose";

// yeah it's a component + container :l
import ActionButton from "../../containers/ActionButton";

import actionTypes from "../../action-types";
import { getTime } from "../../util";
import { getReqJobById, getRequestsMounted } from "../../selectors";

class CurrencyListElement extends React.Component {
  getBackgroundColor(status) {
    const map = {
      CREATED: { backgroundColor: "#65F6FF" },
      ENQUEUED: { backgroundColor: "#DFECD7" },
      COMPLETE: { backgroundColor: "#7CE8C8" },
      STARTED: { backgroundColor: "#BABBFF" },
      ERROR: { backgroundColor: "#FFBAB9" },
      RETRYING: { backgroundColor: "#A9ABFF" },
      CANCELLED: { backgroundColor: "#FFFE7C" }
    };

    return map[status] || {};
  }

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
        <td>
          {timeEnqueued
            ? `${timeEnqueued.getHours()}:${timeEnqueued.getMinutes()}.${timeEnqueued.getSeconds()}`
            : "..."}
        </td>
        <td>
          {timeStarted && timeEnqueued
            ? ((timeStarted.getTime() - timeEnqueued.getTime()) / 1000).toFixed(
                2
              )
            : "..."}
        </td>
        <td>
          {timeComplete && timeStarted
            ? ((timeComplete.getTime() - timeStarted.getTime()) / 1000).toFixed(
                2
              )
            : "..."}
        </td>
        <td>{fiat}</td>
        <td>{value || "N/A"}</td>
        <td style={{ ...this.getBackgroundColor(status) }}>{status}</td>
        <td>
          <ActionButton id={id} timeComplete={timeComplete} status={status} />
        </td>
      </tr>
    );
  }
}

export default compose(
  connect(
    (state, { currencyRequestId }) => ({
      currencyRequest: getReqJobById(state, currencyRequestId)
    }),
    {}
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
  }))
)(CurrencyListElement);
