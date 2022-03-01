import React from 'react'
import {browserHistory, Route, Router, IndexRoute} from "react-router";
import Home from "../views/Home"
import Latest from "../views/Latest"
import Calendar from "../views/Calendar"
import Done from "../views/Done"
import Dir from "../views/Dir"
import Signin from "../views/Signin"
import Signup from "../views/Signup"
import Settings from "../views/Settings"
import ResetPass from "../views/ResetPass";
import {getUserInfoFromLocal} from "../utils/user";
class Routes extends React.Component {

  checkAccess() {
    var userInfo = getUserInfoFromLocal()
    if (!userInfo) {
      browserHistory.push('signin')
      return
    }
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home}>
          <IndexRoute component={Calendar} onEnter={() => {this.checkAccess()}}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/signin" component={Signin}/>
          <Route path="/resetPass" component={ResetPass}/>
          <Route path="/calendar" component={Calendar} onEnter={() => {this.checkAccess()}}/>
          <Route path="/latest" component={Latest} onEnter={() => {this.checkAccess()}}/>
          <Route path="/done" component={Done} onEnter={() => {this.checkAccess()}}/>
          <Route path="/dir/:id" component={Dir} onEnter={() => {this.checkAccess()}}/>
          <Route path="/settings" component={Settings} onEnter={() => {this.checkAccess()}}/>
          <Route path="*" component={Latest} onEnter={() => {this.checkAccess()}}/>
        </Route>
      </Router>
    )
  }
}

export default Routes