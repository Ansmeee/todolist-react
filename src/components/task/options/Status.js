import React from "react";
import {Button, Popover} from "antd";
import {statusKey2Name} from "../../../utils/task";
import {CheckCircleOutlined} from "@ant-design/icons";
import "../../../assets/style/opt.less"
import {statusClassName} from "./ClassName";
import moment from "moment";

class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popVisible: false
    }
  }
  render() {
    const popCon = (
      <div>
        <Button
          block
          type="text"
          onClick={() => {
            this.statusChange(1)
          }}>
          进行中
        </Button>
        <Button
          block
          className="pop-opt-success"
          type="text"
          onClick={() => {
            this.statusChange(2)
          }}>
          已完成
        </Button>
      </div>
    )

    return (
      <div>
        <Popover
          overlayClassName="pop-opt-con"
          placement="bottomLeft"
          visible={this.state.popVisible}
          onVisibleChange={(visible) => {
            this.setState({popVisible: visible})
          }}
          content={popCon}
          trigger="click">
          <Button
            type="text"
            style={{fontSize: '12px'}}
            className={statusClassName(this.props.currentTask)}>
            <CheckCircleOutlined/>
            {this.statusText()}
          </Button>
        </Popover>
      </div>
    )
  }

  statusText() {
    var currentDate = moment().format("YYYY-MM-DD")
    var expireDate = moment(this.props.currentTask.deadline).format("YYYY-MM-DD")
    if (this.props.currentTask.status === 1 && currentDate > expireDate) {
      return '已过期'
    }

    return statusKey2Name(this.props.currentTask.status)
  }

  statusChange(status) {
    this.setState({popVisible: false})
    this.props.onStatusChange(status)
  }
}

export default Status