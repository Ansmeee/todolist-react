import React from "react";
import "../../assets/style/taskform.less"
import {Button, DatePicker, Input, message, Popover, Select} from "antd";
import {CalendarOutlined, CheckOutlined, FlagOutlined, PlusOutlined} from "@ant-design/icons";
import fileApi from "../../http/file";
import moment from "moment";
import _ from "lodash";
import todoApi from "../../http/todo";
import Vditor from "vditor";
import "vditor/dist/index.css";
import {priorityName2Key} from "../../utils/task";
import Priority from "./options/Priority";
import Deadline from "./options/Deadline";

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

    this.editor = null
  }

  componentDidMount() {
    this.createVidtor({value: this.props.currentTask.content})
    if (this.props.date) {
      var currentTask = this.props.currentTask
      currentTask.deadline = moment(this.props.date).format("YYYY-MM-DD")
      this.setState({currentTask: currentTask})
    }
    this.setDirList()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.currentTask.id !== prevProps.currentTask.id) {
      let value = this.props.currentTask.content
      let md = value ? this.editor.html2md(value) : ''
      this.editor.setValue(md)
    }
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
          }}/>
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

  taskInfoChange(key, val) {
    var currentTask = this.props.currentTask
    currentTask[key] = val
    this.setState({currentTask: currentTask})
  }

  setContent(value) {
    var currentTask = this.props.currentTask
    currentTask['content'] = value.getHTML()
    this.setState({currentTask: currentTask})
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

  updateTask() {
    var params = _.cloneDeep(this.props.currentTask)
    params.priority = priorityName2Key(params.priority)

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
    var params = _.clone(this.props.currentTask)
    params.priority = priorityName2Key(params.priority)
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

  createVidtor = params => {
    let {value} = params;
    value = value ? value : "";
    var that = this
    var vditor = new Vditor("vditor", {
      placeholder: "具体要怎么做。。。",
      toolbar: [],
      classes: "task-editor",
      after() {
        let md = value ? vditor.html2md(value) : ''
        vditor.setValue(md);
      },
      blur() {
        that.setContent(vditor)
      },
    })
    this.editor = vditor
  }

  render() {
    return (
      <div className="task-info-con" style={{height: '100%', overflowY: 'auto'}}>
        <div className="task-info-opt-con">
          <div className="task-info-opt-pre">
            <Priority
              trigger={
                <Input
                  style={{maxWidth: '65px', minWidth: '20px'}}
                  bordered={false}
                  readOnly={true}
                  placeholder="优先级"
                  value={this.props.currentTask.priority}>
                </Input>
              }
              currentTask={this.props.currentTask}
              onPriorityChange={(val) => {
                this.taskInfoChange('priority', val)
              }}>
            </Priority>
            <Deadline
              currentTask={this.props.currentTask}
              onDeadlineChange={(val) => {
                this.taskInfoChange('deadline', val)
              }}>
            </Deadline>
          </div>
          <div className="task-info-opt-end">
            <Button
              type="primary"
              onClick={() => {
                this.saveTaskClick()
              }}>
              保 存
            </Button>
          </div>
        </div>
        <div>
          <div className="task-info-con-type">
            <Select
              bordered={false}
              style={{width: '100%'}}
              placeholder="选择一个分类"
              onChange={(value) => {
                this.typeChange(value)
              }}
              value={this.props.currentTask.list_id > 0 ? this.props.currentTask.list_id.toString() : null}>
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
            autoSize={{minRows: 1, maxRows: 2}}
            value={this.props.currentTask.title}
            bordered={false}
            placeholder="准备做什么事？"
            onChange={(e) => {
              this.taskInfoChange('title', e.target.value)
            }}>
          </TextArea>

          <div className="editorWrap">
            <div id="vditor"/>
          </div>
        </div>
      </div>
    )
  }
}

export default TaskForm;