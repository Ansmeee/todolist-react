import React from "react";
import Status from "./Status";
import Priority from "./Priority";
import {Button} from "antd";
import {deadlineClassName, priorityClassName} from "./ClassName";
import {CarryOutOutlined, FlagOutlined} from "@ant-design/icons";
import {priorityKey2Name} from "../../../utils/task";
import Deadline from "./Deadline";

class Action extends React.Component {
  render() {
    const item = this.props.currentTask
    return (
      <div className="item-action-con">
        <Status
          currentTask={item}
          onStatusChange={(val) => {
            this.statusChange(val)
          }}>
        </Status>
        <Priority
          trigger={
            <Button
              type="text"
              style={{fontSize: '12px'}}
              className={priorityClassName(item.priority)}>
              <FlagOutlined/>
              {priorityKey2Name(item.priority)}
            </Button>
          }
          currentTask={item}
          onPriorityChange={(val) => {
            this.priorityChange(val)
          }}>
        </Priority>
        <Deadline
          trigger={
            <Button type="text" style={{fontSize: '12px'}} className={deadlineClassName(item.deadline)}>
              <CarryOutOutlined/>
              {item.deadline}
            </Button>
          }
          pickerClassName="file-deadline-picker"
          currentTask={item}
          onDeadlineChange={(val) => {
            this.deadlineChange(val)
          }}>
        </Deadline>
      </div>
    )
  }


  statusChange(status) {
    this.props.onItemChange('status', status)
  }

  deadlineChange(deadline) {
    this.props.onItemChange('deadline', deadline)
  }

  priorityChange(priority) {
    this.props.onItemChange('priority', priority)
  }
}

export default Action