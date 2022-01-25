import React from "react"
import {Button, Input, Form} from "antd";
import {browserHistory} from "react-router";
import {getUserInfoFromLocal} from "../utils/user";
import Email from "../components/signup/Email";
import Phone from "../components/signup/Phone";
const _ = require('lodash');
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgSending: false,
      interval: null,
      msgText: '',
      signupWay:'phone'
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

  signupForm() {
    if (this.state.signupWay === 'email') {
      return (<Email></Email>)
    }

    if (this.state.signupWay === 'phone') {
      return (<Phone></Phone>)
    }
  }

  setSignupWay() {
    var signupWay = _.cloneDeep(this.state.signupWay)
    var newWay = signupWay === 'email' ? 'phone' : 'email';
    this.setState({signupWay: newWay})
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
        <div className="signin-form">
          <div className="signin-form-title">土豆清单 · 用户注册</div>
          <Form
            onFinish={(values) => {
              this.onFinish(values)
            }}>
            {this.signupForm()}
            <div className="signin-form-opt">
              <Button type="text" onClick={this.setSignupWay}>邮箱注册</Button>
              <Button type="text" onClick={() => {
                this.signInClick()
              }}>已有账号？</Button>
            </div>
            <Form.Item>
              <Button
                className="signin-form-submit"
                htmlType="submit"
                type="primary"
                size="large">
                立即注册
              </Button>
            </Form.Item>
          </Form>

        </div>
      </div>
    )
  }
}

export default Signup
