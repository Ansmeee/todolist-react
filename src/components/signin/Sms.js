import React from "react"
import {Button, Form, Input, message, Statistic} from "antd";
import {SafetyOutlined, UserOutlined} from "@ant-design/icons";
import signApi from "../../http/sign";

const {Countdown} = Statistic;

class Sms extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counting: false,
      countDate: Date.now() + 1000 * 60
    }
  }

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
          rules={[{required: true, message: '请输入手机号'}]}>
          <Input
            className="form-input"
            prefix={<UserOutlined className="form-input-prefix"/>}
            bordered={false}
            placeholder="请输入手机号">
          </Input>
        </Form.Item>
        <Form.Item
          name="password"
          style={{textAlign: "right"}}
          rules={[{required: true, message: '请输入短信验证码'}]}>
          <div className="security-code-input">
            <Input
              prefix={<SafetyOutlined className="form-input-prefix"/>}
              bordered={false}
              placeholder="请输入短信验证码">
            </Input>
            {this.countingCon()}
          </div>
        </Form.Item>
        <div className="form-opt">
          <Button type="link" onClick={() => {
            this.props.onSignWayChange()
          }}>账号密码登陆</Button>
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
    );
  }

  onFinish(values) {
    this.props.onFinish({account: values.account, password: values.password})
  }

  countingCon() {
    if (this.state.counting) {
      return (
        <Countdown
          onFinish={() => {
            this.setState({counting: false})
          }}
          value={this.state.countDate}
          format="s" suffix="s">
        </Countdown>
      )
    }

    return (
      <Button type="link" onClick={() => {
        this.sendSMSCode()
      }}>获取验证码</Button>
    )
  }

  sendSMSCode() {
    this.refs.signinForm.validateFields(['account']).then(values => {
      var form = this.refs.signinForm.getFieldsValue()
      signApi.sendSMSCode({account: form.account}).then(response => {
        if (response.code === 200) {
          if (response.msg) {
            message.success(response.msg)
          }

          this.setState({counting: true, countDate: Date.now() + 1000 * 60})
        } else {
          message.error("验证码发送失败，请重试")
        }
      })
    }).catch(error => {

    })
  }
}

export default Sms