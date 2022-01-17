import React from "react"
import File from "../components/File";

class Done extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <File state={{from: 'done'}}></File>
    )
  }
}

export default Done