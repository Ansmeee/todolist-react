import React from "react";
import {
  PlusOutlined,
  FlagOutlined,
  CarryOutOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import {Row, Col, Input, Button, Popover, List, Skeleton, DatePicker, message} from "antd";
import todoApi from "../http/todo";
import "../assets/style/file.less"

const {TextArea} = Input;

class File extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeItem: {},
      filterForm: {
        keywords: '',
        sort_by: '',
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
    }
  }

  componentDidMount() {
    this.loadtodoList()
  }

  loadtodoList() {
    this.setState({loading: true})
    let params = this.state.filterForm
    todoApi.todoList(params).then(response => {
      if (response.code === 200) {
        this.setState({loading: false, todoList: response.data.list})
      } else {
        this.setState({loading: false})
      }
    })
  }

  createBTNClick() {
    this.setState({createTask: true})
  }

  submitForm() {
  }

  resetForm() {

  }

  onFormFinished() {

  }

  searchChange(e) {
    var filterForm = this.state.filterForm
    filterForm.keywords = e.target.value

    this.setState({filterForm: filterForm})

    this.loadtodoList()
  }

  sortOptClick(sort_by) {
    var filterForm = this.state.filterForm
    filterForm.sort_by = filterForm.sort_by === sort_by ? '' : sort_by
    this.setState({filterForm: filterForm})
    this.loadtodoList()
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
    this.setState({filterForm: filterForm})
    this.loadtodoList()
  }

  itemClick(item) {
    this.setState({activeItem: item})
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
          隐藏已完成
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
            this.sortOptClick('deadline')
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

  updateTask() {
    todoApi.update(this.state.currentTask).then(response => {
      if (response.code == 200) {
        message.success('保存成功')
        console.log(response.data)
      } else {
        message.error(response.msg || '保存失败')
      }
    })
  }

  createTask() {
    todoApi.create(this.state.currentTask).then(response => {
      if (response.code == 200) {
        message.success('保存成功');
        console.log(response.data)
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
    if (this.state.currentTask.priority === 3) {
      return "task-info-opt task-info-opt-danger"
    }

    if (this.state.currentTask.priority === 2) {
      return "task-info-opt task-info-opt-warning"
    }

    if (this.state.currentTask.priority === 1) {
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
            type={this.state.currentTask.priority === 3 ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptClick('priority', 3)
            }}>
            高优先级
          </Button>
          <Button
            block
            type={this.state.currentTask.priority === 2 ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptClick('priority', 2)
            }}>
            中优先级
          </Button>
          <Button
            block
            type={this.state.currentTask.priority === 1 ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptClick('priority', 1)
            }}>
            低优先级
          </Button>
          <Button
            block
            type={this.state.currentTask.priority === 0 ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptClick('priority', 0)
            }}>
            无优先级
          </Button>
        </div>
      )
    }
  }

  getDataSelector() {
    return (
      <Button type="text" className="task-info-opt">
        <CalendarOutlined/>{this.state.currentTask.deadline ? this.state.currentTask.deadline : '设置时间'}
      </Button>
    )
  }

  getTaskOptCon() {
    return (
      <Row className="task-info-opt-con">
        <Col span={20}>
          <span className={this.getTaskOPTClassName()}>
            <FlagOutlined className="task-info-opt-icon"/>
            <Popover
              overlayClassName="pop-opt-con"
              placement="bottomLeft"
              content={this.taskInfoPopContent('priority')}
              trigger="click">
              <Input
                style={{width: '100px'}}
                bordered={false}
                readOnly={true}
                placeholder="设置优先级"
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
              style={{width: '100px'}}
              inputReadOnly={true}
              placeholder="设置时间"
              allowClear={false}
              suffixIcon={null}/>
          </span>
        </Col>
        <Col span={4} style={{textAlign: 'right'}}>
          <Button type="primary" onClick={() => {
            this.saveTaskClick()
          }}>保 存</Button>
        </Col>
      </Row>
    )
  }

  getCreateTaskForm() {
    if (this.state.createTask) {
      return (
        <div className="task-info-con">
          {this.getTaskOptCon()}
          <Input
            value={this.state.createTask.title}
            bordered={false}
            placeholder="准备做什么事？"
            onChange={(e) => {
              this.taskInfoChange(e, 'title')
            }}>
          </Input>
          <TextArea
            value={this.state.createTask.content}
            rows={4}
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
      <div style={{height: '100%'}}>
        <Row className="file-page-con">
          <Col span={15} className="file-list-con">
            <Row className="file-filter-con">
              <Col span={16}>
                <div style={{borderBottom: '1px solid #d9d9d9'}}>
                  <Input bordered={false} placeholder="输入关键字搜索" onPressEnter={(e) => {
                    this.searchChange(e)
                  }}></Input>
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
              size="small"
              itemLayout="vertical"
              dataSource={this.state.todoList}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  actions={this.getListActions(item)}>
                  <Skeleton loading={this.state.loading} active>
                    <List.Item.Meta onClick={() => {
                      this.itemClick(item)
                    }}/>
                    {item.title}
                  </Skeleton>
                </List.Item>
              )}
            />
          </Col>
          <Col span={9}>
            {this.getCreateTaskForm()}
            <h3>{this.state.activeItem.content}</h3>
          </Col>
        </Row>
      </div>
    )
  }
}

export default File