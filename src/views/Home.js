import React from "react";
import "../assets/style/home.less"
import {browserHistory} from 'react-router'

import {DownOutlined, BellOutlined} from "@ant-design/icons";
import {Layout, Menu, Breadcrumb, Popover, Button} from 'antd';

const {SubMenu} = Menu;
const {Header, Content, Sider, Footer} = Layout;

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      account: "Ansme"
    }

    this.DirList = [
      {
        "id": 1,
        "name": 1
      },
      {
        "id": 2,
        "name": 2
      },
      {
        "id": 3,
        "name": 3
      }
    ]
  }


  componentDidMount() {
    console.log('home')
  }

  handleClick = e => {
    browserHistory.push(e.key)
  }

  menuItems() {
    return this.DirList.map(dir => {
      return <Menu.Item key={'/dir/' + dir.id}>{dir.name}</Menu.Item>
    })
  }
  AccountOptClick(opt) {

  }

  getAccountCon() {
    return (
      <div>
        <Button
          block
          type="text"
          onClick={() => {
            this.AccountOptClick('signout')
          }}>
          退出登陆
        </Button>
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <Header className="header-con">
          <div className="header-con-logo">土豆清单</div>
          <div className="header-con-opt">
            <div>
              <BellOutlined />
            </div>
            <div className="header-con-opt-user">
              <Popover placement="bottomRight" content={this.getAccountCon()} trigger="click">
                <span>{ this.state.account }</span>
              </Popover>
            </div>
          </div>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              onClick={this.handleClick}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{height: document.documentElement.clientHeight - 60, borderRight: 0}}
              mode="inline">
              <Menu.Item key="/latest">最近浏览</Menu.Item>
              <SubMenu key="sub1" title="我的文件夹">
                {this.menuItems()}
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{padding: '0px 15px', height: '100%',}}>
            <Breadcrumb style={{margin: '16px 0'}}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                height: document.documentElement.clientHeight - 60 - 32 - 22 - 70
              }}>
              {this.props.children}
            </Content>
            <Footer className="footer-con">
              ToDoList ©2021 Created by Ansme
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default Home