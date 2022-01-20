import React from "react"
import {Button, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {browserHistory} from "react-router";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgSending: false,
      interval: null,
      msgText: ''
    }
  }

  signInClick() {
    browserHistory.push("/signin")
  }

  getMSGText() {
    if (this.state.msgSending) {
      return ""
    } else {
      return "发送验证码"
    }
  }

  sendMSGCode() {
    this.setState({msgSending: true})
  }

  render() {
    return (
      <div className="sign-page">
        <div className="signin-form">
          <div className="signin-form-title">土豆清单 · 用户注册</div>
          <Input
            style={{marginBottom: "50px"}}
            className="signin-form-input"
            prefix={<UserOutlined/>}
            bordered={false}
            placeholder="手机号">
          </Input>
          <Input
            style={{marginBottom: "50px"}}
            className="signin-form-input"
            prefix={<UserOutlined/>}
            suffix={<Button type="link" onClick={() => {
              this.sendMSGCode()
            }}>{this.getMSGText()}</Button>}
            bordered={false}
            placeholder="手机验证码">
          </Input>

          <Input
            className="signin-form-input"
            prefix={<LockOutlined/>}
            bordered={false}
            placeholder="密码">
          </Input>
          <div className="signin-form-opt">
            <Button type="text">邮箱注册</Button>
            <Button type="text" onClick={() => {
              this.signInClick()
            }}>已有账号？</Button>
          </div>
          <Button className="signin-form-submit" size="large" type="primary">立即注册</Button>
        </div>
      </div>
    )
  }
}

export default Signup
