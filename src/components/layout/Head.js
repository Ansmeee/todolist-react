import React from "react";
import {BellOutlined, QuestionCircleOutlined, ExportOutlined, UserOutlined, DownOutlined} from "@ant-design/icons";
import {Avatar, Badge, Button, Layout, message, Popover} from "antd";
import "../../assets/style/head.less"
import {browserHistory} from "react-router";
import signApi from "../../http/sign";

const {Header} = Layout;

class Head extends React.Component {
  render() {
    return (
      <Header className="header-con">
        <div
          className="header-con-logo"
          onClick={() => {
            this.goHome()
          }}>土豆清单
        </div>
        <div className="header-con-opt">
          {this.getHeaderUser()}
          {this.getHeaderNotice()}
          <div className="header-con-opt-notice">
            <QuestionCircleOutlined style={{fontSize: '14px'}}/>
          </div>
        </div>
      </Header>
    )
  }

  signout() {
    signApi.signout().then(response => {
      if (response.code === 200) {
        window.localStorage.removeItem("token")
        window.location.href = '/'
      } else {
        message.error(response.msg || '登出失败')
      }
    })
  }

  accountOptClick(opt) {
    if (opt === 'signout') {
      this.signout()
      return
    }

    if (opt === 'settings') {
      browserHistory.push("/settings")
      return
    }
  }

  getAccountCon() {
    return (
      <div>
        <Button
          block
          type="text"
          onClick={() => {
            this.accountOptClick('settings')
          }}>
          <UserOutlined />
          个人中心
        </Button>
        <Button
          block
          type="text"
          onClick={() => {
            this.accountOptClick('signout')
          }}>
          <ExportOutlined />
          退出登陆
        </Button>
      </div>
    )
  }

  getHeaderUser() {
    if (this.props.account) {
      var icon = this.props.icon
      if (icon) {
        var cusavatar = (
          <Avatar src={icon}/>
        )
      } else {
        var account = this.props.name
          ? this.props.name.substring(0, 1).toUpperCase()
          : this.props.account.substring(0, 1).toUpperCase()
        cusavatar = (
          <Avatar>{account}</Avatar>
        )
      }

      var name = this.props.name
      return (
        <div className="header-con-opt-user">
          <Popover
            overlayClassName="header-con-opt-user-pop"
            content={this.getAccountCon()}
            placement="bottom"
            trigger="click">
            {cusavatar}
            <span className="header-con-username">{name}</span>
            <DownOutlined style={{fontSize: '14px'}} />
          </Popover>
        </div>
      )
    }
  }

  getHeaderNotice() {
    if (this.props.account) {
      return (
        <div className="header-con-opt-notice">
          <Badge count={5} size="small"><BellOutlined style={{fontSize: '14px'}}/></Badge>
        </div>
      )
    }
  }

  goHome() {
    window.location.href = '/'
  }
}

export default Head