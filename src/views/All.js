import React from "react";
import File from "../components/File";
import {Empty} from "antd";
class All extends React.Component {
  render() {
    return (
      <File state={{from: 'all'}} emptyText={<Empty description="好记性不如做计划" />}></File>
    )
  }
}

export default All