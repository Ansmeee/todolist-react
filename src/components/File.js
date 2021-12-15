import React from "react";
import {PlusOutlined, FlagOutlined, CarryOutOutlined, SortAscendingOutlined, FilterOutlined} from "@ant-design/icons";
import {Row, Col, Input, Button, Popover, List, Skeleton, Space} from "antd";
import todoApi from "../http/todo";
import "../assets/style/file.less"

const IconText = ({className = "", icon = null, text = ""}) => (
  <Space className={"item-opt item-opt-" + className}>
    {icon ? React.createElement(icon) : ''}
    {text}
  </Space>
);


class File extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: {},
      filterForm: {
        keywords: '',
        sortBy  : '',
        priority: 0,
      },
      from      : props.state.from,
      loading   : false,
      todoList  : [],
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

  searchChange(e) {
    var filterForm      = this.state.filterForm
    filterForm.keywords = e.target.value

    this.setState({filterForm: filterForm})

    this.loadtodoList()
  }

  sortOptClick(sortBy) {
    var filterForm    = this.state.filterForm
    filterForm.sortBy = sortBy

    this.setState({filterForm: filterForm})

    this.loadtodoList()
  }

  filterOptClick(filterType) {
    var filterForm    = this.state.filterForm

    if (filterType === 'priority') {
      filterForm.priority = 3
    }

    this.setState({filterForm: filterForm})
    this.loadtodoList()
  }

  itemClick(item) {
    this.setState({activeItem: item})
  }

  filterPopContent() {
    return (
      <div className="filter-opt-con">
        <Button
          type="text" className="filter-opt-con-item"
          onClick={() => {
            this.filterOptClick('priority')
          }}>
          仅展示高优先级
        </Button>
      </div>
    )
  }

  sortPopContent() {
    return (
      <div className="sort-opt-con">
        <Button
          type="text" className="sort-opt-con-item"
          onClick={() => {
            this.sortOptClick('title')
          }}>
          按标题降序
        </Button>
        <Button
          type="text" className="sort-opt-con-item"
          onClick={() => {
            this.sortOptClick('deadline')
          }}>
          按时间降序
        </Button>
        <Button
          type="text" className="sort-opt-con-item"
          onClick={() => {
            this.sortOptClick('status')
          }}>
          按状态降序
        </Button>
        <Button
          type="text" className="sort-opt-con-item"
          onClick={() => {
            this.sortOptClick('priority')
          }}>
          按优先级降序
        </Button>
      </div>
    )
  }

  getListActions(item) {
    var currentDate = Date.now()
    var expireDate  = new Date(item.deadline).getTime()
    var remainDate  = expireDate - currentDate

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

    var priorityText      = '无'
    var priorityClassName = ''
    if (item.priority === 3) {
      priorityText      = '高'
      priorityClassName = 'danger'
    }

    if (item.priority === 2) {
      priorityText      = '中'
      priorityClassName = 'warning'
    }

    if (item.priority === 1) {
      priorityText      = '低'
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
      <IconText
        className={statusClassName}
        text={item.status}/>,
      <IconText
        className={priorityClassName}
        icon={FlagOutlined}
        text={priorityText}
        key="list-vertical-deadline"/>,
      <IconText
        className={deadlineClassName}
        icon={CarryOutOutlined}
        text={item.deadline}
        key="list-vertical-deadline"/>
    ]
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={16}>
            <Row style={{height: '40px', lineHeight: '40px', marginBottom: '15px'}}>
              <Col span={16} style={{paddingLeft: '16px'}}>
                <div style={{borderBottom: '1px solid #d9d9d9'}}>
                  <Input bordered={false} placeholder="输入关键字搜索" onPressEnter={(e) => {
                    this.searchChange(e)
                  }}></Input>
                </div>
              </Col>
              <Col span={4} style={{paddingLeft: '10px'}}>
                <Popover
                  placement="bottomLeft"
                  title="选择排序方式"
                  content={this.sortPopContent()}
                  trigger="click">
                  <Button type="text" className="filter-form-opt">
                    <SortAscendingOutlined/>
                  </Button>
                </Popover>
                <Popover
                  placement="bottomLeft"
                  title="过滤展示内容"
                  content={this.filterPopContent()}
                  trigger="click">
                  <Button type="text" className="filter-form-opt">
                    <FilterOutlined />
                  </Button>
                </Popover>
              </Col>
              <Col span={4} style={{textAlign: 'right', paddingRight: '16px'}}>
                <Button type="primary" icon={<PlusOutlined/>}>新 建</Button>
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
          <Col span={8}>
            <h3>{this.state.activeItem.content}</h3>
          </Col>
        </Row>
      </div>
    )
  }
}

export default File