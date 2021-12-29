import React from 'react'
import {browserHistory, Route, Router, IndexRoute} from "react-router";
import Home from "../views/Home";
import Latest from "../views/Latest";
import Dir from "../views/Dir";
import Signin from "../views/Signin"
import Signup from "../views/Signup"
class Routes extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home}>
          <IndexRoute component={Latest}/>
          <Route path="/signin" component={Signin}></Route>
          <Route path="/signup" component={Signup}></Route>
          <Route path="/latest" component={Latest}></Route>
          <Route path="/dir/:id" component={Dir}></Route>
          <Route path="*" component={Latest}/>
        </Route>
      </Router>
    )
  }
}

export default Routes