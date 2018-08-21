import React from "react";
import { Router, Route, IndexRoute } from "react-router";
import { history } from "./store.js";
import App from "./components/App";
import Home from "./components/Home";
import UserEdit from "./components/UserEdit";
import Questions from "./components/Questions";
import NotFound from "./components/NotFound";

// build the router
const router = (
  <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="user-edit(/:id)" component={UserEdit} />
      <Route exact path="questions" component={Questions} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

// export
export { router };
