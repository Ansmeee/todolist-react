import React from "react";
import fileApi from "../http/file";

class Common extends React.Component {
  constructor(props) {
    super(props);
  }

  setDirList() {
    const dirString = window.localStorage.getItem("menu")

    if (!dirString) {
      fileApi.fileList({}).then(response => {
        if (response.code === 200) {
          window.localStorage.setItem("menu", JSON.stringify(response.data.list))
          const dirList = response.data.list.map(item => {
            return {label: item.title, value: item.id}
          })

          this.props.setState({dirList: dirList})
        }
      })
      return
    }

    const dir = JSON.parse(dirString)
    var dirList = dir.map(item => {
      return {label: item.title, value: item.id}
    })

    this.props.setState({dirList: dirList})
  }
}

export default Common;