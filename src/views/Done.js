import React from "react"
import File from "../components/File";

class Done extends React.Component {
  render() {
    return (
      <File state={{from: 'done'}}></File>
    )
  }
}

export default Done