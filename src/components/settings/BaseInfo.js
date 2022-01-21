import React from "react";
import {Input, Button} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
const _ = require('lodash');

class userInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {
        account: '',
        name: '',
        email: '',
        phone: '',
        icon: ''
      },
      originInfo: {
        account: '',
        name: '',
        email: '',
        phone: '',
        icon: ''
      },
      modifiedKey: {
        account: false,
        name: false,
        email: false,
        phone: false
      }
    }
  }

  componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.account) {
      this.setState({userInfo: this.props.userInfo, originInfo: _.cloneDeep(this.props.userInfo)})
    }
  }

  updateModifiedKey(key, value) {
    var modifiedKey = this.state.modifiedKey
    modifiedKey[key] = value
    this.setState({modifiedKey: modifiedKey})
  }

  updateuserInfo(key, value) {
    var userInfo = this.state.userInfo
    userInfo[key] = value
    this.setState({userInfo: userInfo})
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
            this.updateuserInfo(key, this.state.originInfo[key])
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
          <div className="item-li-val">
            <Input
              bordered={false}
              disabled={true}
              value={this.state.userInfo.account}
              className="item-li-val-input">
            </Input>
          </div>
        </li>
        <li className="item-li">
          <div className="item-li-label">用户名称</div>
          <div className="item-li-val">
            <Input
              onChange={(e) => {
                this.updateuserInfo('name', e.target.value)
                this.updateModifiedKey('name', true)
              }}
              onPressEnter={() => {
                this.state.modifiedKey['name'] && this.updateModifiedKey('name', false)
              }}
              className="item-li-val-input"
              value={this.state.userInfo.name}
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
                this.updateuserInfo('email', e.target.value)
                this.updateModifiedKey('email', true)
              }}
              onPressEnter={() => {
                this.state.modifiedKey['email'] && this.updateModifiedKey('email', false)
              }}
              className="item-li-val-input"
              value={this.state.userInfo.email}
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
                this.updateuserInfo('phone', e.target.value)
                this.updateModifiedKey('phone', true)
              }}
              onPressEnter={() => {
                this.state.modifiedKey['phone'] && this.updateModifiedKey('phone', false)
              }}
              className="item-li-val-input"
              value={this.state.userInfo.phone}
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

export default userInfo