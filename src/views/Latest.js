import React from "react"
import {SearchOutlined, PlusOutlined} from "@ant-design/icons";
import {Row, Col, Input, Button, List, Skeleton, Typography} from "antd";
const {Text} = Typography;

class Latest extends React.Component {
  constructor(props) {
    super(props);
    this.FileList = [
      {
        "id": 1,
        "title": 'We supply a series of design principles',
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

  render() {
    return (
      <div>
        <Row>
          <Col span={16}>
            <Row style={{height: '40px', lineHeight: '40px',}}>
              <Col span={18}>
                <Input bordered={false} placeholder="输入关键字搜索" prefix={<SearchOutlined />}></Input>
              </Col>
              <Col span={4} style={{textAlign: 'right'}}>
                <Button type="primary" icon={<PlusOutlined />}>新 建</Button>
              </Col>
            </Row>
            <List
              itemLayout="horizontal"
              dataSource={this.FileList}
              renderItem={ item => (
                <List.Item style={{cursor: 'pointer'}}>
                  <Skeleton loading={false} active avatar>
                    <List.Item.Meta title={item.title}/>
                    { item.tag ? <div style={{fontSize: '10px', marginLeft:'5px'}}>{item.tag}</div> : ''}
                    <div style={{marginLeft:'5px'}} type="text">
                      <Text type="danger" style={{fontSize: '10px'}}>{item.date}</Text>
                    </div>
                  </Skeleton>
                </List.Item>
              )}
            />
          </Col>
          <Col span={8}>col-8</Col>
        </Row>
      </div>
    )
  }
}

export default Latest