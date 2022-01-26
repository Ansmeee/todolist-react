import React from "react"
import {Button, Input, Form, message} from "antd";
import {browserHistory} from "react-router";
import {getUserInfoFromLocal, initUserInfo} from "../utils/user";
import Email from "../components/signup/Email";
import Phone from "../components/signup/Phone";
import signApi from "../http/sign";
const _ = require('lodash');
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgSending: false,
      interval: null,
      msgText: '',
      signupWay:'email'
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

  onFinish(values) {
    values.way = this.state.signupWay
    signApi.signup(values).then(response => {
      if (response.code === 200) {
        initUserInfo(response.data.token)
        window.location.href = '/'
      } else if (response.code === 302) {
        message.success('注册成功')
        window.location.href = '/signin'
      } else {
        message.error(response.msg || '注册失败')
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
          <div className="form-title">土豆清单 · 用户注册</div>
          <Form
            onFinish={(values) => {
              this.onFinish(values)
            }}>
            {this.signupForm()}
            <div className="form-opt">
              <Button type="text" onClick={this.setSignupWay}>邮箱注册</Button>
              <Button type="text" onClick={() => {
                this.signInClick()
              }}>已有账号？</Button>
            </div>
            <Form.Item>
              <Button
                className="form-submit"
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
