import React from "react"
import File from "../components/File";

class Today extends React.Component {
  render() {
    return (
      <File state={{from: 'today'}}></File>
    )
  }
}

export default Today