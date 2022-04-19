import React from "react";
import {CarryOutOutlined} from "@ant-design/icons";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {DatePicker} from "antd";
import moment from "moment";
import "../../../assets/style/opt.less"

class Deadline extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={{display: 'flex'}}>
        {this.props.trigger}
        <DatePicker
          className={this.props.pickerClassName}
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

  deadlineChange(val) {
    this.props.onDeadlineChange(val)
  }
}

export default Deadline