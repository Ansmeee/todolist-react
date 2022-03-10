import React from "react";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {Layout} from "antd";
import "../../assets/style/head.less"
import Notice from "./Head/Notice";
import User from "./Head/User";

class Head extends React.Component {
  constructor(props) {
    super(props);
  }

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
          <div className="header-con-opt-notice">
            <QuestionCircleOutlined style={{fontSize: '14px'}}/>
          </div>
        </div>
      </Layout.Header>
    )
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