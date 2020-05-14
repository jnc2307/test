import React from "react";
import styled from "styled-components";
import viewPasswordIcon from "assets/images/view_password_icon.svg";
import hidePasswordIcon from "assets/images/hide_password_icon.svg";
import { getPasswordStrength } from "@kubera/common";

const Container = styled.div``;

const InputContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  border: ${props => (props.hasError === true ? "1px solid rgba(255, 0, 0, 0.4)" : "1px solid rgba(0, 0, 0, 0.4)")};
  box-sizing: border-box;
`;

const Input = styled.input`
  width: 100%;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  font-feature-settings: "ss01" on;
  color: black;
  border: 0;
  padding-left: 13px;
  padding-right: 13px;
  outline: 0;

  ::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

const InvalidPasswordMessage = styled.p`
  font-size: 11px;
  text-align: left;
  letter-spacing: 0.01em;
  color: #ff0000;
  margin-block-start: 5px !important;
  margin-block-end: 0em !important;
`;

const PasswordToggleButton = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 15px;
  background-color: white;
  background-image: ${props =>
    props.isPasswordVisible === true ? `url(${hidePasswordIcon})` : `url(${viewPasswordIcon})`};
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  cursor: pointer;
`;

const PasswordStrengthIndicator = styled.div`
  width: 100%;
  height: 2px;
  visibility: ${props => (props.visible === true ? "visible" : "hidden")}
  margin-right: 15px;
  margin-top: -1px;
  background-color: ${props => props.color};
`;

class PasswordInput extends React.Component {
  static minPasswordLength = 8;

  constructor(props) {
    super(props);

    this.state = { isPasswordVisible: false };
    this.inputRef = React.createRef();
    this.handlePasswordVisibilityToggleClick = this.handlePasswordVisibilityToggleClick.bind(this);
  }

  handlePasswordVisibilityToggleClick() {
    this.setState({ ...this.state, isPasswordVisible: !this.state.isPasswordVisible });

    const inputField = this.inputRef.current;
    if (inputField) {
      inputField.focus();
      setTimeout(() => {
        inputField.selectionStart = inputField.selectionEnd = inputField.value.length;
      }, 0);
    }
  }

  render() {
    const { className, type, onChange, value, hidePasswordStrength, errorMessage, inputError, ...other } = this.props;
    const inputValue = value === null || value === undefined ? "" : value;
    const hasError = !errorMessage === false || inputError === true;
    const isPasswordVisible = this.state.isPasswordVisible;
    const passwordStrength = getPasswordStrength(value);
    const hidePasswordStrengthIndicator =
      !value === true || (!hidePasswordStrength === false && hidePasswordStrength === true);

    return (
      <Container className={className}>
        <InputContainer hasError={hasError}>
          <Input
            {...other}
            ref={this.inputRef}
            type={isPasswordVisible === true ? "text" : "password"}
            value={inputValue}
            onChange={this.props.onChange}
            autoComplete="new-password"
          />
          <PasswordToggleButton
            isPasswordVisible={isPasswordVisible}
            onClick={this.handlePasswordVisibilityToggleClick}
          />
        </InputContainer>
        <PasswordStrengthIndicator visible={!hidePasswordStrengthIndicator} color={passwordStrength.color} />
        {!errorMessage === false && <InvalidPasswordMessage>{errorMessage}</InvalidPasswordMessage>}
      </Container>
    );
  }
}

export default PasswordInput;
