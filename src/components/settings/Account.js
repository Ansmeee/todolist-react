import React from "react";
import {LoadingOutlined, UploadOutlined, CrownOutlined} from "@ant-design/icons";
import {Upload, message} from "antd";
import ImgCrop from 'antd-img-crop';
import userApi from "../../http/user";

function uploadPath() {
  return userApi.iconUploadPath()
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('仅自持 .png 或 .jpg 格式的图片')
  }

  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('文件大小不能超过 2M')
  }

  return isJpgOrPng && isLt2M
}

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      id     : props.userInfo.account || '',
      icon   : props.userInfo.icon || '',
      name   : props.userInfo.name || ''
    }
  }

  uploadButton() {
    return (
      <div className="icon-opt">
        {this.state.loading ? <LoadingOutlined/> : <UploadOutlined/>}
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
      this.setState({loading: true});
      return;
    }

    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        message.success('上传成功')
        var iconPath = info.file.response.data

        this.getBase64(info.file.originFileObj, icon =>
          this.setState({
            icon,
            loading: false,
          }),
        );
      } else {
        message.error('上传失败')
        this.setState({loading: false})
      }
    }
  }

  render() {
    return (
      <div className="settings-page-con-account">
        <div className="settings-page-con-account-icon">
          <ImgCrop rotate shape="round">
            <Upload
              name="icon"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={uploadPath}
              data={{id: this.state.id}}
              headers={{'Authorization': window.localStorage.getItem('token')}}
              beforeUpload={beforeUpload}
              onChange={(info) => {
                this.handleChange(info)
              }}>
              {this.state.icon ? <img src={this.state.icon} alt="avatar"
                                      className="settings-page-con-account-icon-img"/> : this.uploadButton()}
            </Upload>
          </ImgCrop>
        </div>
        <div className="settings-page-con-account-name">
          <div className="user-name">{this.state.name}</div>
          <div className="user-vip"><CrownOutlined/></div>
        </div>
      </div>
    )
  }
}

export default Account