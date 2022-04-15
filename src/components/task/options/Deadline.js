import React from "react";
import {CarryOutOutlined} from "@ant-design/icons";
import {DatePicker} from "antd";
import moment from "moment";
class Deadline extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <span className={this.getTaskOPTClassName()}>
        <CarryOutOutlined className="task-info-opt-icon"/>
        <DatePicker
          onChange={(date, dateString) => {
            this.deadlineChange(dateString)
          }}
          bordered={false}
          picker="date"
          value={moment(this.props.currentTask.deadline)}
          style={{maxWidth: '110px', minWidth: '110px'}}
          inputReadOnly={true}
          placeholder="时间"
          allowClear={false}
          suffixIcon={null}/>
      </span>
    )
  }

  getTaskOPTClassName() {
    var currentDate = Date.now()
    var expireDate = new Date(this.props.currentTask.deadline).getTime()
    var remainDate = expireDate - currentDate
    if (remainDate < 24 * 60 * 60 * 1000) {
      return "task-info-opt task-info-opt-danger"
    }

    if (remainDate > 24 * 60 * 60 * 1000 && remainDate <= 3 * 24 * 60 * 60 * 1000) {
      return "task-info-opt task-info-opt-warning"
    }

    if (remainDate > 3 * 24 * 60 * 60 * 1000 && remainDate <= 5 * 24 * 60 * 60 * 1000) {
      return "task-info-opt task-info-opt-primary"
    }

    return "task-info-opt"
  }

  deadlineChange(val) {
    this.props.onDeadlineChange(val)
  }
}

export default Deadline