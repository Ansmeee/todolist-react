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
      msgCount: 0,
      msgList: [],
      msgContent: [],
      msgloading: false,
      page: 1,
      msgForm: {
        page: 1,
        page_size: 10
      },
      more: true
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.loadMsgCount()
    }, 10000)
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
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
      msgApi.list(this.state.msgForm).then(response => {
        this.setState({msgloading: false})
        if (response.code === 200) {
          var data = response.data && response.data.length > 0 ? response.data : []
          var msgList = this.state.msgList
          msgList.push(...data)
          this.setState({msgList: msgList, more: data.length > 0})
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

  readMsg(item) {
    msgApi.updateAttr(item.id, {name: 'status', value: "1"}).then(response => {
      if (response.code === 200) {
        item.status = 1
        var msgList = this.state.msgList
        var index = msgList.findIndex(i => {
          return i.id === item.id
        })

        if (index >= 0) {
          msgList[index] = item
          this.setState({msgList: msgList})
        }
      }
    })
  }
  getMsgItem(item) {
    if (item.status === 0) {
      return <span className="msg-item" onClick={() => {this.readMsg(item)}}><Badge color="red"/>{item.content}</span>
    }

    return <span className="msg-item">{item.content}</span>
  }

  onLoadMore() {
    if (this.state.more) {
      var form = this.state.msgForm
      form.page = form.page + 1
      this.setState({msgForm: form}, () => {
        this.setMsg()
      })
    }

  }

  loadMore() {
    if (this.state.msgList.length > 0) {
      if (this.state.more) {
        return (
          <div style={{textAlign: 'center', 'marginTop': '20px'}}>
            <Button type="text" onClick={() => {this.onLoadMore()}} style={{'fontSize': '12px'}}>查看更多</Button>
          </div>
        )
      } else {
        return (
          <div style={{textAlign: 'center', 'marginTop': '20px'}}>
            <span className="msg-item">没有更多消息了</span>
          </div>
        )
      }

    }

    return null
  }

  getMsgTime(item) {
    return <span className="msg-item">{moment(item.created_at).format("YYYY-MM-DD")}</span>
  }

  loadMsgCount() {
    if (this.props.account) {
      msgApi.msgCount().then(response => {
        if (response.code === 200) {
          this.setState({msgCount: response.data.count})
        }
      })
    }
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
              } else {
                this.setState({more: true, msgList: [], msgForm:{page: 1, page_size: 10}})
              }
            }}
            overlayClassName="user-notice-pop"
            title="通知"
            content={content}
            trigger="click">
            <Badge count={this.state.msgCount} size="small"><BellOutlined style={{fontSize: '14px'}}/></Badge>
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