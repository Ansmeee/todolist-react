import React from "react";
import {browserHistory} from "react-router";
import {
  PlusOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  SelectOutlined,
  ClearOutlined
} from "@ant-design/icons";
import {Row, Col, Input, Button, Popover, List, message} from "antd";
import todoApi from "../http/todo";
import "../assets/style/file.less"
import moment from 'moment';
import TaskForm from "./task/TaskForm";
import More from "./task/options/More";
import Action from "./task/options/Action";

const _ = require('lodash');

class File extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      keywords: '',
      filterForm: {
        rules: [],
      },
      createTask: false,
      currentTask: {
        id: '',
        title: '',
        content: '',
        deadline: '',
        priority: 0,
        list_id: ''
      },
      from: props.state.from,
      loading: false,
      todoList: [],
      priorityPopVisible: false,
      needFilter: true,
      popShow: false,
    }
  }

  componentDidMount() {
    this.loadtodoList()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.state.from !== this.props.state.from || prevProps.state.sid !== this.props.state.sid) {
      this.setState({createTask: false})
      this.preLoad()
    }
  }

  preLoad() {
    if (this.props.state.sid) {
      this.setState({needFilter: true}, () => {
        this.loadtodoList()
      })
    } else {
      this.loadtodoList()
    }
  }

  loadtodoList() {
    this.setState({loading: true})
    let params = _.cloneDeep(this.state.filterForm)
    params.from = this.props.state.from

    if (this.props.state.sid && this.state.needFilter) {
      params.id = this.props.state.sid
    }

    todoApi.todoList(params).then(response => {
      this.setState({loading: false})
      if (response.code === 200) {
        this.setState({todoList: response.data.list})
        if (params.id && response.data.list[0]) {
          this.itemClick(response.data.list[0])
        }
      }
    })
  }

  searchChange(e) {
    var filterForm = this.state.filterForm
    var keywords = e.target.value
    if ((keywords || filterForm.keywords) && (keywords !== filterForm.keywords)) {
      filterForm.keywords = keywords
      this.setState({filterForm: filterForm}, () => this.loadtodoList())
    }
  }

  sortOptClick(sort_by, sort_order = 'desc') {
    var filterForm = {}
    filterForm.rules = this.state.filterForm.rules
    if (sort_by && (this.state.filterForm.sort_by !== sort_by || this.state.filterForm.sort_by === undefined)) {
      filterForm.sort_by = sort_by
      filterForm.sort_order = sort_order
    }

    this.setState({filterForm: filterForm}, () => {
      this.loadtodoList()
    })
  }

  filterOptClick(filterType) {
    var filterForm = this.state.filterForm

    var filterRules = filterForm.rules
    if (filterType === 'priority') {
      if (!filterRules.includes('priority')) {
        filterRules.push('priority')
      } else {
        filterRules = filterRules.filter(item => item !== 'priority')
      }
    }

    if (filterType === 'status') {
      if (!filterRules.includes('status')) {
        filterRules.push('status')
      } else {
        filterRules = filterRules.filter(item => item !== 'status')
      }
    }

    filterForm.rules = filterRules
    this.setState({filterForm: filterForm}, () => {
      this.loadtodoList()
    })
  }

  filterPopContent() {
    var showStatus = ""
    if (this.props.state.from !== 'done') {
      showStatus = <Button
        block
        type={this.state.filterForm.rules.includes('status') ? 'link' : 'text'}
        onClick={() => {
          this.filterOptClick('status')
        }}>
        显示已完成
      </Button>
    }
    return (
      <div>
        <Button
          block
          type={this.state.filterForm.rules.includes('priority') ? 'link' : 'text'}
          onClick={() => {
            this.filterOptClick('priority')
          }}>
          仅显示高优
        </Button>
        {showStatus}
      </div>
    )
  }

  sortPopContent() {
    var statusSort = ""
    if (this.props.state.from !== "done") {
      statusSort = <Button
        block
        type={this.state.filterForm.sort_by === 'status' ? 'link' : 'text'}
        onClick={() => {
          this.sortOptClick('status')
        }}>
        按状态
      </Button>
    }

    return (
      <div>
        <Button
          block
          type={this.state.filterForm.sort_by === 'deadline' ? 'link' : 'text'}
          onClick={() => {
            this.sortOptClick('deadline', 'asc')
          }}>
          按时间
        </Button>
        {statusSort}
        <Button
          block
          type={this.state.filterForm.sort_by === 'priority' ? 'link' : 'text'}
          onClick={() => {
            this.sortOptClick('priority')
          }}>
          按优先级
        </Button>
      </div>
    )
  }

  itemChange(item, key, val) {
    var params = {
      id: item.id,
      name: key,
      value: val
    }
    this.updateAttr(params)
  }

  itemClick(item) {
    var currentTask = _.cloneDeep(item)
    currentTask.deadline = currentTask.deadline ? currentTask.deadline : moment().format('YYYY-MM-DD')
    this.setState({currentTask: currentTask, createTask: true})
  }

  updateAttr(params) {
    todoApi.updateAttr(params).then(response => {
      if (response.code === 200) {
        message.success('已保存')
        this.setState({currentTask: response.data})
        this.updateTodoList(response.data)
      } else {
        message.error(response.msg || '保存失败')
      }
    })
  }

  updateTodoList(todo) {
    var todoList = this.state.todoList
    var index = todoList.findIndex(item => {
      return item.id === todo.id
    })

    if ((todo.status === 2 && this.props.state.from !== 'done') || (todo.status !== 2 && this.props.state.from === 'done')) {
      todoList.splice(index, 1)
    } else {
      todoList[index] = todo
    }

    this.setState({todoList: todoList})
  }

  taskForm() {
    if (this.state.createTask) {
      return (
        <TaskForm
          height={document.documentElement.clientHeight - 65 - 70 - 55 - 70}
          currentTask={this.state.currentTask}
          onItemDel={this.onTaskDeleted}
          onTaskUpdated={this.onTaskUpdated}
          onTaskCreated={this.onTaskCreated}>
        </TaskForm>
      )
    }

    return (
      <div className="no-task-info-con">
        <SelectOutlined className="no-task-info-con-icon"/>
        <span>点击任务标题查看详情</span>
      </div>
    )
  }

  onTaskDeleted = (item) => {
    var todoList = this.state.todoList
    var index = todoList.findIndex(i => {
      return i.id === item.id
    })

    todoList.splice(index, 1)

    this.setState({todoList: todoList})
    if (todoList.length > 0) {
      this.setState({currentTask: todoList[0]})
    } else {
      this.setState({
        currentTask: {
          id: '',
          title: '',
          content: '',
          deadline: '',
          priority: 0,
          list_id: ''
        },
        createTask: false
      })
    }
  }

  onTaskUpdated = (todo) => {
    this.updateTodoList(todo)
  }

  onTaskCreated = (todo) => {
    var currentTask = _.cloneDeep(todo)
    this.setState({currentTask: currentTask})

    var todoList = this.state.todoList
    todoList.unshift(todo)
    this.setState({todoList: todoList})
  }

  clearFilters() {
    this.setState({filterForm: {rules: []}, keywords: '', needFilter: false}, () => {
      this.props.state.sid && window.history.replaceState(null, "", browserHistory.getCurrentLocation().pathname)
      this.loadtodoList()
    })
  }

  clearOpt() {
    if (this.state.filterForm.keywords
      || this.state.filterForm.rules.length > 0
      || this.state.filterForm.sort_by
      || (this.state.needFilter && this.props.state.sid)) {
      return (<ClearOutlined style={{color: "rgb(24, 144, 255)"}} onClick={() => {
        this.clearFilters()
      }}/>)
    }

    return null
  }

  render() {
    return (
      <Row className="file-page-con">
        <Col span={14} className="file-list-con">
          <Row className="file-filter-con">
            <Col span={12}>
              <div style={{borderBottom: '1px solid #d9d9d9'}}>
                <Input
                  bordered={false}
                  placeholder="输入关键字搜索"
                  suffix={this.clearOpt()}
                  onBlur={(e) => {
                    this.searchChange(e)
                  }}
                  value={this.state.keywords}
                  onChange={(e) => {
                    this.setState({keywords: e.target.value})
                  }}
                  onPressEnter={(e) => {
                    this.searchChange(e)
                  }}/>
              </div>
            </Col>
            <Col span={6} style={{paddingLeft: '10px'}}>
              <Popover
                overlayClassName="pop-opt-con"
                placement="bottomLeft"
                title={<span><SortAscendingOutlined style={{marginRight: '3px'}}/>排序方式</span>}
                content={this.sortPopContent()}
                trigger="click">
                <Button
                  type={this.state.filterForm.sort_by ? 'link' : 'text'}
                  className={this.state.filterForm.sort_by ? '' : 'filter-form-opt'}>
                  <SortAscendingOutlined/>
                </Button>
              </Popover>
              <Popover
                overlayClassName="pop-opt-con"
                placement="bottomLeft"
                title={<span><FilterOutlined style={{marginRight: '3px'}}/>展示内容</span>}
                content={this.filterPopContent()}
                trigger="click">
                <Button
                  type={this.state.filterForm.rules.length > 0 ? 'link' : 'text'}
                  className={this.state.filterForm.rules.length > 0 ? '' : 'filter-form-opt'}>
                  <FilterOutlined/>
                </Button>
              </Popover>
            </Col>
            <Col span={6} style={{textAlign: 'right', paddingRight: '16px'}}>
              <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                this.setState({
                  currentTask: {
                    id: "",
                    priority: 0,
                    deadline: moment().format('YYYY-MM-DD'),
                    list_id: this.props.state.from && parseFloat(this.props.state.from).toString() !== "NaN" ? this.props.state.from : '',
                  },
                  createTask: true
                })
              }}>新 建</Button>
            </Col>
          </Row>
          <List
            style={{
              height: document.documentElement.clientHeight - 65 - 70 - 48 - 55,
              overflowY: 'auto'
            }}
            size="small"
            itemLayout="vertical"
            loading={this.state.loading}
            dataSource={this.state.todoList}
            className="file-item-con"
            renderItem={item => (
              <List.Item
                key={item.id}
                extra={
                  <More
                    currentTask={item}
                    onItemDel={this.onTaskDeleted()}
                    onItemChange={(key, val) => {
                      this.itemChange(item, key, val)
                    }}>
                  </More>
                }
                actions={[
                  <Action
                    currentTask={item}
                    onItemChange={(key, val) => {
                      this.itemChange(item, key, val)
                    }}>
                  </Action>
                ]}>
                <div onClick={() => {
                  this.itemClick(item)
                }}>{item.title}</div>
              </List.Item>
            )}
          />
        </Col>
        <Col span={10}>{this.taskForm()}</Col>
      </Row>
    )
  }
}

export default File