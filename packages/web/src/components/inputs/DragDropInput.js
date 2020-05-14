import React from "react";
import styled from "styled-components";
import { store } from "@kubera/common";
import { withRouter } from "react-router-dom";
import { canUploadFiles } from "components/inputs/FileUploadInput";

const Container = styled.div``;

class DragDropInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isDragging: false };
    this.dropAreaRef = React.createRef();

    this.handleDragIn = this.handleDragIn.bind(this);
    this.handleDragOut = this.handleDragOut.bind(this);
    this.ignoreDefault = this.ignoreDefault.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount() {
    // This is needed so that we can ignore the
    // dragleave events from children of the drop area
    this.dragCounter = 0;

    if (this.props.disabled !== true) {
      let div = this.dropAreaRef.current;
      div.addEventListener("dragenter", this.handleDragIn);
      div.addEventListener("dragleave", this.handleDragOut);
      div.addEventListener("drop", this.handleDrop);
      div.addEventListener("dragover", this.ignoreDefault);
    }

    window.addEventListener("drop", this.ignoreDefault);
    window.addEventListener("dragover", this.ignoreDefault);
  }

  componentWillUnmount() {
    if (this.props.disabled !== true) {
      let div = this.dropAreaRef.current;
      div.removeEventListener("dragenter", this.handleDragIn);
      div.removeEventListener("dragleave", this.handleDragOut);
      div.removeEventListener("drop", this.handleDrop);
      div.removeEventListener("dragover", this.ignoreDefault);
    }

    window.removeEventListener("drop", this.ignoreDefault);
    window.removeEventListener("dragover", this.ignoreDefault);
  }

  ignoreDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDragIn(e) {
    e.preventDefault();
    e.stopPropagation();

    this.dragCounter++;
    if (e.dataTransfer.items) {
      if (this.props.onDragStart) {
        this.props.onDragStart();
      }
      this.setState({ ...this.state, isDragging: true });
    }
  }

  handleDragOut(e) {
    e.preventDefault();
    e.stopPropagation();

    this.dragCounter--;
    if (this.dragCounter > 0) return;
    if (this.props.onDragStop) {
      this.props.onDragStop();
    }
    this.setState({ ...this.state, isDragging: false });
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    this.dragCounter = 0;
    this.setState({ ...this.state, isDragging: false });
    if (this.props.onDragStop) {
      this.props.onDragStop();
    }

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      var files = [];

      for (const item of e.dataTransfer.items) {
        if (item.kind === "file" && !item.type === false) {
          files.push(item.getAsFile());
        }
      }
      if (files.length > 0 && this.props.onFileDrop) {
        if (canUploadFiles(files, store, this.props.history, this.props.location) === true) {
          this.props.onFileDrop(files);
        }
      }
    }
  }

  render() {
    return (
      <Container className={this.props.className} ref={this.dropAreaRef}>
        {this.props.children}
      </Container>
    );
  }
}

export default withRouter(DragDropInput);
