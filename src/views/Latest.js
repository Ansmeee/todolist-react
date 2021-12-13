import React from "react"
import File from "../components/File";

class Latest extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <File state={{from: 'latest'}}></File>
    )
  }
}

export default Latest