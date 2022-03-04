import React from "react"
import {Button, Input, Form, message} from "antd";
import "../assets/style/sign.less"
import {UserOutlined, LockOutlined, SafetyOutlined} from "@ant-design/icons";
import {browserHistory} from "react-router";
import signApi from "../http/sign"
import {getUserInfoFromLocal, initUserInfo} from "../utils/user";
import SecurityCode from "../components/SecurityCode";

const md5 = require('js-md5');

class Signin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 'signin'
    }
  }

  resetPass() {
    browserHistory.push("/resetPass")
    return
  }

  signUpClick() {
    browserHistory.push("/signup")
    return
  }

  onFinish(values) {
    values.nonce = this.refs.securityCode.state.captchaid

    values.password = md5(values.password)
    signApi.signin(values).then(response => {
      if (response.code === 200) {
        initUserInfo(response.data.token)
        window.location.href = '/'
      } else {
        message.error(response.msg || '登陆失败')
      }
    })
  }

  componentDidMount() {
    var userInfo = getUserInfoFromLocal()
    if (userInfo && userInfo.account) {
      browserHistory.push('/latest')
      return
    }
  }

  render() {
    return (
      <div className="sign-page">
        <div className="form">
          <div className="form-title">土豆清单<span className="form-title-split">·</span>用户登陆</div>
          <Form
            onFinish={(values) => {
              this.onFinish(values)
            }}>
            <Form.Item
              name="account"
              style={{textAlign: "right"}}
              rules={[{required: true, message: '账号不能为空'}]}>
              <Input
                className="form-input"
                prefix={<UserOutlined className="form-input-prefix"/>}
                bordered={false}
                placeholder="手机号或邮箱">
              </Input>
            </Form.Item>
            <Form.Item
              style={{textAlign: "right"}}
              name="password"
              rules={[{required: true, message: '密码不能为空'}]}>
              <Input.Password
                className="form-input"
                prefix={<LockOutlined/>}
                bordered={false}
                placeholder="密码">
              </Input.Password>
            </Form.Item>
            <Form.Item
              name="code"
              style={{textAlign: "right"}}
              rules={[{required: true, message: '验证码不能为空'}]}>
              <div className="security-code-input">
                <Input
                  prefix={<SafetyOutlined className="form-input-prefix"/>}
                  bordered={false}
                  placeholder="请输入验证码">
                </Input>
                <SecurityCode ref="securityCode"></SecurityCode>
              </div>
            </Form.Item>
            <div className="form-opt">
              <Button type="text" onClick={() => {
                this.resetPass()
              }}>忘记密码</Button>
              <Button type="text" onClick={() => {
                this.signUpClick()
              }}>没有账号？</Button>
            </div>
            <Form.Item>
              <Button
                className="form-submit"
                size="large"
                htmlType="submit"
                type="primary">
                立即登陆
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default Signin