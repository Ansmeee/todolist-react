import React from "react";
import File from "../components/File";
class All extends React.Component {
  render() {
    return (
      <File state={{from: 'all'}}></File>
    )
  }
}

export default All