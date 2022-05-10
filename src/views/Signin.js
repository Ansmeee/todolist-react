import React from "react"
import {message} from "antd";
import "../assets/style/sign.less"
import {browserHistory} from "react-router";
import signApi from "../http/sign"
import {getUserInfoFromLocal, initUserInfo} from "../utils/user";
import Sms from "../components/signin/Sms";
import Account from "../components/signin/Account";

class Signin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signWay: 'account',
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

  onFinish(form) {
    form.way = this.state.signWay
    signApi.signin(form).then(response => {
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
          {this.siginForm()}
        </div>
      </div>
    )
  }

  siginForm() {
    if (this.state.signWay === "account") {
      return (
        <Account
          onFinish={(form) => {
            console.log(form)
            this.onFinish(form)
          }}
          onSignWayChange={() => {
            this.setState({signWay: 'sms'})
          }}>
        </Account>
      )
    }

    if (this.state.signWay === "sms") {
      return (
        <Sms
          onFinish={(form) => {
            this.onFinish(form)
          }}
          onSignWayChange={() => {
            this.setState({signWay: 'account'})
          }}>
        </Sms>
      )
    }
  }
}

export default Signin