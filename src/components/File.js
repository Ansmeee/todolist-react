import React from "react";
import {
  PlusOutlined,
  FlagOutlined,
  CarryOutOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  CalendarOutlined,
  MoreOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import {Row, Col, Input, Select, Button, Popover, List, Skeleton, DatePicker, message} from "antd";
import todoApi from "../http/todo";
import "../assets/style/file.less"
import moment from 'moment';
import fileApi from "../http/file";

const _ = require('lodash');

const {TextArea} = Input;

class File extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filterForm: {
        rules: [],
      },
      createTask: false,
      currentTask: {
        id: '',
        title: '',
        content: '',
        deadline: '',
        priority: '',
        list_id: ''
      },
      datePickerVisible: false,
      createModalVisible: false,
      datePickerTimer: {},
      from: props.state.from,
      loading: false,
      todoList: [],
      dirList:[],
    }

    this.priorityName2Key = {
      '高': 3,
      '中': 2,
      '低': 1,
      '无': 0
    }

    this.priorityKey2Name = {
      3: '高',
      2: '中',
      1: '低',
      0: '无',
    }
  }

  componentDidMount() {
    this.loadtodoList()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.state.from != this.props.state.from) {
      this.loadtodoList()
    }
  }

  loadtodoList() {
    this.setState({loading: true})
    let params = this.state.filterForm
    params.from = this.props.state.from
    todoApi.todoList(params).then(response => {
      this.setState({loading: false})
      if (response.code === 200) {
        this.setState({todoList: response.data.list})
      }
    })
  }

  createBTNClick() {
    this.setState({currentTask: {}, createTask: true})
    this.loadDirList()
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
    if (sort_by && (this.state.filterForm.sort_by != sort_by || this.state.filterForm.sort_by === undefined)) {
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

  itemClick(item) {
    var currentTask = _.cloneDeep(item)
    currentTask.priority = this.priorityKey2Name[item.priority]
    currentTask.deadline = currentTask.deadline ? currentTask.deadline : moment().format('YYYY-MM-DD')
    this.setState({currentTask: currentTask, createTask: true})
    this.loadDirList()
  }

  filterPopContent() {
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
        <Button
          block
          type={this.state.filterForm.rules.includes('status') ? 'link' : 'text'}
          onClick={() => {
            this.filterOptClick('status')
          }}>
          显示已完成
        </Button>
      </div>
    )
  }

  sortPopContent() {
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
        <Button
          block
          type={this.state.filterForm.sort_by === 'status' ? 'link' : 'text'}
          onClick={() => {
            this.sortOptClick('status')
          }}>
          按状态
        </Button>
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

  priorityChange(item, opt) {
    var params = {
      id: item.id,
      name: 'priority',
      value: opt.toString()
    }

    this.updateAttr(params)
  }

  statusChange(item, opt) {
    var params = {
      id: item.id,
      name: 'status',
      value: opt.toString()
    }
    this.updateAttr(params)
  }

  updateAttr(params) {
    todoApi.updateAttr(params).then(response => {
      if (response.code === 200) {
        message.success('已更新')
        this.updateTodoList(response.data)
      } else {
        message.error(response.msg || '更新失败')
      }
    })
  }

  removeTodo(item) {
    todoApi.delete(item.id).then(response => {
      if (response.code === 200) {
        var todoList = this.state.todoList
        var index = todoList.findIndex(i => {
          return i.id === item.id
        })

        todoList.splice(index, 1)
        this.setState({todoList: todoList})
      }
    })
  }

  getListExtras(item) {
    var menu = (
      <div>
        <div className="item-opt-li item-opt-mul">
          <div className="item-opt-more-label">
            <CheckCircleOutlined style={{marginRight: '3px'}}/>状态
          </div>
          <div className="item-opt-mul-div">
            <Button
              type="text"
              onClick={() => {
                this.statusChange(item, 0)
              }}>未开始</Button>
            <Button
              type="text"
              className="item-opt-mul-primary"
              onClick={() => {
                this.statusChange(item, 1)
              }}>进行中</Button>
            <Button
              type="text"
              className="item-opt-mul-success"
              onClick={() => {
                this.statusChange(item, 2)
              }}>已完成</Button>
          </div>
        </div>
        <div className="item-opt-li item-opt-mul">
          <div className="item-opt-more-label">
            <UnorderedListOutlined style={{marginRight: '3px'}}/>优先级
          </div>
          <div className="item-opt-mul-div">
            <Button
              type="text"
              className="item-opt-mul-danger"
              onClick={() => {
                this.priorityChange(item, 3)
              }}>高</Button>
            <Button
              type="text"
              className="item-opt-mul-warning"
              onClick={() => {
                this.priorityChange(item, 2)
              }}>中</Button>
            <Button
              type="text"
              className="item-opt-mul-primary"
              onClick={() => {
                this.priorityChange(item, 1)
              }}>低</Button>
            <Button
              type="text"
              onClick={() => {
                this.priorityChange(item, 0)
              }}>无</Button>
          </div>
        </div>
        <div className="item-opt-li item-opt-del">
          <div onClick={() => {
            this.removeTodo(item)
          }}><DeleteOutlined/> 删除
          </div>
        </div>
      </div>
    )

    return (
      <Popover overlayClassName="item-opt-more" placement="bottomLeft" content={menu} trigger="click">
        <Button type="text">
          <MoreOutlined/>
        </Button>
      </Popover>
    )
  }

  getListActions(item) {
    var currentDate = Date.now()
    var expireDate = new Date(item.deadline).getTime()
    var remainDate = expireDate - currentDate

    var deadlineClassName = ''
    if (remainDate < 24 * 60 * 60 * 1000) {
      deadlineClassName = 'danger'
    }

    if (remainDate > 24 * 60 * 60 * 1000 && remainDate <= 3 * 24 * 60 * 60 * 1000) {
      deadlineClassName = 'warning'
    }

    if (remainDate > 3 * 24 * 60 * 60 * 1000 && remainDate <= 5 * 24 * 60 * 60 * 1000) {
      deadlineClassName = 'primary'
    }

    var priorityClassName = ''
    var priorityText = '无'
    if (item.priority === 3) {
      priorityClassName = 'danger'
      priorityText = '高'
    }

    if (item.priority === 2) {
      priorityClassName = 'warning'
      priorityText = '中'
    }

    if (item.priority === 1) {
      priorityClassName = 'primary'
      priorityText = '低'
    }

    var statusText = "未开始"
    var statusClassName = ""
    if (item.status === 1) {
      statusClassName = 'primary'
      statusText = "进行中"
    }

    if (item.status === 2) {
      statusClassName = 'success'
      statusText = "已完成"
    }

    return [
      <Button
        type="text"
        className={"item-opt item-opt-" + statusClassName}>
        <CheckCircleOutlined/>
        {statusText}
      </Button>,
      <Button
        type="text"
        className={"item-opt item-opt-" + priorityClassName}>
        <FlagOutlined/>{priorityText}
      </Button>,
      <Button
        type="text"
        className={"item-opt item-opt-" + deadlineClassName}>
        <CarryOutOutlined/>{item.deadline}
      </Button>
    ]
  }

  taskInfoOptClick(key, val) {
    var currentTask = this.state.currentTask
    currentTask[key] = val
    this.setState({currentTask: currentTask})
  }

  taskInfoChange(e, key) {
    var currentTask = this.state.currentTask
    currentTask[key] = e.target.value
    this.setState({currentTask: currentTask})
  }

  updateTodoList(todo) {
    var todoList = this.state.todoList
    var index = todoList.findIndex(item => {
      return item.id === todo.id
    })

    if (todo.status === 2) {
      todoList.splice(index, 1)
    } else {
      todoList[index] = todo
    }

    this.setState({todoList: todoList})
  }

  updateTask() {
    var params = _.cloneDeep(this.state.currentTask)
    params.priority = this.priorityName2Key[params.priority]
    todoApi.update(params).then(response => {
      if (response.code === 200) {
        message.success('已保存')
        this.updateTodoList(response.data)
      } else {
        message.error(response.msg || '保存失败')
      }
    })
  }

  createTask() {
    var params = this.state.currentTask
    params.priority = this.priorityName2Key[params.priority]
    todoApi.create(params).then(response => {
      if (response.code === 200) {
        message.success('已保存');
        var todoList = this.state.todoList

        var todo = response.data
        todoList.unshift(todo)
        this.setState({todoList: todoList})

        var currentTask = _.cloneDeep(todo)
        currentTask.priority = this.priorityKey2Name[todo.priority]
        this.setState({currentTask: currentTask})
      } else {
        message.error(response.msg || '保存失败')
      }
    })
  }

  saveTaskClick() {
    if (this.state.currentTask.id) {
      this.updateTask()
    } else {
      this.createTask()
    }
  }

  getTaskOPTClassName() {
    if (this.state.currentTask.priority === '高') {
      return "task-info-opt task-info-opt-danger"
    }

    if (this.state.currentTask.priority === '中') {
      return "task-info-opt task-info-opt-warning"
    }

    if (this.state.currentTask.priority === '低') {
      return "task-info-opt task-info-opt-primary"
    }

    return "task-info-opt"
  }

  taskInfoPopContent(opt) {
    if (opt === 'priority') {
      return (
        <div>
          <Button
            block
            className="pop-opt-danger"
            type={this.state.currentTask.priority === '高' ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptClick('priority', '高')
            }}>
            高优先级
          </Button>
          <Button
            block
            className="pop-opt-warning"
            type={this.state.currentTask.priority === '中' ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptClick('priority', '中')
            }}>
            中优先级
          </Button>
          <Button
            block
            className="pop-opt-primary"
            type={this.state.currentTask.priority === '低' ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptClick('priority', '低')
            }}>
            低优先级
          </Button>
          <Button
            block
            type={this.state.currentTask.priority === '无' ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptClick('priority', '无')
            }}>
            无优先级
          </Button>
        </div>
      )
    }
  }

  getTaskOptCon() {
    return (
      <div className="task-info-opt-con">
        <div className="task-info-opt-pre">
          <span className={this.getTaskOPTClassName()}>
            <FlagOutlined className="task-info-opt-icon"/>
            <Popover
              overlayClassName="pop-opt-con"
              placement="bottomLeft"
              content={this.taskInfoPopContent('priority')}
              trigger="click">
              <Input
                style={{maxWidth: '65px', minWidth: '20px'}}
                bordered={false}
                readOnly={true}
                placeholder="优先级"
                value={this.state.currentTask.priority}/>
            </Popover>
          </span>
          <span className={this.state.currentTask.deadline ? 'task-info-opt task-info-opt-primary' : 'task-info-opt'}>
            <CalendarOutlined className="task-info-opt-icon"/>
            <DatePicker
              onChange={(date, dateString) => {
                this.taskInfoOptClick('deadline', dateString)
              }}
              bordered={false}
              picker="date"
              value={moment(this.state.currentTask.deadline)}
              style={{maxWidth: '110px', minWidth: '110px'}}
              inputReadOnly={true}
              placeholder="时间"
              allowClear={false}
              suffixIcon={null}/>
          </span>
        </div>
        <div className="task-info-opt-end">
          <Button type="primary" onClick={() => {
            this.saveTaskClick()
          }}>保 存</Button>
        </div>
      </div>
    )
  }

  loadDirList() {
    fileApi.fileList({}).then(response => {
      if (response.code === 200) {
        var dirList = []
        response.data.list.forEach(item => {
          dirList.push({
            label: item.title,
            value: item.id,
          })
        })

        this.setState({dirList: dirList})
      }
    })
  }

  getCreateTaskForm() {
    if (this.state.createTask) {
      return (
        <div className="task-info-con">
          {this.getTaskOptCon()}
          <TextArea
            minRows={2}
            autoSize={true}
            value={this.state.currentTask.title}
            bordered={false}
            placeholder="准备做什么事？"
            onChange={(e) => {
              this.taskInfoChange(e, 'title')
            }}>
          </TextArea>
          <Select
            bordered={false}
            style={{width: '100%'}}
            placeholder="选择一个分类"
            options={this.state.dirList}
            value={this.state.currentTask.list_id}>
          </Select>
          <TextArea
            minRows={4}
            autoSize={true}
            value={this.state.currentTask.content}
            bordered={false}
            placeholder="详细信息。。。"
            onChange={(e) => {
              this.taskInfoChange(e, 'content')
            }}>
          </TextArea>
        </div>
      )
    }
  }

  render() {
    return (
      <Row className="file-page-con">
        <Col span={15} className="file-list-con">
          <Row className="file-filter-con">
            <Col span={16}>
              <div style={{borderBottom: '1px solid #d9d9d9'}}>
                <Input
                  bordered={false}
                  placeholder="输入关键字搜索"
                  onBlur={(e) => {
                    this.searchChange(e)
                  }}
                  onPressEnter={(e) => {
                    this.searchChange(e)
                  }}/>
              </div>
            </Col>
            <Col span={4} style={{paddingLeft: '10px'}}>
              <Popover
                overlayClassName="pop-opt-con"
                placement="bottomLeft"
                title="排序方式"
                content={this.sortPopContent()}
                trigger="click">
                <Button type={this.state.filterForm.sort_by ? 'link' : 'text'} className="filter-form-opt">
                  <SortAscendingOutlined/>
                </Button>
              </Popover>
              <Popover
                overlayClassName="pop-opt-con"
                placement="bottomLeft"
                title="展示内容"
                content={this.filterPopContent()}
                trigger="click">
                <Button type={this.state.filterForm.rules.length > 0 ? 'link' : 'text'} className="filter-form-opt">
                  <FilterOutlined/>
                </Button>
              </Popover>
            </Col>
            <Col span={4} style={{textAlign: 'right', paddingRight: '16px'}}>
              <Button type="primary" icon={<PlusOutlined/>} onClick={() => {
                this.createBTNClick()
              }}>新 建</Button>
            </Col>
          </Row>
          <List
            style={{
              height: document.documentElement.clientHeight - 60 - 32 - 22 - 70 - 48 - 55,
              overflowY: 'auto'
            }}
            size="small"
            itemLayout="vertical"
            dataSource={this.state.todoList}
            className="file-item-con"
            renderItem={item => (
              <List.Item
                key={item.id}
                extra={this.getListExtras(item)}
                actions={this.getListActions(item)}>
                <Skeleton loading={this.state.loading} active>
                  <div onClick={() => {
                    this.itemClick(item)
                  }}>{item.title}</div>
                </Skeleton>
              </List.Item>
            )}
          />
        </Col>
        <Col span={9}>
          {this.getCreateTaskForm()}
        </Col>
      </Row>
    )
  }
}

export default File