import React from "react";
import {QuestionCircleOutlined} from "@ant-design/icons";
class Feedback extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="header-con-opt-notice">
        <QuestionCircleOutlined style={{fontSize: '14px'}}/>
      </div>
    )
  }
}

export default Feedback