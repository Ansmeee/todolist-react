import React from 'react'
import {browserHistory, Route, Router, IndexRoute} from "react-router";
import All from "../views/All"
import Dir from "../views/Dir"
import Done from "../views/Done"
import Home from "../views/Home"
import Today from "../views/Today"
import Signin from "../views/Signin"
import Signup from "../views/Signup"
import Calendar from "../views/Calendar"
import Settings from "../views/Settings"
import ResetPass from "../views/ResetPass"
import EmailVerify from "../views/EmailVerify"
import {getUserInfoFromLocal} from "../utils/user"

class Routes extends React.Component {

  checkAccess = () => {
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
          <IndexRoute component={Today} onEnter={this.checkAccess}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/signin" component={Signin}/>
          <Route path="/resetPass" component={ResetPass}/>
          <Route path="/email/verify" component={EmailVerify}/>
          <Route path="/calendar" component={Calendar} onEnter={this.checkAccess}/>
          <Route path="/today" component={Today} onEnter={this.checkAccess}/>
          <Route path="/all" component={All} onEnter={this.checkAccess}/>
          <Route path="/done" component={Done} onEnter={this.checkAccess}/>
          <Route path="/dir/:id" component={Dir} onEnter={this.checkAccess}/>
          <Route path="/settings" component={Settings} onEnter={this.checkAccess}/>
          <Route path="*" component={Today} onEnter={this.checkAccess}/>
        </Route>
      </Router>
    )
  }
}

export default Routes