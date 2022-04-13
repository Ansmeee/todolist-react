import React from "react";
import {browserHistory} from "react-router";
import userApi from "../http/user";
import {LoadingOutlined} from "@ant-design/icons";
import {Button, Result} from "antd";
import "../assets/style/verify.less"

class EmailVerify extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      verified: 0,
    }
  }

  componentDidMount() {
    var query = browserHistory.getCurrentLocation().query
    if (query && query.token) {
      var params = {token: query.token}
      userApi.verify(params).then(response => {
        if (response.code === 200) {
          this.setState({verified: 1})
        } else {
          this.setState({verified: -1})
        }
      })
    } else {
      window.location.href = '/'
    }
  }

  render() {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        { this.verifyResult() }
      </div>
    )
  }

  verifyResult() {
    if (this.state.verified > 0) {
      return (
        <Result
          status="success"
          title={<div>邮箱验证成功！<Button  type="text" onClick={() => {window.location.href = '/'}}>返回系统>></Button></div>}
        />
      )
    }

    if (this.state.verified < 0) {
      return (
        <Result
          status="error"
          title={<div>邮箱验证失败！<Button  type="text" onClick={() => {window.location.href = '/'}}>返回系统>></Button></div>}
        />
      )
    }

    return (
      <Result
        status="info"
        title="邮箱验证中，请稍后。。。"
        icon={<LoadingOutlined />}
      />
    )
  }
}

export default EmailVerify