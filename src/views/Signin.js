import React from "react"
import {Button, Input, Form, message} from "antd";
import "../assets/style/sign.less"
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import {browserHistory} from "react-router";
import signApi from "../http/sign"

class Signin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 'signin'
    }
  }


  signUpClick() {
    browserHistory.push("/signup")
  }

  onFinish(values) {
    signApi.signin(values).then(response => {
      if (response.code === 200) {
        window.localStorage.setItem("token", response.data.token)
        window.location.href = '/'
      } else {
        message.error(response.msg || '登陆失败')
      }
    })
  }

  render() {
    return (
      <div className="sign-page">
        <div className="signin-form">
          <div className="signin-form-title">土豆清单 · 用户登陆</div>
          <Form
            onFinish={(values) => {
              this.onFinish(values)
            }}>
            <Form.Item
              name="account"
              style={{textAlign: "right"}}
              rules={[{required: true, message: '账号不能为空'}]}>
              <Input
                className="signin-form-input"
                prefix={<UserOutlined className="signin-form-input-prefix"/>}
                bordered={false}
                placeholder="手机号或邮箱">
              </Input>
            </Form.Item>
            <Form.Item
              style={{marginTop: "50px", textAlign: "right"}}
              name="auth"
              rules={[{required: true, message: '密码不能为空'}]}>
              <Input
                className="signin-form-input"
                prefix={<LockOutlined/>}
                bordered={false}
                placeholder="密码">
              </Input>
            </Form.Item>
            <div className="signin-form-opt">
              <Button type="text">忘记密码</Button>
              <Button type="text" onClick={() => {
                this.signUpClick()
              }}>没有账号？</Button>
            </div>
            <Form.Item>
              <Button
                className="signin-form-submit"
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