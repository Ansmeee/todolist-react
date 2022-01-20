import React from "react"
import { Collapse } from 'antd'
import "../assets/style/settings.less"
import Account from "../components/settings/Account"
const { Panel } = Collapse
class Settings extends React.Component {
  render() {
    return (
      <div>
        <Account></Account>
        <Collapse bordered={false} defaultActiveKey={['1']} className="settings-page-con">
          <Panel header="账号设置" key="1"></Panel>
        </Collapse>
      </div>
    )
  }
}

export default Settings