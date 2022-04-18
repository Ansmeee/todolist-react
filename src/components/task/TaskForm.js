import React from "react";
import "../../assets/style/taskform.less"
import {Input, message} from "antd";
import moment from "moment";
import _ from "lodash";
import todoApi from "../../http/todo";
import Vditor from "vditor";
import "vditor/dist/index.css";
import {priorityKey2Name} from "../../utils/task";
import Priority from "./options/Priority";
import Deadline from "./options/Deadline";
import Dirs from "./options/Dirs";
import {FlagOutlined} from '@ant-design/icons';

const {TextArea} = Input;

class TaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originTask: {}
    }
    this.editor = {}
  }

  componentDidMount() {
    this.createVidtor({value: this.props.currentTask.content})
    if (this.props.date) {
      var currentTask = this.props.currentTask
      currentTask.deadline = moment(this.props.date).format("YYYY-MM-DD")
      this.setState({currentTask: currentTask})
    }
    this.setState({originTask: _.cloneDeep(this.props.currentTask)})
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.currentTask.id !== prevProps.currentTask.id) {
      this.setState({originTask: _.cloneDeep(this.props.currentTask)})
      let value = this.props.currentTask.content
      let md = value && this.editor ? this.editor.html2md(value) : ''
      this.editor.setValue(md)
    }
  }

  render() {
    return (
      <div className="task-info-con" style={{height: '100%', overflowY: 'auto'}}>
        <div className="task-info-opt-con">
          <Deadline
            currentTask={this.props.currentTask}
            onDeadlineChange={(val) => {
              if (this.props.currentTask.id) {
                this.updateTaksAttr('deadline', val)
              } else {
                this.taskInfoChange('deadline', val)
                this.createTask()
              }
            }}>
          </Deadline>
          <Priority
            trigger={
              <div>
                <FlagOutlined/>
                <Input
                  style={{maxWidth: '25px', minWidth: '25px'}}
                  bordered={false}
                  readOnly={true}
                  placeholder="优先级"
                  value={priorityKey2Name(this.props.currentTask.priority)}>
                </Input>
              </div>
            }
            currentTask={this.props.currentTask}
            onPriorityChange={(val) => {
              if (this.props.currentTask.id) {
                this.updateTaksAttr('priority', val)
              } else {
                this.taskInfoChange('priority', val)
                this.createTask()
              }
            }}>
          </Priority>
        </div>
        <div>
          <TextArea
            autoSize={{minRows: 1, maxRows: 2}}
            value={this.props.currentTask.title}
            bordered={false}
            placeholder="准备做什么事？"
            onBlur={(e) => {
              if (this.props.currentTask.id) {
                this.updateTaksAttr('title', e.target.value)
              } else {
                this.taskInfoChange('title', e.target.value)
                this.createTask()
              }
            }}
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

  updateTaksAttr(key, val) {
    var params = {
      id: this.props.currentTask.id,
      name: key,
      value: val
    }
    todoApi.updateAttr(params).then(response => {
      if (response.code === 200) {
        this.taskInfoChange(key, val)
        this.props.onTaskUpdated(response.data)
      } else {
        message.error(response.msg || '保存失败')
      }
    })
  }

  taskInfoChange(key, val) {
    var currentTask = this.props.currentTask
    currentTask[key] = val
    this.setState({currentTask: currentTask})
  }

  setContent(value) {
    var content = value.getHTML()
    if (this.props.currentTask.id) {
      this.updateTaksAttr('content', content)
    } else {
      this.taskInfoChange('content', content)
      this.createTask()
    }
  }

  createTask() {
    var params = _.clone(this.props.currentTask)
    todoApi.create(params).then(response => {
      if (response.code === 200) {
        this.props.onTaskCreated(response.data)
      } else {
        message.error(response.msg || '保存失败')
      }
    })
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
}

export default TaskForm;