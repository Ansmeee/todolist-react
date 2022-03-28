import React from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editValue: ""
    };
  }

  componentDidMount = () => {
    this.createVidtor({ value: this.state.editValue });
  }

  createVidtor = params => {
    let { value } = params;
    value = value ? value : "";
    const vditor = new Vditor("vditor", {
      placeholder: "React Vditor",
      toolbarConfig: {
        hide: true
      },
      after() {
        vditor.setValue(value);
      },
      blur(value) {
        console.log(value)
      },
    });
  };
  render() {
    return (
      <div className="editorWrap">
        <div id="vditor" />
      </div>
    )
  }
}

export default Editor;
