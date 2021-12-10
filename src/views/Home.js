import React from "react";
import "../assets/style/home.css"
import { browserHistory } from 'react-router'

import { Layout, Menu, Breadcrumb } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class Home extends React.Component {
  constructor(props) {
    super(props)
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

  handleClick = e => {
    browserHistory.push(e.key)
  }

  menuItems() {
    return this.DirList.map(dir => {
      return <Menu.Item key={'/dir/' + dir.id}>{dir.name}</Menu.Item>
    })
  }

  render() {
    return (
      <Layout>
          <Header className="header">
            <div className="logo">logo</div>
          </Header>
          <Layout>
            <Sider width={200} className="site-layout-background">
              <Menu
                onClick={this.handleClick}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
                mode="inline">
                <Menu.Item key="/latest">最近浏览</Menu.Item>
                <SubMenu key="sub1" title="我的文件">
                  {this.menuItems()}
                </SubMenu>
              </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Content
                className="site-layout-background"
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                }}>
                Content
              </Content>
            </Layout>
          </Layout>
      </Layout>
    )
  }
}

export default Home