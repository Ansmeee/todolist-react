import React from "react";
import {LoadingOutlined, UploadOutlined} from "@ant-design/icons";
import {Upload, message} from "antd";
class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      imageUrl: ''
    }
  }
  beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('仅自持 .png 或 .jpg 格式的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小不能超过 2M');
    }
    return isJpgOrPng && isLt2M;
  }

  uploadButton() {
    return (
      <div className="icon-opt">
        {this.state.loading ? <LoadingOutlined /> : <UploadOutlined />}
      </div>
    )
  }

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info) {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  }

  render() {
    return (
      <div className="settings-page-con-account">
        <div className="settings-page-con-account-icon">
          <Upload
            name="icon"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={(file) => {this.beforeUpload(file)}}
            onChange={(info) => {this.handleChange(info)}}>
            {this.state.imageUrl ? <img src={this.state.imageUrl} alt="avatar" style={{ width: '100%' }} /> : this.uploadButton()}
          </Upload>
        </div>
        <div className="settings-page-con-account-tips">点击上传新头像</div>
      </div>
    )
  }
}

export default Account