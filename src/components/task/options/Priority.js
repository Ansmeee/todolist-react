import React from "react";
import {Button, Popover} from "antd";
import {FlagOutlined} from "@ant-design/icons";

class Priority extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      priorityPopVisible: false
    }
  }

  render() {
    const popCon = (
      <div>
        <Button
          block
          className="pop-opt-danger"
          type={this.props.currentTask.priority === '高' ? 'link' : 'text'}
          onClick={() => {
            this.priorityChange('高')
          }}>
          高优先级
        </Button>
        <Button
          block
          className="pop-opt-warning"
          type={this.props.currentTask.priority === '中' ? 'link' : 'text'}
          onClick={() => {
            this.priorityChange('中')
          }}>
          中优先级
        </Button>
        <Button
          block
          className="pop-opt-primary"
          type={this.props.currentTask.priority === '低' ? 'link' : 'text'}
          onClick={() => {
            this.priorityChange('低')
          }}>
          低优先级
        </Button>
        <Button
          block
          type={this.props.currentTask.priority === '无' ? 'link' : 'text'}
          onClick={() => {
            this.priorityChange('无')
          }}>
          无优先级
        </Button>
      </div>
    )
    return (
      <span className={this.getTaskOPTClassName()}>
        <FlagOutlined className="task-info-opt-icon"/>
        <Popover
          overlayClassName="pop-opt-con"
          placement="bottomLeft"
          visible={this.state.priorityPopVisible}
          onVisibleChange={(visible) => {
            this.setState({priorityPopVisible: visible})
          }}
          content={popCon}
          trigger="click">
          {this.props.trigger}
        </Popover>
      </span>
    )
  }

  getTaskOPTClassName() {
    if (this.props.currentTask.priority === '高') {
      return "task-info-opt task-info-opt-danger"
    }

    if (this.props.currentTask.priority === '中') {
      return "task-info-opt task-info-opt-warning"
    }

    if (this.props.currentTask.priority === '低') {
      return "task-info-opt task-info-opt-primary"
    }

    return "task-info-opt"
  }

  priorityChange(val) {
    this.setState({priorityPopVisible: false})
    this.props.onPriorityChange(val)
  }
}

export default Priority