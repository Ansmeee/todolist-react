import React from "react";
import "../../assets/style/taskform.less"
import {Input, message, Layout} from "antd";
import moment from "moment";
import _ from "lodash";
import todoApi from "../../http/todo";
import Vditor from "vditor";
import "vditor/dist/index.css";
import Priority from "./options/Priority";
import Deadline from "./options/Deadline";
import Dirs from "./options/Dirs";
import {CarryOutOutlined, FlagOutlined} from '@ant-design/icons';
import {priorityKey2Name} from "../../utils/task";
import {deadlineClassName, priorityClassName} from './options/ClassName';
import More from "./options/More";
import index from "../../http";

const {TextArea} = Input;
const {Header, Footer, Content} = Layout;

class TaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originTask: {},
      popShow: false,
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
      <Layout className="task-info-con" style={{height: '100%', overflow: 'hidden'}}>
        <Header className="task-info-opt-con">
          <Deadline
            trigger={
              <div className={deadlineClassName(this.props.currentTask.deadline)}>
                <CarryOutOutlined/>
                <Input
                  style={{width: '100px'}}
                  bordered={false}
                  readOnly={true}
                  value={this.props.currentTask.deadline}>
                </Input>
              </div>
            }
            pickerClassName="form-deadline-picker"
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
              <div className={priorityClassName(this.props.currentTask.priority)}>
                <FlagOutlined style={{cursor: 'text'}}/>
                <Input
                  style={{width: '37px'}}
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
        </Header>
        <Content
          className="task-info-con"
          style={{
            height: this.props.height,
            overflowY: 'auto',
          }}>
          <TextArea
            autoSize={{minRows: 1, maxRows: 2}}
            maxLength={100}
            value={this.props.currentTask.title}
            bordered={false}
            ref="titleInput"
            placeholder="准备做什么事？"
            onBlur={(e) => {
              if (this.props.currentTask.id) {
                this.updateTaksAttr('title', e.target.value)
              } else {
                if (e.target.value.length > 0) {
                  this.taskInfoChange('title', e.target.value)
                  this.createTask()
                }
              }
            }}
            onChange={(e) => {
              this.taskInfoChange('title', e.target.value)
            }}>
          </TextArea>

          <div className="editorWrap">
            <div id="vditor"/>
          </div>
        </Content>
        <Footer className="task-info-footer">
          <Dirs
            currentTask={this.props.currentTask}
            onDirChange={(val) => {
              this.taskInfoChange('type', val.label)
              if (this.props.currentTask.id) {
                this.updateTaksAttr('list_id', val.value)
              } else {
                this.taskInfoChange('list_id', val.value)
                this.createTask()
              }
            }}>
          </Dirs>
          {this.moreOpt()}
        </Footer>
      </Layout>
    )
  }

  moreOpt() {
    if (this.props.currentTask.id) {
      return (
        <More
          currentTask={this.props.currentTask}
          onItemChange={(key, val) => {
            this.updateTaksAttr(key, val)
          }}
          onItemDel={() => {
            this.editor.setValue("")
            this.props.onItemDel(this.props.currentTask)
          }}>
        </More>
      )
    }
  }

  updateTaksAttr(key, val) {
    var params = {
      id: this.props.currentTask.id,
      name: key,
      value: val
    }
    todoApi.updateAttr(params).then(response => {
      if (response.code === 200) {
        if (key === "status" && val === 2) {
          message.success("已完成")
        }
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

  setContent() {
    var content = this.editor.getHTML()
    if (this.props.currentTask.id) {
      this.updateTaksAttr('content', content)
    } else {
      if (content.length > 0) {
        this.taskInfoChange('content', content)
        this.createTask()
      }
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
      cache: {enable: false},
      cdn: "http://todoo.ansme.cc/816290818/vditor",
      upload: {
        url: index.Host() + `/rest/todo/upload`,
        linkToImgUrl: index.Host() + '/rest/todo/img',
        headers: {'Authorization': window.localStorage.getItem('token')},
        extraData: {'id': that.props.currentTask.id},
        fieldName: "upload",
        filename(name) {
          return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5)]/g, '').replace(/[\\/:|<>\]%@~]/g, '').replace('/\\s/g', '')
        },
        error(msg) {
          console.log('error', msg)
        },
        format(file, res) {
          var response = JSON.parse(res)
          if (response.code === 200) {
            return JSON.stringify({
              "msg": "",
              "code": 0,
              "data": {
                "errFiles": [],
                "succMap": response.data.success
              }
            })
          } else {
            message.error("上传失败")
          }
        }
      },
      after() {
        if (value.length > 0) {
          let md = value ? vditor.html2md(value) : ''
          vditor.setValue(md);
        } else {
          that.refs.titleInput.focus()
        }
      },
      blur() {
        that.setContent()
      }
    })
    this.editor = vditor
  }
}

export default TaskForm;