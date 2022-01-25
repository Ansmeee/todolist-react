import React from "react"
import {Button, Input, Form} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {browserHistory} from "react-router";

class Phone extends React.Component {
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
      <div>
        <Form.Item>
          <Input
            style={{marginBottom: "50px"}}
            className="signin-form-input"
            prefix={<UserOutlined/>}
            bordered={false}
            placeholder="手机号">
          </Input>
        </Form.Item>
        <Form.Item>
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
        </Form.Item>

        <Form.Item>
          <Input.Password
            className="signin-form-input"
            prefix={<LockOutlined/>}
            bordered={false}
            placeholder="密码">
          </Input.Password>
        </Form.Item>
      </div>
    )
  }
}

export default Phone
