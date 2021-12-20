import React from "react";
import "../assets/style/home.less"
import {browserHistory} from 'react-router'

import {Layout, Menu, Breadcrumb, Row, Col} from 'antd';

const {SubMenu} = Menu;
const {Header, Content, Sider, Footer} = Layout;

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

  render() {
    return (
      <Layout className="home-page">
        <Header className="header" style = {{
            height: '60px',
            lineHeight: '60px',
            padding: '0px',
          }}>
          <div className="logo-con">土豆清单</div>
          <div className="header-opt-con">
            
          </div>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              onClick={this.handleClick}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{height: '100%', borderRight: 0}}
              mode="inline">
              <Menu.Item key="/latest">最近浏览</Menu.Item>
              <SubMenu key="sub1" title="我的文件夹">
                {this.menuItems()}
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{padding: '0 24px 24px'}}>
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
                height: document.documentElement.clientHeight - 70 - 60 - 24 - 22 - 32,
              }}>
              {this.props.children}
            </Content>
            <Footer style={{ textAlign: 'center', fontSize: '12px' }}>ToDoList ©2021 Created by Ansme</Footer>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default Home