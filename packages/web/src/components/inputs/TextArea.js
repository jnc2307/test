import React from "react";
import styled from "styled-components";

const InputTextArea = styled.textarea`
  outline: 0;
  border: 0;
  resize: none;
`;

class TextArea extends React.Component {
  render() {
    const { className, value, ...other } = this.props;
    const inputValue = value === null || value === undefined ? "" : value;

    return <InputTextArea {...other} className={className} value={inputValue} />;
  }
}

export default TextArea;
