import React from "react";
import "../../assets/style/taskform.less"
import {Button, DatePicker, Input, message, Popover, Select} from "antd";
import {CalendarOutlined, CheckOutlined, FlagOutlined, PlusOutlined} from "@ant-design/icons";
import fileApi from "../../http/file";
import moment from "moment";
import _ from "lodash";
import todoApi from "../../http/todo";

const {TextArea} = Input;
const {Option} = Select;

class TaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      TypePopVisible: false,
      typeTitle: '',
      dirList: [],
      priorityPopVisible: false
    }

    this.priorityName2Key = {
      '高': 3,
      '中': 2,
      '低': 1,
      '无': 0
    }
  }

  componentDidMount() {
    if (this.props.date) {
      var currentTask = this.props.currentTask
      currentTask.deadline = moment(this.props.date).format("YYYY-MM-DD")
      this.setState({currentTask: currentTask})
    }
    this.setDirList()
  }

  typeChange(value) {
    var currentTask = this.props.currentTask
    currentTask.list_id = value
    this.setState({currentTask: currentTask})
  }

  typeOptions() {
    return this.state.dirList.map(element =>
      <Option key={element.value} value={element.value}> {element.label}</Option>
    );
  }

  typePopoverContent() {
    return (
      <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
        <Input
          placeholder="分类描述"
          maxLength="10"
          bordered={false}
          onChange={(e) => {
            this.setState({typeTitle: e.target.value})
          }}
          onPressEnter={() => {
            this.createType()
          }}></Input>
        <Button
          type="text"
          onClick={() => {
            this.createType()
          }}>
          <CheckOutlined style={{color: 'rgb(56, 158, 13)'}}/>
        </Button>
      </div>
    )
  }

  createType() {
    if (this.state.typeTitle) {
      var params = {
        title: this.state.typeTitle
      }

      fileApi.create(params).then(response => {
        if (response.code === 200) {
          message.success('已保存')

          var dirString = window.sessionStorage.getItem("menu")
          if (dirString) {
            var dir = JSON.parse(dirString)
            dir.push(response.data)
            window.sessionStorage.setItem("menu", JSON.stringify(dir))
          }

          var dirList = this.state.dirList
          dirList.push({label: response.data.title, value: response.data.id})
          this.setState({dirList: dirList}, this.typeChange(response.data.id))
          this.setState({TypePopVisible: false})
        } else {
          message.error(response.msg || '保存失败')
        }
      })
    }
  }

  taskInfoChange(e, key) {
    var currentTask = this.props.currentTask
    currentTask[key] = e.target.value
    this.setState({currentTask: currentTask})
  }

  taskInfoOptChange(key, val) {
    var currentTask = this.props.currentTask
    currentTask[key] = val
    this.setState({currentTask: currentTask})
    this.setState({priorityPopVisible: false})
  }

  getTaskOPTClassName() {
    if (this.props.currentTask.priority === '高') {
      return "task-info-opt task-info-opt-danger"
    }

    if (this.props.currentTask.priority === '中') {
      return "task-info-opt task-info-opt-warning"
    }

    if (this.props.currentTask.priority === '低') {
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
            type={this.props.currentTask.priority === '高' ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptChange('priority', '高')
            }}>
            高优先级
          </Button>
          <Button
            block
            className="pop-opt-warning"
            type={this.props.currentTask.priority === '中' ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptChange('priority', '中')
            }}>
            中优先级
          </Button>
          <Button
            block
            className="pop-opt-primary"
            type={this.props.currentTask.priority === '低' ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptChange('priority', '低')
            }}>
            低优先级
          </Button>
          <Button
            block
            type={this.props.currentTask.priority === '无' ? 'link' : 'text'}
            onClick={() => {
              this.taskInfoOptChange('priority', '无')
            }}>
            无优先级
          </Button>
        </div>
      )
    }
  }


  updateTask() {
    var params = _.cloneDeep(this.props.currentTask)
    params.priority = this.priorityName2Key[params.priority]
    todoApi.update(params).then(response => {
      if (response.code === 200) {
        message.success('已保存')
        this.props.onTaskUpdated(response.data)
      } else {
        message.error(response.msg || '保存失败')
      }
    })
  }

  createTask() {
    var params = this.props.currentTask
    params.priority = this.priorityName2Key[params.priority]
    todoApi.create(params).then(response => {
      if (response.code === 200) {
        message.success('已保存');
        this.props.onTaskCreated(response.data)
      } else {
        message.error(response.msg || '保存失败')
      }
    })
  }

  saveTaskClick() {
    if (this.props.currentTask.id) {
      this.updateTask()
    } else {
      this.createTask()
    }
  }

  setDirList() {
    const dirString = window.sessionStorage.getItem("menu")

    if (!dirString) {
      fileApi.fileList({}).then(response => {
        if (response.code === 200) {
          window.sessionStorage.setItem("menu", JSON.stringify(response.data.list))
          const dirList = response.data.list.map(item => {
            return {label: item.title, value: item.id}
          })

          this.setState({dirList: dirList})
        }
      })
      return
    }

    const dir = JSON.parse(dirString)
    var dirList = dir.map(item => {
      return {label: item.title, value: item.id}
    })

    this.setState({dirList: dirList})
  }

  render() {
    return (
      <div className="task-info-con">
        <div className="task-info-opt-con">
          <div className="task-info-opt-pre">
            <span className={this.getTaskOPTClassName()}>
              <FlagOutlined className="task-info-opt-icon"/>
              <Popover
                overlayClassName="pop-opt-con"
                placement="bottomLeft"
                visible={this.state.priorityPopVisible}
                onVisibleChange={(visible) => {
                  this.setState({priorityPopVisible: visible})
                }}
                content={this.taskInfoPopContent('priority')}
                trigger="click">
                <Input
                  style={{maxWidth: '65px', minWidth: '20px'}}
                  bordered={false}
                  readOnly={true}
                  placeholder="优先级"
                  value={this.props.currentTask.priority}/>
              </Popover>
            </span>
            <span className={this.props.currentTask.deadline ? 'task-info-opt task-info-opt-primary' : 'task-info-opt'}>
            <CalendarOutlined className="task-info-opt-icon"/>
            <DatePicker
              onChange={(date, dateString) => {
                this.taskInfoOptChange('deadline', dateString)
              }}
              bordered={false}
              picker="date"
              value={moment(this.props.currentTask.deadline)}
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
        <div className="task-info-con-type">
          <Select
            bordered={false}
            style={{width: '100%'}}
            placeholder="选择一个分类"
            onChange={(value) => {
              this.typeChange(value)
            }}
            value={this.props.currentTask.list_id ? this.props.currentTask.list_id.toString() : null}>
            {this.typeOptions()}
          </Select>
          <Popover
            placement="bottom"
            visible={this.state.TypePopVisible}
            onVisibleChange={(visible) => {
              this.setState({TypePopVisible: visible})
            }}
            trigger="click"
            title="新增分类"
            content={() => this.typePopoverContent()}>
            <Button type="text"><PlusOutlined/></Button>
          </Popover>
        </div>

        <TextArea
          minrows={2}
          autoSize={true}
          value={this.props.currentTask.title}
          bordered={false}
          placeholder="准备做什么事？"
          onChange={(e) => {
            this.taskInfoChange(e, 'title')
          }}>
        </TextArea>

        <TextArea
          minrows={4}
          autoSize={true}
          value={this.props.currentTask.content}
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

export default TaskForm;