import React from "react";
import {Button, Input, message} from "antd";
import fileApi from "../../http/file";
import {CheckOutlined, CloseOutlined, DeleteOutlined} from "@ant-design/icons";

const _ = require('lodash');
class Mydir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dirList: []
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

  options(dir) {
    var options = [
      <Button
        type="text"
        onClick={() => {
        }}>
        <CheckOutlined className="item-li-val-success"/>
      </Button>,
      <Button type="text" onClick={() => {
      }}><CloseOutlined className="item-li-val-danger"/></Button>
    ]

    const delOpt = <Button type="text" onClick={() => {
      this.delDir(dir)
    }}><DeleteOutlined className="item-li-val-danger"/></Button>
    options.push(delOpt)
    return options
  }

  delDir(dir) {
    fileApi.delete(dir.id).then(response => {
      if (response.code === 200) {
        var dirList = _.cloneDeep(this.state.dirList)
        var index = dirList.findIndex(item => {
          return item.id === dir.id
        })

        if (index >= 0) {
          dirList.splice(index, 1)
        }

        this.setState({dirList: dirList})
        message.success("已删除")
      }
    })
  }

  dirList() {
    const dirlist = this.state.dirList.map(item => {
      return (
        <div className="item-li-val">
          <Input className="item-li-val-input" bordered={false} size="small" value={item.title}></Input>
          {this.options(item)}
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