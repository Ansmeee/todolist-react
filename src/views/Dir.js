import React from "react";
import File from '../components/File';

class Dir extends React.Component{
  render() {
    return(
      <File state={{from: this.props.params.id}}></File>
    )
  }
}

export default Dir