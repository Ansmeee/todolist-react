import React from "react";
import "../assets/style/home.less"
import {browserHistory} from 'react-router'
import fileApi from '../http/file'
import {BellOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {Layout, Menu, Breadcrumb, Popover, Button, Badge, Avatar} from 'antd';

const {SubMenu} = Menu;
const {Header, Content, Sider, Footer} = Layout;

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      account: "",
      dirList: [],
      siginInForm: {
        account: '',
        auth: ''
      }
    }
  }

  componentDidMount() {
    var token = window.localStorage.getItem("token")
    if (!token) {
      browserHistory.push("/signin")
      return
    }

    var tokenArr = token.split(".")
    var payload = JSON.parse(atob(tokenArr[1]))
    var expiredat = new Date(payload.expiredat)
    var currentTime = new Date()

    if (currentTime > expiredat) {
      browserHistory.push("/signin")
      return
    }

    var account = payload.account
    if (!account) {
      browserHistory.push("/signin")
      return
    }

    this.setState({account: account})
    this.loadMenuList()
  }

  goHome() {
    window.location.href = '/'
  }

  handleClick = e => {
    browserHistory.push(e.key)
  }

  loadMenuList() {
    fileApi.fileList({}).then(response => {
      if (response.code === 200) {
        this.setState({dirList: response.data.list})
      }
    })
  }

  menuItems() {
    return this.state.dirList.map(dir => {
      return <Menu.Item key={'/dir/' + dir.id}>{dir.title}</Menu.Item>
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

  getContent() {
    if (this.state.account) {
      return (
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              onClick={this.handleClick}
              defaultSelectedKeys={['/latest']}
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
      )
    }

    return (
      <Layout>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            height: document.documentElement.clientHeight - 60 - 70,
            overflowY: 'auto'
          }}>
          {this.props.children}
        </Content>
        <Footer className="footer-con">
          ToDoList ©2021 Created by Ansme
        </Footer>
      </Layout>
    )
  }

  render() {
    return (
      <Layout>
        <Header className="header-con">
          <div className="header-con-logo" onClick={() => {this.goHome()}}>土豆清单</div>
          <div className="header-con-opt">
            <div className="header-con-opt-user">
              <Popover placement="bottomRight" content={this.getAccountCon()} trigger="click">
                <Avatar shape="square"></Avatar>
              </Popover>
            </div>
            <div className="header-con-opt-notice">
              <Badge count={5} size="small"><BellOutlined style={{fontSize: '14px'}}/></Badge>
            </div>
            <div className="header-con-opt-notice">
              <QuestionCircleOutlined style={{fontSize: '14px'}}/>
            </div>
          </div>
        </Header>
        {this.getContent()}
      </Layout>
    )
  }
}

export default Home