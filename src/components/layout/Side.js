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
      defaultOpenKey: '',
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
      this.setSelectedMenu()
      this.loadMenuList()
    }
  }

  menuContent() {
    if (this.props.account) {
      var currentPathName = browserHistory.getCurrentLocation().pathname
      var defaultOpenKey = ''
      var defaultSelectedKey = currentPathName ? currentPathName : '/latest'
      if (currentPathName.indexOf('dir') >= 0) {
        defaultOpenKey = 'dir'
      }

      return (
        <Menu
          onClick={(e) => {
            this.menuClick(e)
          }}
          defaultSelectedKeys={[defaultSelectedKey]}
          defaultOpenKeys={[defaultOpenKey]}
          style={{height: '100%'}}
          mode="inline">
          <Menu.Item key="/latest">最近查看</Menu.Item>
          <Menu.Item key="/calendar">我的日程</Menu.Item>
          <SubMenu key="dir" title="我的文件夹" onTitleClick={() => {
            window.sessionStorage.getItem("menuChange") && this.loadMenuList()
            window.sessionStorage.removeItem("menuChange")
          }}>
            {this.state.menuList}
          </SubMenu>
          <Menu.Item key="/done">已完成</Menu.Item>
        </Menu>
      )
    }
  }

  loadMenuList() {
    fileApi.fileList({}).then(response => {
      if (response.code === 200) {
        var menuList = response.data.list.map(item => {
          return <Menu.Item key={'/dir/' + item.id}>{item.title}</Menu.Item>
        })
        this.setState({menuList: menuList})
      }
    })
  }

  menuClick(e) {
    browserHistory.push(e.key)
    this.setSelectedMenu()
  }

  setSelectedMenu() {
    var currentPathName = browserHistory.getCurrentLocation().pathname
    var defaultOpenKey = ''
    if (currentPathName.indexOf('dir') >= 0) {
      defaultOpenKey = 'dir'
    }

    this.setState({defaultOpenKey: defaultOpenKey, defaultSelectedMenuKey: currentPathName})
  }
}

export default Side