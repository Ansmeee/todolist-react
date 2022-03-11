import React from "react";
import {PlusOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {Button, Input, message, Popover, Upload} from "antd";
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
      uploading: false
    }
  }

  render() {
    return (
      <div className="header-con-opt-notice">
        <Popover trigger="click" title="反馈与建议" content={this.popContent}>
          <QuestionCircleOutlined style={{fontSize: '14px'}}/>
        </Popover>
      </div>
    )
  }

  doUpload = () => {
    const imgList = this.state.imgList
    const formData = new FormData();
    imgList.forEach(file => {
      formData.append('imgs[]', file.originFileObj)
    })

    formData.append('content', this.state.form.content)
    this.setState({uploading: true}, () => {
      feedbackApi.submit(formData).then(response => {
        if (response.code = 200) {
          message.success('已提交')
          this.setState({uploading: false, form: {content: ''}, imgList: []})
        } else {
          message.success('提交失败，再试一次吧')
          this.setState({uploading: false})
        }
      })
    });
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

  popContent = () => {
    return (
      <div className="feed-back-pop">
        <Input.TextArea
          autoSize={{minRows: 5, maxRows: 5}}
          bordered={false}
          maxLength={150}
          value={this.state.form.content}
          placeholder="输入您想说的话"
          onChange={(e) => {
            var currentForm = this.state.form
            currentForm['content'] = e.target.value
            this.setState({form: currentForm})
          }}>
        </Input.TextArea>
        <div style={{marginTop: '10px', marginBottom: '10px'}}>
          <Upload
            multiple={true}
            name="imgs"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
        <div style={{width: '100%', textAlign: 'right'}}>
          <Button type="primary" onClick={this.doUpload} disabled={this.state.uploading}>立即提交</Button>
        </div>
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
}

export default Feedback