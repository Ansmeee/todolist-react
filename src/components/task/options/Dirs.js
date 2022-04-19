import React from "react";
import {Button, Input, message, Popover, Select} from "antd";
import {CheckOutlined, PlusOutlined, FolderOutlined} from "@ant-design/icons";
import fileApi from "../../../http/file";

class Dirs extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dirPopVisible: false,
      dirList: [],
      TypePopVisible: false,
    }
  }

  componentDidMount() {
    this.setDirList()
  }

  render() {
    var dirOptions = this.state.dirList.map(element =>
      <Button
        block
        type="text"
        onClick={() => {
          this.dirSelected(element)
        }}>{element.label}</Button>
    )

    const popCon = (
      <div>
        {dirOptions}
        <Popover
          placement="bottom"
          visible={this.state.TypePopVisible}
          onVisibleChange={(visible) => {
            this.setState({TypePopVisible: visible})
          }}
          trigger="click"
          title="新增分类"
          content={() => this.typePopoverContent()}>
          <Button type="text" style={{fontSize: '12px', color: "rgba(0, 0, 0, 0.45)"}}>
            <PlusOutlined/>创建新目录
          </Button>
        </Popover>
      </div>
    )
    return (
      <div className="task-info-opt">
        <Popover
          overlayClassName="dir-opt-pop"
          placement="bottomLeft"
          visible={this.state.dirPopVisible}
          onVisibleChange={(visible) => {
            this.setState({dirPopVisible: visible})
          }}
          content={popCon}
          trigger="click">
          <div>
            <FolderOutlined/>
            <Input
              style={{maxWidth: '120px', minWidth: '120px'}}
              bordered={false}
              readOnly={true}
              placeholder="选择一个目录"
              value={this.props.currentTask.type}>
            </Input>
          </div>

        </Popover>
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
          var dirString = window.sessionStorage.getItem("menu")
          if (dirString) {
            var dir = JSON.parse(dirString)
            dir.push(response.data)
            window.sessionStorage.setItem("menu", JSON.stringify(dir))
          }

          var dirList = this.state.dirList
          var newDir = {label: response.data.title, value: response.data.id}
          dirList.push(newDir)
          this.setState({dirList: dirList, TypePopVisible: false}, () => {
              this.dirSelected(newDir)
            }
          )
        } else {
          message.error(response.msg || '保存失败')
        }
      })
    }
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

  dirSelected(item) {
    this.setState({dirPopVisible: false})
    this.props.onDirChange(item)
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


          console.log(this.props.currentTask.list_id)
          if (this.props.currentTask.list_id) {
            var task = this.props.currentTask
            var index = dirList.findIndex(item => {
              return item.id === task.list_id
            })

            if (index >= 0) {
              task['type'] = dirList[index].title
            }
            this.setState({currentTask: task})
          }

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
}

export default Dirs