import React from "react"
import File from "../components/File";
import {Empty} from "antd";

class Today extends React.Component {
  render() {
    return (
      <File state={{from: 'today'}} emptyText={<Empty description="今日事，今日必" />}></File>
    )
  }
}

export default Today