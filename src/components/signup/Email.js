import React from "react"
import {Form, Input} from "antd";
import {MailOutlined, LockOutlined, SafetyOutlined} from "@ant-design/icons";
import Pattern from "../../utils/pattern";
class Email extends React.Component {
  render() {
    return (
      <div>
        <Form.Item
          style={{textAlign: "right"}}
          name="account"
          rules={[{required: true, message: '邮箱不能为空'}, Pattern('email')]}>
          <Input
            className="form-input"
            prefix={<MailOutlined />}
            bordered={false}
            placeholder="邮箱">
          </Input>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{required: true, message: '密码不能为空'}, Pattern('pwd')]}
          style={{textAlign: "right"}}>
          <Input.Password
            className="form-input"
            prefix={<LockOutlined/>}
            bordered={false}
            placeholder="密码">
          </Input.Password>
        </Form.Item>

        <Form.Item
          name="auth"
          rules={[{required: true, message: '密码不能为空'}, Pattern('pwd')]}
          style={{textAlign: "right"}}>
          <Input.Password
            className="form-input"
            prefix={<SafetyOutlined/>}
            bordered={false}
            placeholder="确认密码">
          </Input.Password>
        </Form.Item>
      </div>
    )
  }
}

export default Email