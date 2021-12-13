import React from "react";
import "../assets/style/home.less"
import { browserHistory } from 'react-router'

import {Layout, Menu} from 'antd';
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
      <Layout className="home-page">
          <Header className="header">
            <div className="logo">logo</div>
          </Header>
          <Layout>
            <Sider width={200} className="sider">
              <Menu
                onClick={this.handleClick}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
                mode="inline">
                <Menu.Item key="/latest">最近浏览</Menu.Item>
                <SubMenu key="sub1" title="我的文件夹">
                  {this.menuItems()}
                </SubMenu>
              </Menu>
            </Sider>
            <Layout>
              <Content style={{padding: 10}}>
                {this.props.children}
              </Content>
            </Layout>
          </Layout>
      </Layout>
    )
  }
}

export default Home