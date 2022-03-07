import React from "react";
import {BellOutlined, QuestionCircleOutlined, ExportOutlined, UserOutlined, DownOutlined} from "@ant-design/icons";
import {Avatar, Badge, Button, Layout, List, Popover} from "antd";
import "../../assets/style/head.less"
import {browserHistory} from "react-router";
import signApi from "../../http/sign";
import msgApi from "../../http/msg";
import moment from "moment";

const {Header} = Layout;

class Head extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgList: [],
      msgContent: [],
      msgloading: false
    }
  }

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

  setMsg() {
    this.setState({msgloading: true}, () => {
      msgApi.list({}).then(response => {
        this.setState({msgloading: false})
        if (response.code === 200) {
          var data = response.data && response.data.length > 0 ? response.data : []
          this.setState({msgList: data})
        }
      })
    })
  }

  signout() {
    window.localStorage.removeItem("token")
    signApi.signout().then(response => {
      window.location.href = '/'
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

  getHeaderUser() {
    if (this.props.account) {
      var icon = this.props.icon
      if (icon) {
        var cusavatar = (
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
            {cusavatar}
            <span className="header-con-username" id="user-name">{name}</span>
            <DownOutlined style={{fontSize: '14px'}}/>
          </Popover>
        </div>
      )
    }
  }

  getMsgItem(item) {
    if (item.status === 0) {
      return <span className="msg-item"><Badge color="red"/>{item.content}</span>
    }

    return <span className="msg-item">{item.content}</span>
  }

  onLoadMore() {

  }

  loadMore() {
    if (this.state.msgList.length > 0) {
      return (
        <div style={{textAlign: 'center', 'marginTop': '20px'}}>
          <Button type="text" onClick={this.onLoadMore} style={{'fontSize': '12px'}}>查看更多</Button>
        </div>
      )
    }

    return null
  }

  getMsgTime(item) {
    return <span className="msg-item">{moment(item.created_at).format("YYYY-MM-DD")}</span>
  }

  getHeaderNotice() {
    if (this.props.account) {
      const content = (
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={this.state.msgList}
          loading={this.state.msgloading}
          loadMore={this.loadMore()}
          locale={{emptyText: "暂无消息"}}
          renderItem={item => (
            <List.Item key={item.id} style={{cursor: 'pointer'}}>
              <List.Item.Meta title={this.getMsgTime(item)} description={this.getMsgItem(item)}/>
            </List.Item>
          )}
        />
      )
      return (
        <div className="header-con-opt-notice">
          <Popover
            onVisibleChange={(visivle) => {
              if (visivle) {
                this.setMsg()
              }
            }}
            overlayClassName="user-notice-pop"
            title="通知"
            content={content}
            trigger="click">
            <Badge count={5} size="small"><BellOutlined style={{fontSize: '14px'}}/></Badge>
          </Popover>
        </div>
      )
    }
  }

  goHome() {
    window.location.href = '/'
  }
}

export default Head