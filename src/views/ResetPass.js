import React from "react"
import {getUserInfoFromLocal} from "../utils/user";
import {Button, Form, Input} from "antd";
import {browserHistory} from "react-router";
import {LockOutlined, UserOutlined, SafetyOutlined} from "@ant-design/icons";
import Pattern from "../utils/pattern";

class ResetPass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account: '',
    }
  }
  componentDidMount() {
    var userInfo = getUserInfoFromLocal()
    if (userInfo) {
      this.setState({account: userInfo.account})
    }
  }

  formItemAccount() {
    if (!this.state.account) {
      return (
        <Form.Item
          name="account"
          style={{textAlign: "right"}}
          rules={[{required: true, message: '请输入注册所使用的手机号或邮箱'}]}>
          <Input
            className="form-input"
            prefix={<UserOutlined className="form-input-prefix"/>}
            bordered={false}
            placeholder="手机号或邮箱">
          </Input>
        </Form.Item>
      )
    }
  }
  onFinish (values) {
    console.log(values)
    console.log(this.fo)
  }

  signAction(action) {
    browserHistory.push(`/${action}`)
    return
  }

  render() {
    return (
      <div className="sign-page">
        <div className="form">
          <div className="form-title">土豆清单<span className="form-title-split">·</span>密码重置</div>
          <Form
            onFinish={(values) => {
              this.onFinish(values)
            }}>
            {this.formItemAccount()}
            <Form.Item
              style={{textAlign: "right"}}
              name="password"
              rules={[{required: true, message: '密码不能为空'}, Pattern('pwd')]}>
              <Input.Password
                className="form-input"
                prefix={<LockOutlined/>}
                bordered={false}
                placeholder="新密码">
              </Input.Password>
            </Form.Item>
            <Form.Item
              style={{textAlign: "right"}}
              name="auth"
              rules={[{required: true, message: '密码不能为空'}, Pattern('pwd')]}>
              <Input.Password
                className="form-input"
                prefix={<SafetyOutlined/>}
                bordered={false}
                placeholder="新密码">
              </Input.Password>
            </Form.Item>
            <div className="form-opt">
              <Button type="text" onClick={()=> {
                this.signAction('signup')
              }}>立即注册</Button>
              <Button type="text" onClick={() => {
                this.signAction('signin')
              }}>前往登陆</Button>
            </div>
            <Form.Item>
              <Button
                className="form-submit"
                size="large"
                htmlType="submit"
                type="primary">
                重置密码
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default ResetPass