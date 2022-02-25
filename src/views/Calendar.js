import React from "react"
import "../assets/style/calendar.less"
import {Table, Radio, Button} from "antd";

class MyCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentDay: new Date(),
      lastMonth: new Date().getMonth() == 0 ? 12 : new Date().getMonth(),
      currentMonthString: new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月',
      days: [],
      weekDays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    }
  }

  firstDayOffset() {
    const firstDayOfMonth = new Date(this.state.currentYear, this.state.currentMonth - 1, 1);
    return firstDayOfMonth.getDay()
  }

  lastDayOffset() {
    const lastDayOfLastMonth = new Date(this.state.currentYear, this.state.currentMonth, 0);
    return lastDayOfLastMonth.getDay()
  }

  lastDateOfMonth() {
    const lastDayOfLastMonth = new Date(this.state.currentYear, this.state.currentMonth, 0);
    return lastDayOfLastMonth.getDate()
  }


  lastDateOfLastMonth() {
    const lastDayOfLastMonth = new Date(this.state.currentMonth === 1 ? this.state.currentYear - 1 : this.state.currentYear, this.state.currentMonth - 1, 0);
    return lastDayOfLastMonth.getDate()
  }

  setDays() {
    var days = []
    for (var week = 0; week < 5; week++) {
      var currentWeek = {
        'week-0': '', 'week-1': '', 'week-2': '', 'week-3': '',
        'week-4': '', 'week-5': '', 'week-6': '',
      }

      for (var day = 0; day < 7; day++) {
        currentWeek["week-" + day] = this.getDay(week, day)
      }

      days.push(currentWeek)
    }

    this.setState({days: days})
  }

  getDay(week, day) {
    var today
    var disabled
    if (week === 0) {
      if (this.firstDayOffset() <= day) {
        today = this.firstDayOffset() === day ? this.state.currentMonth + '月' + 1 + '日' : 1 + (day - this.firstDayOffset())
        disabled = false
      } else {
        today = this.lastDateOfLastMonth() - (this.firstDayOffset() - 1 - day)
        disabled = true
      }

      return {
        value: today,
        disabled: disabled
      }
    }

    var thisDay = (7 - this.firstDayOffset()) + ((week - 1) * 7) + day + 1
    if (thisDay <= this.lastDateOfMonth()) {
      today = thisDay
      disabled = false
    } else {
      today = this.lastDayOffset() + (day - this.lastDayOffset() - 1)
      disabled = true
    }

    return {
      value: today,
      disabled: disabled
    }
  }

  componentDidMount() {
    this.setDays()
  }

  getDayCell(record, index) {
    const value = record['week-' + index].value
    return (
      <div style={{height: (document.documentElement.clientHeight - 65 - 70 - 50 - 42 - 55 - 55) / 5}}>
        {value}
      </div>
    )
  }

  lastMonth() {
    const currentMonth = this.state.currentMonth == 1 ? 12 : this.state.currentMonth - 1
    const currentYear = this.state.currentMonth == 1 ? this.state.currentYear - 1 : this.state.currentYear
    const dateString = `${currentYear}年${currentMonth}月`
    const date = new Date(`${currentYear}-${currentMonth}`)
    this.monthChange(date, dateString)
  }

  thisMonth() {
    const date = new Date()
    const dateString = date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
    this.monthChange(date, dateString)
  }

  nextMonth() {
    const currentMonth = this.state.currentMonth == 12 ? 1 : this.state.currentMonth + 1
    const currentYear = this.state.currentMonth == 12 ? this.state.currentYear + 1 : this.state.currentYear
    const dateString = `${currentYear}年${currentMonth}月`
    const date = new Date(`${currentYear}-${currentMonth}`)
    this.monthChange(date, dateString)
  }

  monthChange(date, dateString) {
    this.setState({
      currentMonthString: dateString,
      currentYear: date.getFullYear(),
      currentMonth: date.getMonth() + 1,
      currentDay: date,
      lastMonth: date.getMonth() == 0 ? 12 : date.getMonth(),
    }, () => {
      this.setDays()
    })
  }

  render() {
    var columns = []
    this.state.weekDays.forEach((day, index) => {
      columns.push({
        title: day,
        key: index,
        render: (record) => this.getDayCell(record, index),
        ellipsis: true
      })
    })

    return (
      <div className="calendar-page-con">
        <div className="calendar-page-con-opt">
          <div className="title">{this.state.currentMonthString}</div>
          <div>
            <Button type="text" onClick={() => {
              this.lastMonth()
            }}>上月</Button>
            <Button type="text" onClick={() => {
              this.thisMonth()
            }}>今天</Button>
            <Button type="text" onClick={() => {
              this.nextMonth()
            }}>下月</Button>
          </div>
        </div>

        <Table
          style={{height: '100%'}}
          bordered={true}
          pagination={false}
          columns={columns}
          ellipsis={true}
          scroll={
            document.documentElement.clientHeight - 65 - 70 - 50 - 42 - 55 < 500
              ? {y: document.documentElement.clientHeight - 65 - 70 - 50 - 42 - 55 } : null
          }
          dataSource={this.state.days}>
        </Table>
      </div>
    )
  }
}

export default MyCalendar