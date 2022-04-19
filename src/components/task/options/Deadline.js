import React from "react";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {DatePicker, Button} from "antd";
import moment from "moment";
import "../../../assets/style/opt.less"

class Deadline extends React.Component {
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
          showToday={false}
          renderExtraFooter={() =>
            <div style={{width: '100%;', textAlign: 'center', padding: '10px 0px'}}>
              <Button type="text" onClick={() => this.quickDate(0)}>今天</Button>
              <Button type="text" onClick={() => this.quickDate(1)}>明天</Button>
              <Button type="text" onClick={() => this.quickDate(2)}>下周</Button>
              <Button type="text" onClick={() => this.quickDate(3)}>下月</Button>
            </div>}
          allowClear={false}
          suffixIcon={null}/>
      </div>
    )
  }

  quickDate(type = 0) {
    var date = new Date()
    if (type === 1) {
      this.deadlineChange(moment(date).add(1, 'days').format("YYYY-MM-DD"))
      return
    }

    if (type === 2) {
      var dow = moment(date).day();
      var monday = moment(date).add(-(dow-1), 'days').format('YYYY-MM-DD')//本周一
      var nextMonday = moment(monday).add(7, 'days').format('YYYY-MM-DD')//下周一
      this.deadlineChange(nextMonday)
      return
    }

    if (type === 3) {
      var nextMon = moment(date).add(1, 'months').format("YYYY-MM")
      this.deadlineChange(moment(nextMon).format('YYYY-MM-DD'))
      return
    }

    this.deadlineChange(moment(date).format("YYYY-MM-DD"))
    return
  }

  deadlineChange(val) {
    this.props.onDeadlineChange(val)
  }
}

export default Deadline