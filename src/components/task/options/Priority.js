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
          type="text"
          onClick={() => {
            this.priorityChange(3)
          }}>
          高优先级
        </Button>
        <Button
          block
          className="pop-opt-warning"
          type="text"
          onClick={() => {
            this.priorityChange(2)
          }}>
          中优先级
        </Button>
        <Button
          block
          className="pop-opt-primary"
          type="text"
          onClick={() => {
            this.priorityChange(1)
          }}>
          低优先级
        </Button>
        <Button
          block
          type="text"
          onClick={() => {
            this.priorityChange(0)
          }}>
          无优先级
        </Button>
      </div>
    )
    return (
      <span className={this.getTaskOPTClassName()}>
        <Popover
          overlayClassName="pop-opt-con"
          placement="bottomLeft"
          visible={this.state.priorityPopVisible}
          onVisibleChange={(visible) => {
            this.setState({priorityPopVisible: visible})
          }}
          content={popCon}
          trigger="click">
          <div>
            {this.props.trigger}
          </div>
        </Popover>
      </span>
    )
  }

  getTaskOPTClassName() {
    if (this.props.currentTask.priority === 3) {
      return "task-info-opt task-info-opt-danger"
    }

    if (this.props.currentTask.priority === 2) {
      return "task-info-opt task-info-opt-warning"
    }

    if (this.props.currentTask.priority === 1) {
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