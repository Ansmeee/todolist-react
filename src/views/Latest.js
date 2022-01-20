import React from "react"
import File from "../components/File";

class Latest extends React.Component {
  render() {
    return (
      <File state={{from: 'latest'}}></File>
    )
  }
}

export default Latest