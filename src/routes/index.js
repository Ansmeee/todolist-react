import React from 'react'
import {browserHistory, Route, Router} from "react-router";
import Home from "../views/Home";
import Latest from "../views/Latest";
class Routes extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home}>
          <Route path="/latest" component={Latest}></Route>
        </Route>
      </Router>
    )
  }
}

export default Routes