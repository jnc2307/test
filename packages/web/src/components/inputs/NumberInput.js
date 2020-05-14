import React from "react";
import styled from "styled-components";

const Input = styled.input``;

class NumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    if (isNaN(e.target.value) === true) {
      return;
    }
    this.props.onChange(e.target.value, e);
  }

  render() {
    const { className, type, onChange, value, ...other } = this.props;
    const inputValue = value === null || value === undefined ? "" : value;

    return <Input {...other} className={className} type="text" value={inputValue} onChange={this.handleInputChange} />;
  }
}

export default NumberInput;
