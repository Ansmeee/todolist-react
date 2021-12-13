import React from "react"
import {PlusOutlined} from "@ant-design/icons";
import {Row, Col, Input, Button, Checkbox, List, Skeleton, Typography} from "antd";
const {Text} = Typography;

class Latest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: {},
      keywords: ''
    }

    this.FileList = [
      {
        "id": 1,
        "title": '报表配置逻辑调整规范',
        "tag": "123",
        "date": '2021年12月12日'
      },
      {
        "id": 2,
        "title": 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        "date": '2021年12月12日'
      },
      {
        "id": 3,
        "title": 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        "date": '2021年12月12日'
      }
    ]
  }

  searchChange(e) {
    var keywords = e.target.value
  }

  itemClick(item) {
    this.setState({activeItem: item})
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={16}>
            <Row style={{height: '40px', lineHeight: '40px',}}>
              <Col span={20} style={{paddingLeft: '16px'}}>
                <div style={{borderBottom: '1px solid #d9d9d9'}}>
                  <Input bordered={false} placeholder="输入关键字搜索" onPressEnter={(e) => {this.searchChange(e)}}></Input>
                </div>
              </Col>
              <Col span={4} style={{textAlign: 'right', paddingRight: '16px'}}>
                <Button type="primary" icon={<PlusOutlined />}>新 建</Button>
              </Col>
            </Row>
            <List
              size="small"
              itemLayout="horizontal"
              dataSource={this.FileList}
              renderItem={ item => (
                <List.Item>
                  <Skeleton loading={false} active avatar>
                    <Checkbox style={{marginRight:'5px'}}></Checkbox>
                    <List.Item.Meta onClick={() => {this.itemClick(item)}} title={item.title}/>
                    { item.tag ? <div style={{fontSize: '10px', marginLeft:'5px', cursor: 'pointer'}}>{item.tag}</div> : ''}
                    <div style={{marginLeft:'5px', cursor: 'pointer'}}>
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

export default Latest