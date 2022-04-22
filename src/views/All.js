import React from "react";
import File from "../components/File";
import {Empty} from "antd";
import browserHistory from "react-router/lib/browserHistory";
class All extends React.Component {
  render() {
    var sid = (browserHistory.getCurrentLocation().query && browserHistory.getCurrentLocation().query.s_id) || ''
    return (
      <File state={{from: 'all', sid: sid}} emptyText={<Empty description="好记性不如做计划" />}></File>
    )
  }
}

export default All