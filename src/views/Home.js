import React from "react";
import "../assets/style/home.less"
import {browserHistory} from 'react-router'
import {Layout} from 'antd';
import Head from "../components/layout/Head";
import Side from "../components/layout/Side";
import {getUserInfoFromLocal} from "../utils/user";
const {Content, Footer} = Layout;
class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      account: "",
      name: "",
      icon: "",
      siginInForm: {
        account: '',
        auth: ''
      }
    }
  }

  render() {
    return (
      <Layout>
        <Head account={this.state.account} name={this.state.name} icon={this.state.icon}></Head>
        {this.getContent()}
        <Footer className="footer-con">
          ToDoList ©2021 Created by Ansme
        </Footer>
      </Layout>
    )
  }

  componentDidMount() {
    var userInfo = getUserInfoFromLocal()
    if (userInfo) {
      this.setState({account: userInfo.account, name: userInfo.name, icon: userInfo.icon})
    }
  }

  getContent() {
    if (this.state.account) {
      return (
        <Layout style={{height: document.documentElement.clientHeight - 65 - 70}}>
          <Side account={this.state.account}></Side>
          <Layout style={{padding: '0px 15px', height: '100%', backgroundColor: '#fff'}}>
            <Content className="site-layout-background" style={{padding: 24, margin: 0,}}>
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
      </Layout>
    )
  }
}

export default Home