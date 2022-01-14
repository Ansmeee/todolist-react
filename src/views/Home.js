import React from "react";
import "../assets/style/home.less"
import {browserHistory} from 'react-router'
import fileApi from '../http/file'
import {BellOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {Layout, Menu, Breadcrumb, Popover, Button, Badge, Avatar, message} from 'antd';
import signApi from "../http/sign";

const {SubMenu} = Menu;
const {Header, Content, Sider, Footer} = Layout;

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      account: "",
      name: "",
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

    var name = payload.name
    var icon = payload.icon
    var account = payload.account
    if (!account) {
      browserHistory.push("/signin")
      return
    }

    this.setState({account: account, name: name, icon: icon})
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

  signout() {
    signApi.signout().then(response => {
      if (response.code === 200) {
        window.localStorage.removeItem("token")
        window.location.href = '/'
      } else {
        message.error(response.msg || '登出失败')
      }
    })
  }

  accountOptClick(opt) {
    if (opt == 'signout') {
      this.signout()
      return
    }
  }

  getAccountCon() {
    return (
      <div>
        <Button
          block
          type="text"
          onClick={() => {
            this.accountOptClick('signout')
          }}>
          退出登陆
        </Button>
      </div>
    )
  }

  getHeaderUser() {
    if (this.state.account) {
      var icon = this.state.icon
      if (icon) {
        var avatar = (
          <Avatar src={icon}/>
        )
      } else {
        var account = this.state.name
          ? this.state.name.substring(0, 1).toUpperCase()
          : this.state.account.substring(0, 1).toUpperCase()
        var avatar = (
          <Avatar shape="square">{account}</Avatar>
        )
      }

      return (
        <div className="header-con-opt-user">
          <Popover placement="bottomRight" content={this.getAccountCon()} trigger="click">
            {avatar}
          </Popover>
        </div>
      )
    }
  }

  getHeaderNotice() {
    if (this.state.account) {
      return (
        <div className="header-con-opt-notice">
          <Badge count={5} size="small"><BellOutlined style={{fontSize: '14px'}}/></Badge>
        </div>
      )
    }
  }

  getContent() {
    if (this.state.account) {
      return (
        <Layout style={{height: document.documentElement.clientHeight - 65 - 70}}>
          <Sider width={200}>
            <Menu
              onClick={this.handleClick}
              defaultSelectedKeys={['/latest']}
              style={{height: '100%'}}
              mode="inline">
              <Menu.Item key="/latest">最近浏览</Menu.Item>
              <SubMenu key="sub1" title="我的文件夹">
                {this.menuItems()}
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{padding: '0px 15px', height: '100%', backgroundColor: '#fff'}}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
              }}>
              {this.props.children}
            </Content>
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
            height: document.documentElement.clientHeight - 65 - 70,
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
          <div className="header-con-logo"
               onClick={() => {
                 this.goHome()
               }}>土豆清单
          </div>
          <div className="header-con-opt">
            {this.getHeaderUser()}
            {this.getHeaderNotice()}
            <div className="header-con-opt-notice">
              <QuestionCircleOutlined style={{fontSize: '14px'}}/>
            </div>
          </div>
        </Header>
        {this.getContent()}
        <Footer className="footer-con">
          ToDoList ©2021 Created by Ansme
        </Footer>
      </Layout>
    )
  }
}

export default Home