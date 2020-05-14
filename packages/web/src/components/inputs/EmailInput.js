import React from "react";
import styled from "styled-components";

const Container = styled.div``;

const Input = styled.input`
  width: 100%;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  font-feature-settings: "ss01" on;
  color: black;
  border: 0;
  border: ${props => (props.hasError === true ? "1px solid rgba(255, 0, 0, 0.4)" : "1px solid rgba(0, 0, 0, 0.4)")};
  border-radius: 0;
  appearance: none;
  box-sizing: border-box;
  line-height: normal;
  padding-left: 13px;
  padding-right: 13px;
  outline: 0;
  background-color: ${props => (props.disabled === true ? "rgba(0, 0, 0, 0.05)" : "#ffffff")};

  ::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

const InvalidEmailMessage = styled.p`
  font-size: 11px;
  text-align: left;
  letter-spacing: 0.01em;
  color: #ff0000;
  margin-block-start: 5px !important;
  margin-block-end: 0em !important;
`;

class EmailInput extends React.Component {
  render() {
    const { className, type, onChange, value, errorMessage, inputError, disabled, ...other } = this.props;
    const inputValue = value === null || value === undefined ? "" : value;
    const hasError = !errorMessage === false || inputError === true;

    return (
      <Container>
        <Input
          {...other}
          type="email"
          className={className}
          value={inputValue}
          onChange={this.props.onChange}
          hasError={hasError}
          disabled={disabled === true}
        />
        {!errorMessage === false && <InvalidEmailMessage>{errorMessage}</InvalidEmailMessage>}
      </Container>
    );
  }
}

export default EmailInput;
