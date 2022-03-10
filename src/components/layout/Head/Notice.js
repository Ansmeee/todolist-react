import React from "react";
import {Badge, Button, List, Popover} from "antd";
import {BellOutlined} from "@ant-design/icons";
import moment from "moment";
import msgApi from "../../../http/msg";

class Notice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      msgList: [],
      msgCount: 0,
      msgloading: false,
      more: true,
      msgForm: {
        page: 1,
        page_size: 10
      }
    }
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
            <Button type="text" onClick={() => {
              this.onLoadMore()
            }} style={{'fontSize': '12px'}}>查看更多</Button>
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

  getMsgItem(item) {
    if (item.status === 0) {
      return <span className="msg-item" onClick={() => {
        this.readMsg(item)
      }}><Badge color="red"/>{item.content}</span>
    }

    return <span className="msg-item">{item.content}</span>
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

  loadMsgCount() {
    msgApi.msgCount().then(response => {
      if (response.code === 200) {
        this.setState({msgCount: response.data.count})
      }
    })
  }

  componentDidMount() {
    this.loadMsgCount()
    this.timer = setInterval(() => {
      this.loadMsgCount()
    }, 10000)
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }

  render() {
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
              this.setState({more: true, msgList: [], msgForm: {page: 1, page_size: 10}})
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

export default Notice