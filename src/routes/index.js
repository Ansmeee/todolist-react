import React from 'react'
import {browserHistory, Route, Router, IndexRoute} from "react-router";
import Home from "../views/Home";
import Latest from "../views/Latest";
import Done from "../views/Done";
import Dir from "../views/Dir";
import Signin from "../views/Signin"
import Signup from "../views/Signup"
class Routes extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home}>
          <IndexRoute component={Latest}/>
          <Route path="/signin" component={Signin}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/latest" component={Latest}/>
          <Route path="/done" component={Done}/>
          <Route path="/dir/:id" component={Dir}/>
          <Route path="*" component={Latest}/>
        </Route>
      </Router>
    )
  }
}

export default Routes