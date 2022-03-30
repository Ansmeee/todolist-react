import React from "react";
import {Layout} from "antd";
import "../../assets/style/head.less"
import Notice from "./Head/Notice";
import User from "./Head/User";
import Feedback from "./Head/Feedback";

class Head extends React.Component {
  render() {
    return (
      <Layout.Header className="header-con">
        <div
          className="header-con-logo"
          onClick={() => {
            this.goHome()
          }}>土豆清单
        </div>
        <div className="header-con-opt">
          {this.userContent()}
          {this.noticeContent()}
          {this.feedbackContent()}
        </div>
      </Layout.Header>
    )
  }

  feedbackContent() {
    if (this.props.account) {
      return <Feedback account={this.props.account}></Feedback>
    }
  }

  noticeContent() {
    if (this.props.account) {
      return <Notice account={this.props.account}></Notice>
    }
  }

  userContent() {
    if (this.props.account) {
      return <User account={this.props.account} icon={this.props.icon} name={this.props.name}></User>
    }
  }

  goHome() {
    window.location.href = '/'
  }
}

export default Head