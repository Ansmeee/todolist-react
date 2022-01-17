import React from "react"
import { Collapse } from 'antd'
import "../assets/style/settings.less"
import Account from "../components/settings/Account"
import System from "../components/settings/System";
const { Panel } = Collapse
class Settings extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Collapse bordered={false} defaultActiveKey={['1']} className="settings-page-con">
          <Panel header="账号设置" key="1">
            <Account></Account>
          </Panel>
          <Panel header="系统设置" key="2">
            <System></System>
          </Panel>
        </Collapse>
      </div>
    )
  }
}

export default Settings