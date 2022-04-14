import React from "react";
import {Layout, Menu} from "antd";
import {browserHistory} from "react-router";
import fileApi from "../../http/file";

const {Sider} = Layout;
const {SubMenu} = Menu;

class Side extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultOpenKey: 'dir',
      defaultSelectedMenuKey: '/latest',
      menuList: []
    }
  }

  render() {
    return (
      <Sider width={200}>
        {this.menuContent()}
      </Sider>
    )
  }

  componentDidMount() {
    if (this.props.account) {
      this.setMenuList()
      this.setSelectedMenu()
    }
  }

  menuContent() {
    if (this.props.account) {
      var currentPathName = browserHistory.getCurrentLocation().pathname
      var defaultSelectedKey = currentPathName !== '/' ? currentPathName : '/calendar'

      return (
        <Menu
          onClick={(e) => {
            this.menuClick(e)
          }}
          defaultSelectedKeys={[defaultSelectedKey]}
          defaultOpenKeys={[this.state.defaultOpenKey]}
          style={{height: document.documentElement.clientHeight - 65 - 70, overflowY: 'auto', overflowX: 'hidden'}}
          mode="inline">
          <Menu.Item key="/calendar">我的日程</Menu.Item>
          <Menu.Item key="/latest">最近查看</Menu.Item>
          <SubMenu key="dir" title="我的文件夹" onTitleClick={() => {
            this.setMenuList()
          }}>
            {this.state.menuList}
          </SubMenu>
          <Menu.Item key="/done">已完成</Menu.Item>
        </Menu>
      )
    }
  }

  setMenuList() {
    const menuString = window.sessionStorage.getItem("menu")
    if (!menuString) {
      fileApi.fileList({}).then(response => {
        if (response.code === 200) {
          window.sessionStorage.setItem("menu", JSON.stringify(response.data.list))
          var menuList = response.data.list.map(item => {
            return <Menu.Item key={'/dir/' + item.id}>{item.title}</Menu.Item>
          })
          this.setState({menuList: menuList, defaultOpenKey: menuList.length > 0 ? 'dir' : ''})
        }
      })
      return
    }

    const menu = JSON.parse(menuString)
    var menuList = menu.map(item => {
      return <Menu.Item key={'/dir/' + item.id}>{item.title}</Menu.Item>
    })

    this.setState({menuList: menuList, defaultOpenKey: menuList.length > 0 ? 'dir' : ''})
  }

  menuClick(e) {
    browserHistory.push(e.key)
    this.setSelectedMenu()
  }

  setSelectedMenu() {
    var currentPathName = browserHistory.getCurrentLocation().pathname
    this.setState({defaultSelectedMenuKey: currentPathName})
  }
}

export default Side