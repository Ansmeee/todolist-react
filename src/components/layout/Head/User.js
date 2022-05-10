import React from "react";
import {Avatar, Button, Popover} from "antd";
import {DownOutlined, ExportOutlined, UserOutlined} from "@ant-design/icons";
import {browserHistory} from "react-router";
import signApi from "../../../http/sign";

class User extends React.Component {
  accountOptClick(opt) {
    if (opt === 'signout') {
      window.localStorage.clear()
      window.sessionStorage.clear()
      signApi.signout().then(response => {
        window.location.href = '/'
      })
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
          <UserOutlined/>
          个人中心
        </Button>
        <Button
          block
          type="text"
          onClick={() => {
            this.accountOptClick('signout')
          }}>
          <ExportOutlined/>
          退出登陆
        </Button>
      </div>
    )
  }

  render() {
    var cusavatar = null
    var icon = this.props.icon
    if (icon) {
      cusavatar = (
        <Avatar id="user-icon" src={icon}/>
      )
    } else {
      var account = this.props.name ? this.props.name : ''
      var avatar = account ? account.substring(0, 1).toUpperCase() : 'ToDoo'
      cusavatar = (
        <Avatar>{avatar}</Avatar>
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
          <div style={{height: '100%', width: '100%'}}>
            {cusavatar}
            <span className="header-con-username" id="user-name">{name}</span>
            <DownOutlined style={{fontSize: '14px'}}/>
          </div>
        </Popover>
      </div>
    )
  }
}

export default User