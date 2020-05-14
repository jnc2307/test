import React from "react";
import styled from "styled-components";
import { store, userStorageUsage, userStorageLimit } from "@kubera/common";
import { withRouter } from "react-router-dom";
import { hashParams, modalValues } from "routes";

export const MaxFileSizeLimit = 50 * 1024 * 1024;

const Container = styled.div`
  display: contents;
`;

const Input = styled.input`
  width: 0px;
  height: 0px;
`;

const UploadButton = styled.button``;

export const canUploadFiles = (files, store, history, location) => {
  var storageUsed = userStorageUsage(store.getState());
  const storageLimit = userStorageLimit(store.getState());

  for (const file of files) {
    if (file.size > MaxFileSizeLimit) {
      history.push({
        ...location,
        hash: `${hashParams.MODAL}=${modalValues.UPLOAD_TOO_LARGE}`
      });
      return false;
    }

    storageUsed = storageUsed + file.size;
  }

  if (storageUsed > storageLimit) {
    history.push({
      ...location,
      hash: `${hashParams.MODAL}=${modalValues.STORAGE_FULL}`
    });
    return false;
  }
  return true;
};

class FileUploadInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.inputRef = React.createRef();
  }

  handleInputChange(e) {
    const files = e.target.files;

    if (files && files.length > 0 && this.props.onChange) {
      if (canUploadFiles(files, store, this.props.history, this.props.location) === true) {
        this.props.onChange(files);
      }
    }
  }

  handleButtonClick() {
    if (this.inputRef.current) {
      this.inputRef.current.click();
    }
  }

  upload() {
    this.handleButtonClick();
  }

  render() {
    const { className, type, onChange, ...other } = this.props;

    return (
      <Container>
        <UploadButton className={className} onClick={this.handleButtonClick}>
          {this.props.label}
        </UploadButton>
        <Input {...other} type="file" ref={this.inputRef} onChange={this.handleInputChange} />
      </Container>
    );
  }
}

const withRouterInnerRef = WrappedComponent => {
  class InnerComponentWithRef extends React.Component {
    render() {
      const { forwardRef, ...rest } = this.props;
      return <WrappedComponent {...rest} ref={forwardRef} />;
    }
  }

  const ComponentWithRef = withRouter(InnerComponentWithRef, { withRef: true });

  return React.forwardRef((props, ref) => {
    return <ComponentWithRef {...props} forwardRef={ref} />;
  });
};

export default withRouterInnerRef(FileUploadInput);
