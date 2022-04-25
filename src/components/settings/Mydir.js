import React from "react";
import {Button, Input, Popover, message} from "antd";
import fileApi from "../../http/file";
import {CheckOutlined, CloseOutlined, DeleteOutlined} from "@ant-design/icons";

const _ = require('lodash');

class Mydir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dirList: [],
      originList: [],
      modifyIndex: {},
      delPopVisible: {},
      newDir: false,
      newDirTitle: '',
      submitDis: false,
    }
  }

  componentDidMount() {
    this.setDirList()
  }

  setDirList() {
    const dirString = window.sessionStorage.getItem("menu")

    if (!dirString) {
      fileApi.fileList({}).then(response => {
        if (response.code === 200) {
          var originList = _.cloneDeep(response.data.list)
          this.setState({dirList: response.data.list, originList: originList})
          window.sessionStorage.setItem("menu", JSON.stringify(response.data.list))
        }
      })
      return
    }

    var dirList = JSON.parse(dirString)
    var originList = _.cloneDeep(dirList)
    this.setState({dirList: dirList, originList: originList})
  }

  options(dir, index) {
    var options = []
    if (this.state.modifyIndex[index] === true) {
      options = [
        <Button
          type="text"
          onClick={() => {
            this.confirm(dir, index)
          }}>
          <CheckOutlined className="item-li-val-success"/>
        </Button>,
        <Button
          type="text"
          onClick={() => {
            this.updateDir(index, this.state.originList[index].title)
            this.updateModifyIndex(index, false)
          }}>
          <CloseOutlined className="item-li-val-danger"/>
        </Button>
      ]
    }

    const delContent = <div>
      <span>文件夹删除后文件会被保留，是否继续？</span>
      <CheckOutlined
        style={{cursor: "pointer", color: "rgb(56, 158, 13)", margin: "0px 20px"}}
        onClick={() => {
          var visibles = this.state.delPopVisible
          visibles[index] = false
          this.setState({delPopVisible: visibles})
          this.delDir(dir, index)
        }}/>
      <CloseOutlined
        onClick={() => {
          var visibles = this.state.delPopVisible
          visibles[index] = false
          this.setState({delPopVisible: visibles})
        }}
        style={{cursor: "pointer", color: "rgb(255, 77, 79)"}}/>
    </div>

    const delOpt = <Popover visible={this.state.delPopVisible[index]} onVisibleChange={(visible) => {
      var visibles = this.state.delPopVisible
      visibles[index] = visible
      this.setState({delPopVisible: visibles})
    }} content={delContent} trigger="click">
      <Button type="text"><DeleteOutlined className="item-li-val-danger"/></Button>
    </Popover>

    options.push(delOpt)
    return options
  }

  confirm(dir, index) {
    var params = {title: dir.title}
    fileApi.update(dir.id, params).then(response => {
      if (response.code === 200) {
        message.success('已保存')
        this.updateDirList(this.state.dirList)
        this.updateModifyIndex(index, false)
      } else {
        message.error('保存失败')
      }
    })
  }

  delDir(dir, index) {
    fileApi.delete(dir.id).then(response => {
      if (response.code === 200) {
        message.success("已删除")
        var dirList = _.cloneDeep(this.state.dirList)
        index >= 0 && dirList.splice(index, 1) && this.updateDirList(dirList)
      } else {
        message.error("删除失败")
      }
    })
  }

  submit() {
    if (this.state.newDirTitle) {
      this.setState({submitDis: true}, () => {
        fileApi.create({title: this.state.newDirTitle}).then(response => {
          if (response.code === 200) {
            this.setState({newDir: false, newDirTitle: '', submitDis: false}, () => {
              var dirList = this.state.dirList
              dirList.push(response.data)
              this.updateDirList(dirList)
            })
          } else {
            this.setState({submitDis: false})
            message.error("添加失败")
          }
        })
      })
    }
  }

  updateDirList(dirList) {
    window.sessionStorage.setItem("menu", JSON.stringify(dirList))
    this.setState({dirList: dirList})
  }

  updateDir(index, value) {
    var dirList = _.cloneDeep(this.state.dirList)
    dirList[index].title = value
    this.setState({dirList: dirList})
  }

  updateModifyIndex(index, value = true) {
    var indexes = _.cloneDeep(this.state.modifyIndex)
    indexes[index] = value
    this.setState({modifyIndex: indexes})
  }

  render() {
    const dirlist = this.state.dirList.map((item, index) => {
      return (
        <div className="item-li-val">
          <Input
            className="item-li-val-input"
            bordered={false}
            size="small"
            onChange={(e) => {
              this.updateModifyIndex(index)
              this.updateDir(index, e.target.value)
            }}
            onPressEnter={(e) => {
              this.confirm(item, index)
            }}
            value={item.title}>
          </Input>
          {this.options(item, index)}
        </div>
      )
    })

    return (
      <div className="baseinfo-page">
        <li className="item-li">
          <div className="item-li-label">我的文件夹</div>
          <div style={{paddingTop: '9px'}}>
            {dirlist}
            <div className="item-li-val">
              {this.createOpt()}
            </div>
          </div>
        </li>
      </div>
    )
  }

  createOpt() {
    if (this.state.newDir) {
      return (
        <div>
          <Input
            className="item-li-val-input"
            bordered={false}
            size="small"
            placeholder="请输入文件夹名称"
            autoFocus={true}
            onChange={(e) => {
              this.setState({newDirTitle: e.target.value})
            }}
            onPressEnter={(e) => {
              if (!this.state.submitDis) {
                this.submit()
              }
            }}
            value={this.state.newDirTitle}>
          </Input>
          <Button
            type="text"
            disabled={this.state.submitDis}
            onClick={() => {
              this.submit()
            }}>
            <CheckOutlined className="item-li-val-success"/>
          </Button>
          <Button
            type="text"
            onClick={() => {
              this.setState({newDirTitle: '', newDir: false, submitDis: false})
            }}>
            <CloseOutlined className="item-li-val-danger"/>
          </Button>
        </div>
      )
    }

    return (
      <Button style={{paddingLeft: '7px'}} type="link" onClick={() => {
        this.setState({newDir: true})
      }}>新建文件夹</Button>
    )
  }
}

export default Mydir