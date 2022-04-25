import React from "react";
import {Input, Button, message, Form} from "antd";
import {CheckOutlined, CloseOutlined, LockOutlined, SafetyOutlined} from "@ant-design/icons";
import userApi from '../../http/user';
import {setUserInfo} from "../../utils/user";
import Modal from "antd/es/modal/Modal";
import Pattern from "../../utils/pattern";
import md5 from "js-md5";

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
        icon: '',
        verified: 0
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
      },
      resetPassModal: false,
      resetPassForm: {
        password: '',
        auth: ''
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
      id: this.state.userInfo.account,
      key: key,
      value: this.state.userInfo[key]
    }

    userApi.updateAttr(params).then(response => {
      if (response.code === 200) {
        message.success('已保存')
        this.updateModifiedKey(key, false)
        if (key === 'name') {
          setUserInfo("name", this.state.userInfo[key])
        }
      } else {
        message.error(response.msg || '保存失败')
        this.updateModifiedKey(key, false)
      }
    })
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

  verifyEmail() {
    userApi.verifyEmail().then(response => {
      if (response.code === 200) {
        this.updateuserInfo('verified', 1)
        message.success("验证邮件已发送至该邮箱，请点击邮件内的链接进行验证")
      } else {
        message.error("验证邮件发送失败，请检查邮箱地址是否正确")
      }
    })
  }

  getVerifiedOpt() {
    var verified = this.state.userInfo.verified
    if (verified === 0) {
      return (
        <div>
          <Button
            type="link"
            danger
            onClick={() => {
              this.verifyEmail()
            }}>
            验证邮箱
          </Button>
        </div>
      )
    }

    if (verified === 1) {
      return (
        <div>
          <span>验证中，请前往邮箱查看</span>
        </div>
      )
    }
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
    this.setState({resetPassModal: true})
  }

  onFinish(values) {
    values.password = md5(values.password)
    values.auth = md5(values.auth)
    values.account = this.state.userInfo.account
    userApi.resetPass(values).then(response => {
      if (response.code === 200) {
        message.success("重置成功，请重新登陆")
        window.localStorage.removeItem("token")
        window.location.href = '/'
      } else {
        message.error(response.msg || "重置失败")
      }
    })
  }

  cancel = () => {
    this.refs.resetPassForm.resetFields()
    this.setState({resetPassModal: false, resetPassForm: {password: '', auth: ''}})
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
            {this.getVerifiedOpt()}
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
            <Button style={{paddingLeft: '0px'}} type="link" onClick={() => {
              this.resetPass()
            }}>重置密码</Button>
          </div>
        </li>


        <Modal
          title="密码重置"
          maskClosable={false}
          visible={this.state.resetPassModal}
          okText="重置"
          cancelText="取消"
          okButtonProps={{htmlType: 'submit', form: 'resetPassForm'}}
          onCancel={this.cancel}>
          <div className="reset-pass-form">
            <Form
              id="resetPassForm"
              ref="resetPassForm"
              onFinish={(values) => {
                this.onFinish(values)
              }}>
              <Form.Item
                name="password"
                rules={[{required: true, message: '密码不能为空'}, Pattern('pwd')]}
                style={{textAlign: "right"}}>
                <Input.Password
                  className="form-input"
                  prefix={<LockOutlined style={{color: 'rgba(0, 0, 0, 0.25)'}}/>}
                  bordered={false}
                  placeholder="新密码">
                </Input.Password>
              </Form.Item>

              <Form.Item
                name="auth"
                rules={[{required: true, message: '密码不能为空'}, Pattern('pwd')]}
                style={{textAlign: "right"}}>
                <Input.Password
                  className="form-input"
                  prefix={<SafetyOutlined style={{color: 'rgba(0, 0, 0, 0.25)'}}/>}
                  bordered={false}
                  placeholder="确认密码">
                </Input.Password>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}

export default userInfo