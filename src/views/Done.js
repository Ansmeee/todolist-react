import React from "react"
import File from "../components/File";
import {Empty} from "antd";

class Done extends React.Component {
  render() {
    return (
      <File state={{from: 'done'}} emptyText={<Empty description="好计划，要坚持" />}></File>
    )
  }
}

export default Done