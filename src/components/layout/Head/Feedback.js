import React from "react";
import {PlusOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {Form, Input, message, Upload} from "antd";
import Modal from "antd/es/modal/Modal";
import feedbackApi from "../../../http/feedback";

class Feedback extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        content: ''
      },
      imgList: [],
      previewImage: '',
      previewVisible: false,
      previewTitle: '',
      uploading: false,
      feedbackDia: false
    }
  }

  render() {
    return (
      <div className="header-con-opt-notice">
        <QuestionCircleOutlined onClick={this.showFeedPop} style={{fontSize: '14px'}}/>
        <Modal
          width={600}
          title="反馈与建议"
          maskClosable={false}
          visible={this.state.feedbackDia}
          okText="提交"
          cancelText="取消"
          okButtonProps={{htmlType: 'submit', form: 'feedbackForm', disabled: this.state.uploading}}
          onCancel={this.cancel}>
          <div className="feed-back-pop">
            <Form
              id="feedbackForm"
              ref="feedbackForm"
              onFinish={(values) => {
                this.onFinish(values)
              }}>
              <Form.Item
                name="content"
                rules={[{required: true, message: '请输入您的宝贵建议'}]}
                style={{textAlign: "left"}}>
                <Input.TextArea
                  autoSize={{minRows: 4, maxRows: 4}}
                  bordered={false}
                  maxLength={150}
                  showCount={true}
                  placeholder="您的建议。。。">
                </Input.TextArea>
              </Form.Item>
              <div style={{marginTop: '10px', marginBottom: '10px'}}>
                <Upload
                  multiple={true}
                  name="imgs"
                  listType="picture-card"
                  fileList={this.state.imgList}
                  onPreview={this.handlePreview}
                  beforeUpload={() => {
                    return false
                  }}
                  onChange={({fileList: newFileList}) => {
                    this.setState({imgList: newFileList})
                  }}>
                  {this.state.imgList.length >= 4 ? null : <PlusOutlined/>}
                </Upload>
              </div>
            </Form>
          </div>
        </Modal>

        <Modal
          visible={this.state.previewVisible}
          title={this.state.previewTitle}
          footer={null}
          onCancel={() => {
            this.setState({previewVisible: false, previewImage: ''})
          }}>
          <img alt="example" style={{width: '100%'}} src={this.state.previewImage}/>
        </Modal>
      </div>
    )
  }

  onFinish(values) {
    const imgList = this.state.imgList
    const formData = new FormData();
    imgList.forEach(file => {
      formData.append('imgs[]', file.originFileObj)
    })

    formData.append('content', values.content)
    this.setState({uploading: true}, () => {
      feedbackApi.submit(formData).then(response => {
        if (response.code === 200) {
          message.success('已提交，感谢您的反馈建议')
          this.refs.feedbackForm.resetFields()
          this.setState({feedbackDia: false, uploading: false, form: {content: ''}, imgList: []})
        } else {
          message.success('提交失败，再试一次吧')
          this.setState({uploading: false})
        }
      })
    });
  }

  cancel = () => {
    this.setState({feedbackDia: false})
  }

  showFeedPop = () => {
    this.setState({feedbackDia: true})
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }
}

export default Feedback