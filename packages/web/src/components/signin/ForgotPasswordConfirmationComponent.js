import React from "react";
import styled from "styled-components";
import i18n from "i18next";
import PrimaryButton from "components/button/PrimaryButton";
import AppLogo from "components/labels/AppLogo";
import ClickableLink from "components/labels/ClickableLink";
import { routes, queryParams } from "routes";
import TextInput from "components/inputs/TextInput";
import { withRouter } from "react-router-dom";
import PasswordInput from "components/inputs/PasswordInput";
import { forgotPasswordSubmit, getQueryParams } from "@kubera/common";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 423px;
  min-width: 423px;
  height: fit-content;
  background: #ffffff;
`;

const SignInForm = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 561px;
  flex-direction: column;
  flex-direction: column;
  margin-top: 8px;
  padding: 50px;
  border: 1px solid #000000;
  box-sizing: border-box;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: -0.015em;
  font-feature-settings: "pnum" on, "lnum" on, "ss01" on;
  color: #000000;
  white-space: pre-wrap;
`;

const Description = styled.div`
  margin-top: 15px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 130%;
  font-feature-settings: "ss01" on;
  color: #000000;
`;

const ErrorMessage = styled.div`
  margin-top: 15px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 130%;
  font-feature-settings: "ss01" on;
  color: #ff0000;
`;

const ResetCodeField = styled(TextInput)`
  height: 50px;
  margin-top: 10px;
  padding-left: 13px;
  padding-right: 13px;
  outline: 0;
  border: ${props => (props.inputError === true ? "1px solid rgba(255, 0, 0, 0.4)" : "1px solid rgba(0, 0, 0, 0.4)")};
  box-sizing: border-box;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  font-feature-settings: "ss01" on;
  color: black;

  ::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

const PasswordField = styled(PasswordInput)`
  height: 50px;
  margin-top: 15px;
`;

const ResetPasswordButton = styled(PrimaryButton)`
  margin-top: 20px;
  min-width: 184px;
`;

const GoBackLink = styled(ClickableLink)`
  margin-top: 27px;
`;

const SignUpLink = styled(ClickableLink)`
  margin-top: 15px;
`;

const CreatedPasswordCompleteMessage = styled.div`
  margin-top: 15px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 130%;
  font-feature-settings: "ss01" on;
  color: #000000;
  white-space: pre-wrap;
`;

const SignInButton = styled(PrimaryButton)`
  margin-top: 29px;
`;

class ForgotPasswordConfirmationComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: null,
      verificationCode: null,
      isPasswordError: false,
      isVerificationCodeError: false,
      errorMessage: null,
      isRequestPending: false
    };
    this.handleVerificationCodeInput = this.handleVerificationCodeInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handleResetPasswordClick = this.handleResetPasswordClick.bind(this);
    this.handleSignInClick = this.handleSignInClick.bind(this);
  }

  handlePasswordInput(e) {
    this.setState({ ...this.state, password: e.target.value, isPasswordError: false });
  }

  handleVerificationCodeInput(value, e) {
    this.setState({ ...this.state, verificationCode: e.target.value, isVerificationCodeError: false });
  }

  handleResetPasswordClick() {
    const verificationCode = this.state.verificationCode;
    const password = this.state.password;
    let isPasswordError = false;
    let isVerificationCodeError = false;
    let errorCount = 0;
    let errorMessage = "";

    if (!verificationCode) {
      isVerificationCodeError = true;
      errorMessage = i18n.t("emptyVerificationCode");
      errorCount++;
    }
    if (!password) {
      isPasswordError = true;
      errorMessage = i18n.t("emptyPassword");
      errorCount++;
    } else if (password.length < PasswordInput.minPasswordLength) {
      errorMessage = i18n.t("passwordTooShort");
      isPasswordError = true;
      errorCount++;
    }

    if (errorCount === 0) {
      this.resetPassword();
    } else {
      if (errorCount > 1) {
        errorMessage = i18n.t("multipleSignupInputError");
      }
      this.setState({ ...this.state, isPasswordError, isVerificationCodeError, errorMessage });
    }
  }

  resetPassword() {
    this.setState({ ...this.state, isRequestPending: true });

    const email = getQueryParams(this.props.location)[queryParams.EMAIL_ID];
    const password = this.state.password;
    const verificationCode = this.state.verificationCode;

    forgotPasswordSubmit(
      email,
      verificationCode,
      password,
      () => {
        this.showResetPasswordCompletedScreen();
      },
      error => {
        if (error.code === "InvalidPasswordException") {
          error.message = i18n.t("passwordNotMatchingPolicy");
        }
        this.setState({ ...this.state, isRequestPending: false, errorMessage: error.message });
      }
    );
  }

  showResetPasswordCompletedScreen() {
    this.setState({ ...this.state, isRequestPending: false, isResetPasswordCompleted: true });
  }

  handleSignInClick() {
    this.props.history.push(routes.SIGNIN);
  }

  render() {
    const isResetPasswordCompleted = this.state.isResetPasswordCompleted;

    if (isResetPasswordCompleted === true) {
      return (
        <Container>
          <ContentContainer>
            <AppLogo />
            <SignInForm>
              <Title>{i18n.t("resetPassword").replace(" ", "\n")}</Title>
              <CreatedPasswordCompleteMessage>{i18n.t("createPasswordCompleted")}</CreatedPasswordCompleteMessage>
              <SignInButton title={i18n.t("signIn")} onClick={this.handleSignInClick} />
              <GoBackLink onClick={() => window.history.back()}>{i18n.t("goBackLink")}</GoBackLink>
            </SignInForm>
          </ContentContainer>
        </Container>
      );
    } else {
      const isRequestPending = this.state.isRequestPending;
      const errorMessage = this.state.errorMessage;
      const isPasswordError = this.state.isPasswordError;
      const isVerificationCodeError = this.state.isVerificationCodeError;
      const verificationCode = this.state.verificationCode;
      const password = this.state.password;

      return (
        <Container>
          <ContentContainer>
            <AppLogo />
            <SignInForm>
              <Title>{i18n.t("resetPassword").replace(" ", "\n")}</Title>
              {!errorMessage === true && <Description>{i18n.t("forgotPasswordConfirmation")}</Description>}
              {!errorMessage === false && <ErrorMessage>{errorMessage}</ErrorMessage>}
              <ResetCodeField
                placeholder={i18n.t("forgotPasswordCodePlaceholder")}
                inputError={isVerificationCodeError}
                value={verificationCode}
                onChange={this.handleVerificationCodeInput}
                autoFocus={true}
              />
              <PasswordField
                placeholder={i18n.t("newPassword")}
                inputError={isPasswordError}
                value={password}
                onChange={this.handlePasswordInput}
              />
              <ResetPasswordButton
                title={i18n.t("resetPassword")}
                onClick={this.handleResetPasswordClick}
                isLoading={isRequestPending}
              />
              <GoBackLink onClick={() => window.history.back()}>{i18n.t("goBackLink")}</GoBackLink>
              <SignUpLink to={routes.SIGNUP}>{i18n.t("signUpLink")}</SignUpLink>
            </SignInForm>
          </ContentContainer>
        </Container>
      );
    }
  }
}

export default withRouter(ForgotPasswordConfirmationComponent);
