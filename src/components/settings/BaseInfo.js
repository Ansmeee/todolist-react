import React from "react";
import {Input, Button} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

class BaseInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseInfo: {
        account: '',
        name: '',
        email: '',
        phone: ''
      },
      originInfo: {
        account: '',
        name: '',
        email: '',
        phone: ''
      },
      modifiedKey: {
        account: false,
        name: false,
        email: false,
        phone: false
      }
    }
  }

  updateModifiedKey(key, value) {
    var modifiedKey = this.state.modifiedKey
    modifiedKey[key] = value
    this.setState({modifiedKey: modifiedKey})
  }

  updateBaseInfo(key, value) {
    var baseInfo = this.state.baseInfo
    baseInfo[key] = value
    this.setState({baseInfo: baseInfo})
  }

  getOptions(key) {
    if (this.state.modifiedKey[key] === true) {
      return (
        <div>
          <Button
            type="text"
            onClick={() => {
              this.updateModifiedKey(key, false)
            }}>
            <CheckOutlined className="item-li-val-success"/>
          </Button>
          <Button type="text" onClick={() => {
            this.updateBaseInfo(key, this.state.originInfo[key])
            this.updateModifiedKey(key, false)
          }}><CloseOutlined className="item-li-val-danger"/></Button>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="baseinfo-page">
        <li className="item-li">
          <div className="item-li-label">用户 ID</div>
          <div className="item-li-val">202111240001</div>
        </li>
        <li className="item-li">
          <div className="item-li-label">用户名称</div>
          <div className="item-li-val">
            <Input
              onChange={(e) => {
                this.updateBaseInfo('name', e.target.value)
                this.updateModifiedKey('name', true)
              }}
              onPressEnter={() => {
                this.state.modifiedKey['name'] && this.updateModifiedKey('name', false)
              }}
              className="item-li-val-input"
              value={this.state.baseInfo.name}
              placeholder="未填写"
              bordered={false}>
            </Input>
            {this.getOptions('name')}
          </div>
        </li>
        <li className="item-li">
          <div className="item-li-label">绑定邮箱</div>
          <div className="item-li-val">
            <Input
              onChange={(e) => {
                this.updateBaseInfo('email', e.target.value)
                this.updateModifiedKey('email', true)
              }}
              onPressEnter={() => {
                this.state.modifiedKey['email'] && this.updateModifiedKey('email', false)
              }}
              className="item-li-val-input"
              value={this.state.baseInfo.email}
              placeholder="未填写"
              bordered={false}>
            </Input>
            {this.getOptions('email')}
          </div>
        </li>
        <li className="item-li">
          <div className="item-li-label">绑定手机</div>
          <div className="item-li-val">
            <Input
              onChange={(e) => {
                this.updateBaseInfo('phone', e.target.value)
                this.updateModifiedKey('phone', true)
              }}
              onPressEnter={() => {
                this.state.modifiedKey['phone'] && this.updateModifiedKey('phone', false)
              }}
              className="item-li-val-input"
              value={this.state.baseInfo.phone}
              placeholder="未填写"
              bordered={false}>
            </Input>
            {this.getOptions('phone')}
          </div>
        </li>
      </div>
    )
  }
}

export default BaseInfo