import React from "react";
import {PlusOutlined} from "@ant-design/icons";
import {Row, Col, Input, Button, Checkbox, List, Skeleton, Typography} from "antd";
import fileApi from "../http/file";
const {Text} = Typography;

class File extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: {},
      keywords: '',
      from: props.state.from,
      loading: false,
      fileList: [],
    }
  }

  componentDidMount() {
    this.loadFileList()
  }

  loadFileList() {
    this.setState({ loading: true })
    let params = {}
    fileApi.fileList(params).then(response => {
      if (response.code == 200) {
        this.setState({ loading: false, fileList: response.data.list})
      } else {
        this.setState({ loading: false})
      }
    })
  }

  searchChange(e) {
    var keywords = e.target.value
    this.setState({keywords: keywords})
    this.loadFileList()
  }

  itemClick(item) {
    this.setState({activeItem: item})
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={16}>
            <Row style={{height: '40px', lineHeight: '40px', marginBottom: '15px'}}>
              <Col span={20} style={{paddingLeft: '16px'}}>
                <div style={{borderBottom: '1px solid #d9d9d9'}}>
                  <Input bordered={false} placeholder="输入关键字搜索" onPressEnter={(e) => {
                    this.searchChange(e)
                  }}></Input>
                </div>
              </Col>
              <Col span={4} style={{textAlign: 'right', paddingRight: '16px'}}>
                <Button type="primary" icon={<PlusOutlined/>}>新 建</Button>
              </Col>
            </Row>
            <List
              size="small"
              itemLayout="horizontal"
              dataSource={this.state.fileList}
              renderItem={item => (
                <List.Item>
                  <Skeleton loading={this.state.loading} active>
                    <Checkbox style={{marginRight: '5px'}}></Checkbox>
                    <List.Item.Meta onClick={() => {
                      this.itemClick(item)
                    }} title={item.title}/>
                    {item.tag ? <div style={{fontSize: '10px', marginLeft: '5px', cursor: 'pointer'}}>{item.tag}</div> : ''}
                    <div style={{marginLeft: '5px', cursor: 'pointer'}}>
                      <Text type="danger" style={{fontSize: '10px'}}>{item.date}</Text>
                    </div>
                  </Skeleton>
                </List.Item>
              )}
            />
          </Col>
          <Col span={8}>
            <h3>{this.state.activeItem.title}</h3>
          </Col>
        </Row>
      </div>
    )
  }
}

export default File