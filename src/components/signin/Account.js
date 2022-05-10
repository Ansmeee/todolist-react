import React from "react";
import {Button, Form, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";

const md5 = require('js-md5');

class Account extends React.Component {
  render() {
    return (
      <Form
        ref="signinForm"
        onFinish={(values) => {
          this.onFinish(values)
        }}>
        <Form.Item
          name="account"
          style={{textAlign: "right"}}
          rules={[{required: true, message: '手机号或邮箱不能为空'}]}>
          <Input
            className="form-input"
            prefix={<UserOutlined className="form-input-prefix"/>}
            bordered={false}
            placeholder="请输入手机号或邮箱">
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
            placeholder="请输入密码">
          </Input.Password>
        </Form.Item>
        <div className="form-opt">
          <Button type="link" onClick={() => {
            this.props.onSignWayChange()
          }}>短信验证码登陆</Button>
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
    )
  }

  onFinish(values) {
    this.props.onFinish({account: values.account, password: md5(values.password)})
  }
}

export default Account