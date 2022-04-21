import React from "react";
import {Button, Popover, message} from "antd";
import {CheckCircleOutlined, DeleteOutlined, MoreOutlined, UnorderedListOutlined} from "@ant-design/icons";
import todoApi from "../../../http/todo";
import "../../../assets/style/more.less";

class More extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popVisible: false
    }
  }

  render() {
    const popCon = (
      <div>
        <div className="item-opt-li item-opt-del">
          <div className="item-opt-del-del" onClick={() => {
            this.delete()
          }}><DeleteOutlined/> 删除
          </div>
        </div>
      </div>
    )
    return (
      <div>
        <Popover
          trigger="click"
          content={popCon}
          placement="bottomLeft"
          visible={this.state.popVisible}
          onVisibleChange={(visible) => {
            this.setState({popVisible: visible})
          }}
          overlayClassName="item-opt-more">
          <Button type="text">
            <MoreOutlined/>
          </Button>
        </Popover>
      </div>
    )
  }

  statusChange(status) {
    this.setState({popVisible: false}, () => {
      this.props.onItemChange('status', status)
    })
  }

  priorityChange(priority) {
    this.setState({popVisible: false}, () => {
      this.props.onItemChange('priority', priority)
    })
  }

  delete() {
    todoApi.delete(this.props.currentTask.id).then(response => {
      if (response.code === 200) {
        message.success("已删除")
        this.setState({popVisible: false}, () => {
          this.props.onItemDel(this.props.currentTask)
        })
      }
    })
  }
}

export default More