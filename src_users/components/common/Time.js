import React from "react";
import Ring from "ringjs";

import { connect } from "react-redux";
import {
  TimeSeries,
  TimeRange,
  TimeEvent,
  Pipeline as pipeline,
  Stream,
  EventOut,
  avg,
  percentile
} from "pondjs";

import {
  ChartContainer,
  ChartRow,
  Charts,
  YAxis,
  ScatterChart,
  BarChart,
  Resizable,
  Legend,
  styler
} from "react-timeseries-charts";

import SliderProgress from "../../containers/SliderProgress";
import { getRequestsById } from "../../selectors";

const sec = 1000;
const minute = 60 * sec;
const hours = 60 * minute;
const rate = 100;

class Time extends React.Component {
  constructor() {
    super();
    this.state = {
      time: new Date(),
      events: new Ring(200),
      percentile90Out: new Ring(100)
      // resolvedEvents: new Ring(100)
    };

    this.getNewEvent.bind(this);
  }

  getNewEvent(t) {
    const { numCertain } = this.props;
    const base = Math.sin(t.getTime() / 10000000) * 10;
    const value = parseInt(base + numCertain - 7);
    return new TimeEvent(t, value);
  }

  componentDidMount() {
    this.stream = new Stream();

    pipeline()
      .from(this.stream)
      .windowBy("1s")
      .emitOn("discard")
      .aggregate({
        value: { value: percentile(90) }
      })
      .to(EventOut, event => {
        const events = this.state.percentile90Out;
        events.push(event);
        this.setState({ percentile90Out: events });
      });

    const increment = 200;
    this.interval = setInterval(() => {
      const t = new Date(this.state.time.getTime() + increment);
      const event = this.getNewEvent(t);

      // Raw events
      const newEvents = this.state.events;
      newEvents.push(event);
      this.setState({ time: t, events: newEvents });

      // Let our aggregators process the event
      this.stream.addEvent(event);
    }, rate);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const latestTime = `${this.state.time}`;

    const fiveMinuteStyle = {
      value: {
        normal: { fill: "#619F3A", opacity: 0.2 },
        highlight: { fill: "619F3A", opacity: 0.5 },
        selected: { fill: "619F3A", opacity: 0.5 }
      }
    };

    const scatterStyle = {
      value: {
        normal: {
          fill: "steelblue",
          opacity: 0.5
        }
      }
    };

    //
    // Create a TimeSeries for our raw, 5min and hourly events
    //

    const eventSeries = new TimeSeries({
      name: "raw",
      events: this.state.events.toArray()
    });
    const perc90Series = new TimeSeries({
      name: "five minute perc90",
      events: this.state.percentile90Out.toArray()
    });

    // const perc50Series = new TimeSeries({
    //   name: "average resolved events",
    //   events: this.state.resolvedEvents.toArray()
    // });

    // Timerange for the chart axis
    const initialBeginTime = new Date();
    const timeWindow = 4 * sec;

    let beginTime;
    const endTime = new Date(this.state.time.getTime() + 200);
    if (endTime.getTime() - timeWindow < initialBeginTime.getTime()) {
      beginTime = initialBeginTime;
    } else {
      beginTime = new Date(endTime.getTime() - timeWindow);
    }
    const timeRange = new TimeRange(beginTime, endTime);

    // Charts (after a certain amount of time, just show hourly rollup)
    const charts = (
      <Charts>
        <BarChart
          axis="y"
          series={perc90Series}
          style={fiveMinuteStyle}
          columns={["value"]}
        />
        <ScatterChart axis="y" series={eventSeries} style={scatterStyle} />
      </Charts>
    );

    const dateStyle = {
      fontSize: 12,
      color: "#AAA",
      borderWidth: 1,
      borderColor: "#F4F4F4"
    };

    const style = styler([
      { key: "avgConfirm", color: "#C5DCB7", width: 1, dashed: true },
      { key: "perc90", color: "#DFECD7", width: 2 }
    ]);

    return (
      <div style={{ width: "100%" }}>
        {this.props.showTrack && (
          <div className="row">
            <SliderProgress />
          </div>
        )}
        {this.props.showTrack && (
          <div className="row">
            <div className="col-md-12">
              <Resizable>
                <ChartContainer timeRange={timeRange}>
                  <ChartRow height="150">
                    <YAxis
                      id="y"
                      label="Requests"
                      min={0}
                      max={50}
                      width="70"
                      type="linear"
                    />
                    {charts}
                  </ChartRow>
                </ChartContainer>
              </Resizable>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-md-8">
            <span style={dateStyle}>{latestTime}</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    numCertain: getRequestsById(state).filter(
      req =>
        req.get("status") === "COMPLETE" ||
        req.get("status") === "ERROR" ||
        req.get("status") === "CANCELLED"
    ).size,
    showTrack: state.config.get("track"),
    showTime: state.config.get("timeTravel")
  };
};

export default connect(
  mapStateToProps,
  {}
)(Time);
<hr />;
