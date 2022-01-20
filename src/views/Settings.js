import React from "react"
import { Collapse } from 'antd'
import "../assets/style/settings.less"
import Account from "../components/settings/Account"
import System from "../components/settings/System";
import BaseInfo from "../components/settings/BaseInfo";
const { Panel } = Collapse
class Settings extends React.Component {
  render() {
    return (
      <div  className="settings-page-con">
        <Account></Account>
        <Collapse bordered={false} defaultActiveKey={['1']}>
          <Panel header="基本信息" key="1">
            <BaseInfo></BaseInfo>
          </Panel>
          <Panel header="系统设置" key="1">
            <System></System>
          </Panel>
        </Collapse>
      </div>
    )
  }
}

export default Settings