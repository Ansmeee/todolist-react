import React from "react";
import File from '../components/File';
import browserHistory from "react-router/lib/browserHistory";

class Dir extends React.Component{
  render() {
    var sid = (browserHistory.getCurrentLocation().query && browserHistory.getCurrentLocation().query.s_id) || ''
    return(
      <File state={{from: this.props.params.id, sid: sid, dir: this.props.params.id}}></File>
    )
  }
}

export default Dir