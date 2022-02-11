import React from "react"
import {Collapse, message} from 'antd'
import "../assets/style/settings.less"
import Account from "../components/settings/Account"
import Mydir from "../components/settings/Mydir";
import BaseInfo from "../components/settings/BaseInfo";
import userApi from "../http/user";
import _ from "lodash";
import {getUserInfoFromLocal} from "../utils/user";
import {browserHistory} from "react-router";
const { Panel } = Collapse
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null
    }
  }

  componentDidMount() {
    var userInfo = getUserInfoFromLocal()
    if (!userInfo) {
      browserHistory.push("/signin")
      return
    }

    if (userInfo.account) {
      this.loadUserInfo(userInfo.account)
    }
  }

  loadUserInfo(account) {
    var params = {
      id: account
    }
    userApi.info(params).then(response => {
      if (response.code === 200) {
        var userInfo = {
          account: response.data.id,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          icon: response.data.icon
        }

        this.setState({userInfo: userInfo})
      } else {
        message.error(response.msg || '用户信息获取失败')
      }
    })
  }

  baseInfo() {
    if (this.state.userInfo) {
      return <BaseInfo userInfo={this.state.userInfo}></BaseInfo>
    }
  }

  accountInfo () {
    if (this.state.userInfo) {
      return <Account userInfo={this.state.userInfo}></Account>
    }
  }

  render() {
    return (
      <div  className="settings-page-con">
        {this.accountInfo()}
        <div style={{overflowY: "auto", height: document.documentElement.clientHeight - 65 - 70 - 150 - 48}}>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}>
            <Panel header="基本信息" key="1">
              {this.baseInfo()}
            </Panel>
            <Panel header="系统设置" key="2">
              <Mydir></Mydir>
            </Panel>
          </Collapse>
        </div>
      </div>
    )
  }
}

export default Settings