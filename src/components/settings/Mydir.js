import React from "react";
import {Button, Input, Popconfirm, message} from "antd";
import fileApi from "../../http/file";
import {CheckOutlined, CloseOutlined, DeleteOutlined} from "@ant-design/icons";

const _ = require('lodash');

class Mydir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dirList: [],
      originList: [],
      modifyIndex: {}
    }
  }

  componentDidMount() {
    this.loadDirList()
  }

  loadDirList() {
    fileApi.fileList({}).then(response => {
      if (response.code === 200) {
        this.setState({dirList: response.data.list})
      }
    })
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
        <Button type="text" onClick={() => {
          this.updateModifyIndex(index, false)
        }}><CloseOutlined className="item-li-val-danger"/></Button>
      ]
    }


    const delOpt =
      <Popconfirm title="确认删除这条记录吗？" onConfirm={() => {this.delDir(dir, index)}} okText="删除" cancelText="取消">
        <Button type="text"><DeleteOutlined className="item-li-val-danger"/>
        </Button>
      </Popconfirm>

    options.push(delOpt)
    return options
  }

  confirm(dir, index) {
    var params = {title: dir.title}
    fileApi.update(dir.id, params).then(response => {
      if (response.code === 200) {
        message.success('已保存')
        this.updateModifyIndex(index, false)
      } else {
        message.error('保存失败')
      }
    })
  }

  delDir(dir, index) {
    fileApi.delete(dir.id).then(response => {
      if (response.code === 200) {
        var dirList = _.cloneDeep(this.state.dirList)
        index >= 0 && dirList.splice(index, 1) && this.setState({dirList: dirList})
        message.success("已删除")
      }
    })
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

  dirList() {
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
            value={item.title}>
          </Input>
          {this.options(item, index)}
        </div>
      )
    })

    return <div style={{paddingTop: '9px'}}>{dirlist}</div>
  }

  render() {
    return (
      <div className="baseinfo-page">
        <li className="item-li">
          <div className="item-li-label">我的文件夹</div>
          {this.dirList()}
        </li>
      </div>
    )
  }
}

export default Mydir