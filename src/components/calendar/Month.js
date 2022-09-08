import React from "react"
import {Popover, Table} from "antd";
import moment from "moment";
import TaskForm from "../task/TaskForm";
import {EllipsisOutlined} from "@ant-design/icons";
import todoApi from "../../http/todo";
import _ from "lodash";

class Month extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weekDays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      currentTask: {
        id: '',
        title: '',
        content: '',
        deadline: moment((new Date()).date).format("YYYY-MM-DD"),
        priority: 0,
        list_id: ''
      },
      days: [],
      firstDate: '',
      lastDate: '',
      taskList: [],
      taskMap: {},
      dirList: [],
    }
  }


  componentDidMount() {
    this.setDays()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.currentDateString !== prevProps.currentDateString) {
      this.setDays()
    }
  }

  render() {
    var columns = []
    this.state.weekDays.forEach((day, index) => {
      columns.push({
        title: day,
        render: (record) => this.getDayCell(record, index),
        ellipsis: true
      })
    })


    return (
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
    )
  }


  firstDayOffset() {
    const firstDayOfMonth = new Date(this.props.currentYear, this.props.currentMonth - 1, 1);
    return firstDayOfMonth.getDay()
  }

  lastDayOffset() {
    const lastDayOfLastMonth = new Date(this.props.currentYear, this.props.currentMonth, 0);
    return lastDayOfLastMonth.getDay()
  }

  lastDateOfMonth() {
    const lastDayOfLastMonth = new Date(this.props.currentYear, this.props.currentMonth, 0);
    return lastDayOfLastMonth.getDate()
  }


  lastDateOfLastMonth() {
    const lastDayOfLastMonth = new Date(this.props.currentMonth === 1 ? this.props.currentYear - 1 : this.props.currentYear, this.props.currentMonth - 1, 0);
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
      this.loadTasks()
    })
  }

  getDay(week, day) {
    const newDate = new Date()
    const currentDate = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
    var today
    var disabled
    var date
    if (week === 0) {
      if (this.firstDayOffset() <= day) {
        disabled = false
        today = this.firstDayOffset() === day ? 1 : 1 + (day - this.firstDayOffset())
        date = this.props.currentYear + '-' + this.props.currentMonth + '-' + (this.firstDayOffset() === day ? 1 : today)
      } else {
        disabled = true
        today = this.lastDateOfLastMonth() - (this.firstDayOffset() - 1 - day)
        const currentY = this.props.currentMonth === 1 ? this.props.currentYear - 1 : this.props.currentYear
        const currentM = this.props.currentMonth === 1 ? 12 : this.props.currentMonth - 1
        date = currentY + '-' + currentM + '-' + today
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
      date = this.props.currentYear + '-' + this.props.currentMonth + '-' + today
    } else {

      disabled = true
      var offsetDay = (week * 7 + day + 1) - this.lastDateOfMonth() - this.firstDayOffset()
      today = offsetDay === 1 ? 1 : offsetDay
      const currentY = this.props.currentMonth === 12 ? this.props.currentYear + 1 : this.props.currentYear
      const currentM = this.props.currentMonth === 12 ? 1 : this.props.currentMonth + 1
      date = currentY + '-' + currentM + '-' + offsetDay
    }

    return {
      day: today,
      disabled: disabled,
      date: date,
      today: currentDate === date ? true : false,
    }
  }

  loadTasks(newTask) {
    var taskList = this.state.taskList
    if (taskList.length === 0) {
      var params = {
        first_date: this.state.firstDate,
        last_date: this.state.lastDate,
        sort_order: 'desc',
        sort_by: 'priority'
      }
      todoApi.todoList(params).then(response => {
        if (response.code === 200) {
          const taskList = response.data.list && response.data.list.length > 0 ? response.data.list : []
          this.setState({taskList: taskList}, () => {
            this.setTasks(taskList)
          })
        }
      })
      return
    }

    if (newTask) {
      taskList.push(newTask)
      this.setState({taskList: taskList}, () => {
        this.setTasks(taskList)
      })

      return
    }

    this.setTasks(taskList)
    return
  }

  setTasks(taskList) {
    const conHeight = parseInt((document.documentElement.clientHeight - 65 - 70 - 50 - 42 - 60) / 6)
    const height = conHeight <= 90 ? 90 : (conHeight >= 300 ? 300 : conHeight)
    const maxNum = parseInt((height - 40) / 18) - 1

    var tasks = {}
    for (var i = 0; i < taskList.length; i++) {
      var item = taskList[i]
      let currentDate = moment(item.deadline).format("YYYY-M-D")
      if (!tasks[currentDate]) {
        tasks[currentDate] = []
      }

      if (tasks[currentDate].length > maxNum) {
        tasks[currentDate].splice(maxNum)
        tasks[currentDate].push(<span className="task-title">查看更多...</span>)
        continue;
      }

      tasks[currentDate].push(
        <Popover destroyTooltipOnHide={true} trigger="click" placement="rightTop" content={this.taskForm(item)}>
          <span className={`task-title priority-${item.priority}`}>{item.title}</span>
        </Popover>
      )
    }

    this.setState({taskMap: tasks})
  }

  taskForm(task) {
    var currentTask = _.cloneDeep(task)
    return (
      <div style={{width: '700px', maxHeight: '400px'}}>
        <TaskForm
          height="320px"
          currentTask={currentTask}
          onItemDel={this.onTaskDel}
          onTaskUpdated={this.onTaskUpdated}
          onTaskCreated={this.onTaskCreated}>
        </TaskForm>
      </div>
    )
  }

  onTaskDel = (task) => {
    var taskList = this.state.taskList
    var index = taskList.findIndex(item => {
      return item.id === task.id
    })

    if (index >= 0) {
      taskList.splice(index, 1)
      this.setState({taskList: taskList}, () => {
        this.setTasks(taskList)
      })
    }
  }

  onTaskUpdated = (task) => {
    var taskList = this.state.taskList
    var index = taskList.findIndex(item => {
      return item.id === task.id
    })

    if (index >= 0) {
      if (task.status === 2) {
        taskList.splice(index, 1)
        this.setState({taskList: taskList}, () => {
          this.setTasks(taskList)
        })
      } else {
        taskList[index] = task
        this.setState({taskList: taskList}, () => {
          this.setTasks(taskList)
        })
      }

    }
  }

  onTaskCreated = (task) => {
    this.setState({currentTask: task})
    this.loadTasks(task)
  }

  getDate(currentDay) {
    const thisDate = new Date(currentDay.date)
    const Today = <span className={`day ${currentDay.today ? ' today' : ''}`}>{currentDay.day}</span>
    if (thisDate.getDate() === 1) {
      var month = thisDate.getMonth() + 1

      if (currentDay.today) {
        return <span className="today-is-firstday">{month}月{Today}日</span>
      }

      return <span>{month}月{currentDay.day}日</span>
    }

    return Today
  }

  getDayCell(record, index) {
    const currentDay = record['week-' + index]
    const taskPopForm = (
      <div style={{width: '700px', maxHeight: '400px'}}>
        <TaskForm
          height="320px"
          date={currentDay.date}
          currentTask={this.state.currentTask}
          onItemDel={this.onTaskDel}
          onTaskUpdated={this.onTaskUpdated}
          onTaskCreated={this.onTaskCreated}>
        </TaskForm>
      </div>
    )

    return (
      <div className={`calendar-day ${currentDay.disabled ? 'disabled' : ''}`}
           style={{
             height: (document.documentElement.clientHeight - 65 - 70 - 50 - 42 - 60) / 6,
             minHeight: 90,
             maxHeight: 300
           }}>
        <div className="calendar-date-con">
          {this.getDate(currentDay)}
          <Popover
            onVisibleChange={(visible) => {
              if (!visible) {
                this.setState({
                  currentTask: {
                    id: '',
                    title: '',
                    content: '',
                    deadline: moment(currentDay.date).format("YYYY-MM-DD"),
                    priority: 0,
                    list_id: ''
                  },
                })
              }
            }}
            destroyTooltipOnHide={true}
            content={taskPopForm}
            title="新建日程" trigger="click" placement="rightTop" >
            <EllipsisOutlined className="day calendar-date-opt"/>
          </Popover>
        </div>
        <div className="calendar-item-con">
          {this.state.taskMap[currentDay.date]}
        </div>
      </div>
    )
  }
}

export default Month