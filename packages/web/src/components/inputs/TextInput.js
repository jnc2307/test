import React from "react";
import styled from "styled-components";

const Input = styled.input`
  background-color: ${props => (props.disabled === true ? "rgba(0, 0, 0, 0.05)" : "#ffffff")};
`;

class TextInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e.target.value, e);
      null;
    }
  }

  render() {
    const { className, type, onChange, value, disabled, ...other } = this.props;
    const inputValue = value === null || value === undefined ? "" : value;

    return (
      <Input
        {...other}
        type="text"
        className={className}
        value={inputValue}
        onChange={this.handleInputChange}
        autoComplete="new-password"
        disabled={disabled === true}
      />
    );
  }
}

export default TextInput;
