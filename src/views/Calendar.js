import React from "react"
import "../assets/style/calendar.less"
import {CaretRightOutlined, CaretLeftOutlined} from '@ant-design/icons';
import {Button} from "antd";
import Month from "../components/calendar/Month";
import Day from "../components/calendar/Day";

class MyCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateType: 'month',
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentDateString: new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月',
    }
  }

  lastDate() {
    if (this.state.dateType === 'month') {
      const currentMonth = this.state.currentMonth === 1 ? 12 : this.state.currentMonth - 1
      const currentYear = this.state.currentMonth === 1 ? this.state.currentYear - 1 : this.state.currentYear
      const dateString = `${currentYear}年${currentMonth}月`
      const date = new Date(`${currentYear}-${currentMonth}`)
      this.monthChange(date, dateString)
    } else {

    }

  }

  thisDate() {
    const date = new Date()
    if (this.state.dateType === 'month') {
      const dateString = date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
      this.monthChange(date, dateString)
    } else {

    }
  }

  nextDate() {
    if (this.state.dateType === 'month') {
      const currentMonth = this.state.currentMonth === 12 ? 1 : this.state.currentMonth + 1
      const currentYear = this.state.currentMonth === 12 ? this.state.currentYear + 1 : this.state.currentYear
      const dateString = `${currentYear}年${currentMonth}月`
      const date = new Date(`${currentYear}-${currentMonth}`)
      this.monthChange(date, dateString)
    } else {

    }
  }

  monthChange(date, dateString) {
    this.setState({
      currentDateString: dateString,
      currentYear: date.getFullYear(),
      currentMonth: date.getMonth() + 1,
    })
  }

  render() {
    return (
      <div className="calendar-page-con">
        <div className="calendar-page-con-opt">
          <div className="title">{this.state.currentDateString}</div>
          <div>
            <Button type="text" onClick={() => {
              let date = new Date()
              let dateString = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
              this.setState({dateType: 'day', currentDateString: dateString})
            }}>日</Button>
            <Button type="text" onClick={() => {
              let date = new Date()
              let dateString = date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
              this.setState({dateType: 'month', currentDateString: dateString})
            }}>月</Button>
            <Button type="text" onClick={() => {
              this.lastDate()
            }}><CaretLeftOutlined style={{fontSize: '15px'}}/></Button>
            <Button type="text" onClick={() => {
              this.thisDate()
            }}>今天</Button>
            <Button type="text" onClick={() => {
              this.nextDate()
            }}><CaretRightOutlined style={{fontSize: '15px'}}/></Button>
          </div>
        </div>
        {this.getDateCon()}
      </div>
    )
  }

  getDateCon() {
    if (this.state.dateType === 'month') {
      return (
        <Month
          currentDateString={this.state.currentDateString}
          currentYear={this.state.currentYear}
          currentMonth={this.state.currentMonth}>
        </Month>
      )
    }

    if (this.state.dateType === 'day') {
      return <Day/>
    }
  }
}

export default MyCalendar