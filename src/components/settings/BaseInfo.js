import React from "react";
import {Input, Button, message} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import userApi from '../../http/user';

const _ = require('lodash');

class userInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo   : {
        account: '',
        name   : '',
        email  : '',
        phone  : '',
        icon   : ''
      },
      originInfo : {
        account: '',
        name   : '',
        email  : '',
        phone  : '',
        icon   : ''
      },
      modifiedKey: {
        account: false,
        name   : false,
        email  : false,
        phone  : false
      }
    }
  }

  componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.account) {
      this.setState({userInfo: this.props.userInfo, originInfo: _.cloneDeep(this.props.userInfo)})
    }
  }

  confirm(key) {
    var params = {
      id   : this.state.userInfo.account,
      key  : key,
      value: this.state.userInfo[key]
    }

    userApi.updateAttr(params).then(response => {
      if (response.code === 200) {
        message.success('已更新')
        this.updateModifiedKey(key, false)
      } else {
        message.error(response.msg || '更新失败')
        this.updateModifiedKey(key, false)
      }
    })
  }

  updateModifiedKey(key, value) {
    var modifiedKey  = this.state.modifiedKey
    modifiedKey[key] = value
    this.setState({modifiedKey: modifiedKey})
  }

  updateuserInfo(key, value) {
    var userInfo  = this.state.userInfo
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
              this.confirm(key)
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

  resetPass() {
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
          <div className="item-li-label">绑定邮箱</div>
          <div className="item-li-val">
            <Input
              disabled={true}
              onChange={(e) => {
                this.updateuserInfo('email', e.target.value)
                this.updateModifiedKey('email', true)
              }}
              onPressEnter={() => {
                this.state.modifiedKey['email'] && this.confirm('email')
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
          <div className="item-li-label">用户名称</div>
          <div className="item-li-val">
            <Input
              onChange={(e) => {
                this.updateModifiedKey('name', true)
                this.updateuserInfo('name', e.target.value)
              }}
              onPressEnter={() => {
                this.state.modifiedKey['name'] && this.confirm('name')
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
          <div className="item-li-label">绑定手机</div>
          <div className="item-li-val">
            <Input
              onChange={(e) => {
                this.updateuserInfo('phone', e.target.value)
                this.updateModifiedKey('phone', true)
              }}
              onPressEnter={() => {
                this.state.modifiedKey['phone'] && this.confirm('phone')
              }}
              className="item-li-val-input"
              value={this.state.userInfo.phone}
              placeholder="未填写"
              bordered={false}>
            </Input>
            {this.getOptions('phone')}
          </div>
        </li>
        <li className="item-li">
          <div className="item-li-label">用户密码</div>
          <div>
            <Button style={{paddingLeft: '0px'}} type="link" onClick={() => {this.resetPass()}}>重置密码</Button>
          </div>
        </li>
      </div>
    )
  }
}

export default userInfo