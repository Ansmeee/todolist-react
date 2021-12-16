import React from "react";
import {
  PlusOutlined,
  FlagOutlined,
  CarryOutOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import {Row, Col, Input, Button, Popover, List, Skeleton, DatePicker} from "antd";
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
        sortBy: '',
        rules: [],
      },
      createTask: false,
      currentTask: {
        title: '',
        content: '',
        deadline: '',
        priority: '',
      },
      createModalVisible: false,
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

  sortOptClick(sortBy) {
    var filterForm = this.state.filterForm
    filterForm.sortBy = filterForm.sortBy === sortBy ? '' : sortBy
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
          type={this.state.filterForm.sortBy === 'deadline' ? 'link' : 'text'}
          onClick={() => {
            this.sortOptClick('deadline')
          }}>
          按时间
        </Button>
        <Button
          block
          type={this.state.filterForm.sortBy === 'status' ? 'link' : 'text'}
          onClick={() => {
            this.sortOptClick('status')
          }}>
          按状态
        </Button>
        <Button
          block
          type={this.state.filterForm.sortBy === 'priority' ? 'link' : 'text'}
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
    if (item.priority === '高') {
      priorityClassName = 'danger'
    }

    if (item.priority === '中') {
      priorityClassName = 'warning'
    }

    if (item.priority === '低') {
      priorityClassName = 'primary'
    }

    var statusClassName = ""
    if (item.status === '进行中') {
      statusClassName = 'primary'
    }

    if (item.status === '已完成') {
      statusClassName = 'success'
    }

    return [
      <Button
        type="text"
        className={"item-opt item-opt-" + statusClassName}>
        {item.status}
      </Button>,
      <Button
        type="text"
        className={"item-opt item-opt-" + priorityClassName}>
        <FlagOutlined/>{item.priority}
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

  saveTaskClick() {
    console.log(this.state.currentTask)
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
            type={this.state.currentTask.priority === '高' ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptClick('priority', '高')
            }}>
            高优先级
          </Button>
          <Button
            block
            type={this.state.currentTask.priority === '中' ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptClick('priority', '中')
            }}>
            中优先级
          </Button>
          <Button
            block
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
          <Popover
            overlayClassName="pop-opt-con"
            placement="bottomLeft"
            content={this.taskInfoPopContent('priority')}
            trigger="click">
            <Button type="text" className={this.getTaskOPTClassName()}>
              <FlagOutlined/>{this.state.currentTask.priority ? this.state.currentTask.priority : '设置优先级'}
            </Button>
          </Popover>
            <DatePicker bordered={false} inputReadOnly={true} panelRender={this.getDataSelector()}/>

          {/*<Popover*/}
          {/*  overlayClassName="pop-opt-con"*/}
          {/*  placement="bottomLeft"*/}
          {/*  content={this.taskInfoPopContent('deadline')}*/}
          {/*  trigger="click">*/}
          {/*  <Button type="text" className="task-info-opt">*/}
          {/*    <CalendarOutlined/>{this.state.currentTask.deadline ? this.state.currentTask.deadline : '设置时间'}*/}
          {/*  </Button>*/}
          {/*</Popover>*/}
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
                  <Button type={this.state.filterForm.sortBy ? 'link' : 'text'} className="filter-form-opt">
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