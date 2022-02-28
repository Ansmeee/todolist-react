import React from "react"
import "../assets/style/calendar.less"
import {CaretRightOutlined, CaretLeftOutlined} from '@ant-design/icons';
import {Table, Button} from "antd";

class MyCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentYear: new Date("2021-12-1").getFullYear(),
      currentMonth: new Date("2021-12-1").getMonth() + 1,
      currentDay: new Date("2021-12-1"),
      lastMonth: new Date("2021-12-1").getMonth() == 0 ? 12 : new Date("2021-12-1").getMonth(),
      currentMonthString: new Date("2021-12-1").getFullYear() + '年' + (new Date("2021-12-1").getMonth() + 1) + '月',
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
    for (var week = 0; week < 6; week++) {
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
    const newDate = new Date()
    const currentDate = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
    var today
    var disabled
    if (week === 0) {
      if (this.firstDayOffset() <= day) {
        today = this.firstDayOffset() === day ? this.state.currentMonth + '月' + 1 + '日' : 1 + (day - this.firstDayOffset())
        disabled = false
        var date = this.state.currentYear + '-' + this.state.currentMonth + '-' + (this.firstDayOffset() === day ? 1 : today)
      } else {
        today = this.lastDateOfLastMonth() - (this.firstDayOffset() - 1 - day)
        disabled = true

        const currentY = this.state.currentMonth === 1 ? this.state.currentYear - 1 : this.state.currentYear
        const currentM = this.state.currentMonth === 1 ? 12 : this.state.currentMonth - 1
        var date = currentY + '-' + currentM + '-' + today
      }

      const isToday = (currentDate === this.state.currentYear + '-' + this.state.currentMonth + '-' + today)
        || (currentDate === this.state.currentYear + '-' + (this.state.currentMonth - 1) + '-' + today)
        || (currentDate === (this.state.currentYear - 1) + '-' + (this.state.currentMonth - 1) + '-' + today)

      return {
        day: today,
        disabled: disabled,
        today: isToday ? true : false,
        date: date
      }
    }

    var thisDay = (7 - this.firstDayOffset()) + ((week - 1) * 7) + day + 1
    if (thisDay <= this.lastDateOfMonth()) {
      today = thisDay
      disabled = false
      var date = this.state.currentYear + '-' + this.state.currentMonth + '-' + today
    } else {
      const perWeek = (this.lastDateOfMonth() - (6 - this.firstDayOffset() + 1)) / 7
      if (perWeek > 4) {

      } else {
        today = (day - this.lastDayOffset() === 1) ? (this.state.currentMonth === 12 ? '1月1日' : (this.state.currentMonth + 1) + '月1日') : day - this.lastDayOffset()
        disabled = true
        const currentY = this.state.currentMonth === 12 ? this.state.currentYear + 1 : this.state.currentYear
        const currentM = this.state.currentMonth === 12 ? 1 : this.state.currentMonth + 1
        var date = currentY + '-' + currentM + '-' + day - this.lastDayOffset()
      }
    }

    return {
      day: today,
      disabled: disabled,
      date: date,
      today: currentDate === this.state.currentYear + '-' + this.state.currentMonth + '-' + today ? true : false,
    }
  }

  componentDidMount() {
    this.setDays()
  }

  getDayCell(record, index) {
    const currentDay = record['week-' + index]
    return (
      <div className={"calendar-day " + `${currentDay.disabled ? 'disabled' : ''}`}
           style={{height: (document.documentElement.clientHeight - 65 - 70 - 50 - 42 - 60) / 6}}>
        <span className={`${currentDay.today ? 'today' : ''}`}>{currentDay.day}</span>
        <div className="calendar-item-con">
          {this.getDayTasks(currentDay.date)}
        </div>
      </div>
    )
  }

  getDayTasks(date) {
    console.log(date)
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
            }}><CaretLeftOutlined style={{fontSize: '15px'}}/></Button>
            <Button type="text" onClick={() => {
              this.thisMonth()
            }}>今天</Button>
            <Button type="text" onClick={() => {
              this.nextMonth()
            }}><CaretRightOutlined style={{fontSize: '15px'}}/></Button>
          </div>
        </div>

        <Table
          className="calendar-table"
          bordered={true}
          pagination={false}
          columns={columns}
          ellipsis={true}
          scroll={
            document.documentElement.clientHeight - 65 - 70 - 50 - 42 - 55 < 500
              ? {y: document.documentElement.clientHeight - 65 - 70 - 50 - 42 - 55} : null
          }
          dataSource={this.state.days}>
        </Table>
      </div>
    )
  }
}

export default MyCalendar