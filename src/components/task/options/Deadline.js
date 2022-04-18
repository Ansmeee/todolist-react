import React from "react";
import {CarryOutOutlined} from "@ant-design/icons";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {DatePicker} from "antd";
import moment from "moment";
import "../../../assets/style/priority.less"

class Deadline extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={this.getTaskOPTClassName()}>
        <CarryOutOutlined />
        <DatePicker
          onChange={(date, dateString) => {
            this.deadlineChange(dateString)
          }}
          bordered={false}
          picker="date"
          locale={locale}
          value={moment(this.props.currentTask.deadline)}
          inputReadOnly={true}
          placeholder="截止时间"
          allowClear={false}
          suffixIcon={null}/>
      </div>
    )
  }

  getTaskOPTClassName() {
    var currentDate = Date.now()
    var expireDate = new Date(this.props.currentTask.deadline).getTime()
    var remainDate = expireDate - currentDate
    if (remainDate < 24 * 60 * 60 * 1000) {
      return "task-info-opt-danger"
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