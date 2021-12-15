import React from "react";
import {PlusOutlined, AlertOutlined, CarryOutOutlined} from "@ant-design/icons";
import {Row, Col, Input, Button, Checkbox, List, Skeleton, Space} from "antd";
import todoApi from "../http/todo";
import "../assets/style/file.less"

const IconText = ({className, icon, text}) => (
  <Space className={"item-opt item-opt-" + className}>
    {React.createElement(icon)}
    {text}
  </Space>
);

class File extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: {},
      keywords: '',
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
    let params = {}
    todoApi.todoList(params).then(response => {
      if (response.code == 200) {
        this.setState({loading: false, todoList: response.data.list})
      } else {
        this.setState({loading: false})
      }
    })
  }

  searchChange(e) {
    var keywords = e.target.value
    this.setState({keywords: keywords})
    this.loadtodoList()
  }

  itemClick(item) {
    this.setState({activeItem: item})
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

    var priorityText = '无'
    var priorityClassName = ''
    if (item.priority == 3) {
      priorityText = '高'
      priorityClassName = 'danger'
    }

    if (item.priority == 2) {
      priorityText = '中'
      priorityClassName = 'warning'
    }

    if (item.priority == 1) {
      priorityText = '低'
      priorityClassName = 'primary'
    }

    return [
      <IconText className={priorityClassName} icon={AlertOutlined} text={priorityText}
                key="list-vertical-deadline"></IconText>,
      <IconText className={deadlineClassName} icon={CarryOutOutlined} text={item.deadline}
                key="list-vertical-deadline"></IconText>
    ]
  }

  getPriority(priority) {

  }

  render() {
    return (
      <div>
        <Row>
          <Col span={16}>
            <Row style={{height: '40px', lineHeight: '40px', marginBottom: '15px'}}>
              <Col span={20} style={{paddingLeft: '16px'}}>
                <div style={{borderBottom: '1px solid #d9d9d9'}}>
                  <Input bordered={false} placeholder="输入关键字搜索" onPressEnter={(e) => {
                    this.searchChange(e)
                  }}></Input>
                </div>
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