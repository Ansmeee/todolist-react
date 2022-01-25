import React from "react"
import {getUserInfoFromLocal} from "../utils/user";
import {Button, Form, Input} from "antd";
import {browserHistory} from "react-router";
import {LockOutlined, UserOutlined, SafetyOutlined} from "@ant-design/icons";
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
            className="signin-form-input"
            prefix={<UserOutlined className="signin-form-input-prefix"/>}
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

  signinClick() {
    browserHistory.push("/signin")
  }
  render() {
    return (
      <div className="sign-page">
        <div className="signin-form">
          <div className="signin-form-title">土豆清单 · 密码重置</div>
          <Form
            onFinish={(values) => {
              this.onFinish(values)
            }}>
            {this.formItemAccount()}
            <Form.Item
              style={{textAlign: "right"}}
              name="password"
              rules={[{required: true, message: '密码不能为空'}]}>
              <Input.Password
                className="signin-form-input"
                prefix={<LockOutlined/>}
                bordered={false}
                placeholder="新密码">
              </Input.Password>
            </Form.Item>
            <Form.Item
              style={{textAlign: "right"}}
              name="auth"
              rules={[{required: true, message: '密码不能为空'}]}>
              <Input.Password
                className="signin-form-input"
                prefix={<SafetyOutlined/>}
                bordered={false}
                placeholder="新密码">
              </Input.Password>
            </Form.Item>
            <div className="signin-form-opt">
              <Button type="text" onClick={()=> {
                this.resetPass()
              }}>忘记密码</Button>
              <Button type="text" onClick={() => {
                this.signinClick()
              }}>前往登陆</Button>
            </div>
            <Form.Item>
              <Button
                className="signin-form-submit"
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