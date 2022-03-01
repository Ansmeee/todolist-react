import React from "react"
import "../assets/style/calendar.less"
import {CaretRightOutlined, CaretLeftOutlined} from '@ant-design/icons';
import {Table, Button} from "antd";
import todoApi from "../http/todo";
import moment from "moment";

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
      firstDate: '',
      lastDate: '',
      taskList: [],
      loadTask: 0,
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
    var firstDate = ''
    var lastDate = ''
    for (var week = 0; week < 6; week++) {
      var currentWeek = {
        'week-0': '', 'week-1': '', 'week-2': '', 'week-3': '',
        'week-4': '', 'week-5': '', 'week-6': '',
      }

      for (var day = 0; day < 7; day++) {
        const currentDay = this.getDay(week, day)
        currentWeek["week-" + day] = currentDay
        if (week === 0 && day === 0) {
          firstDate = currentDay.date
        }

        if (week === 5 && day === 6) {
          lastDate = currentDay.date
        }
      }

      days.push(currentWeek)
    }

    this.setState({days: days, firstDate: firstDate, lastDate: lastDate}, () => {
      this.loadMyTasks()
    })
  }

  getDay(week, day) {
    const newDate = new Date()
    const currentDate = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
    var today
    var disabled
    if (week === 0) {
      if (this.firstDayOffset() <= day) {
        disabled = false
        today = this.firstDayOffset() === day ? 1 : 1 + (day - this.firstDayOffset())
        var date = this.state.currentYear + '-' + this.state.currentMonth + '-' + (this.firstDayOffset() === day ? 1 : today)
      } else {
        disabled = true
        today = this.lastDateOfLastMonth() - (this.firstDayOffset() - 1 - day)
        const currentY = this.state.currentMonth === 1 ? this.state.currentYear - 1 : this.state.currentYear
        const currentM = this.state.currentMonth === 1 ? 12 : this.state.currentMonth - 1
        var date = currentY + '-' + currentM + '-' + today
      }

      return {
        day: today,
        disabled: disabled,
        today: currentDate === date ? true : false,
        date: date
      }
    }

    var thisDay = (7 - this.firstDayOffset()) + ((week - 1) * 7) + day + 1
    if (thisDay <= this.lastDateOfMonth()) {
      today = thisDay
      disabled = false
      var date = this.state.currentYear + '-' + this.state.currentMonth + '-' + today
    } else {

      disabled = true
      var offsetDay = (week * 7 + day + 1) - this.lastDateOfMonth() - this.firstDayOffset()
      today = offsetDay === 1 ? 1 : offsetDay
      const currentY = this.state.currentMonth === 12 ? this.state.currentYear + 1 : this.state.currentYear
      const currentM = this.state.currentMonth === 12 ? 1 : this.state.currentMonth + 1
      var date = currentY + '-' + currentM + '-' + offsetDay

    }

    return {
      day: today,
      disabled: disabled,
      date: date,
      today: currentDate === date ? true : false,
    }
  }

  componentDidMount() {
    this.setDays()
  }

  getDayCell(record, index) {
    const currentDay = record['week-' + index]
    return (
      <div className={"calendar-day " + `${currentDay.disabled ? 'disabled' : ''}`}
           style={{
             height: (document.documentElement.clientHeight - 65 - 70 - 50 - 42 - 60) / 6,
             minHeight: 80,
             maxHeight: 300
           }}>
        <div className="calendar-date-con">
          {this.getDate(currentDay)}
        </div>
        <div className="calendar-item-con">
          {this.getDayTasks(currentDay.date)}
        </div>
      </div>
    )
  }

  getDate(currentDay) {
    const thisDate = new Date(currentDay.date)
    const Today = <span className={"day" + `${currentDay.today ? ' today' : ''}`}>{currentDay.day}</span>
    if (thisDate.getDate() === 1) {
      var month = thisDate.getMonth() + 1

      if (currentDay.today) {
        return <span className="today-is-firstday">{month}月{Today}日</span>
      }

      return <span>{month}月{currentDay.day}日</span>
    }

    return Today
  }

  getDayTasks(date) {
    var currentDate = moment(date).format("yyyy-MM-DD")
    const tasks = this.state.taskList.map(item => {
      if (item.deadline == currentDate) {
        return <span className={"task-title" + ` priority-${item.priority}`}>{item.title}</span>
      }
    })

    return (tasks)
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

  loadMyTasks() {
    var params = {
      first_date: this.state.firstDate,
      last_date: this.state.lastDate,
      sort_order: 'desc',
      sort_by: 'priority'
    }
    todoApi.todoList(params).then(response => {
      if (response.code === 200) {
        this.setState({taskList: response.data.list && response.data.list.length > 0 ? response.data.list : []})
      }
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
            document.documentElement.clientHeight - 65 - 70 - 50 - 42 - 60 < 500
              ? {y: document.documentElement.clientHeight - 65 - 70 - 50 - 42 - 60} : null
          }
          dataSource={this.state.days}>
        </Table>
      </div>
    )
  }
}

export default MyCalendar