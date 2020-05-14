import React from "react";
import styled from "styled-components";
import i18n from "i18next";
import {
  signInWithGoogle,
  isEmailValid,
  signInWithEmailPassword,
  resendSignupCode,
  confirmSignup
} from "@kubera/common";
import PrimaryButton from "components/button/PrimaryButton";
import AppLogo from "components/labels/AppLogo";
import signInWithGoogleImage from "assets/images/signin_with_google.png";
import EmailInput from "components/inputs/EmailInput";
import PasswordInput from "components/inputs/PasswordInput";
import ClickableLink from "components/labels/ClickableLink";
import { routes } from "routes";
import TextInput from "components/inputs/TextInput";
import { withRouter } from "react-router-dom";

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
  flex-direction: column;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 528px;
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
`;

const GoogleSignInButton = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  background-color: transparent;
  background-image: url(${signInWithGoogleImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 321px 50px;
  margin-top: 14px;
  cursor: pointer;
`;

const OrLabel = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 130%;
  text-align: center;
  font-feature-settings: "ss01" on;
  color: #000000;
  margin-top: 7px;
  margin-bottom: 7px;
`;

const ErrorMessage = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 130%;
  font-feature-settings: "ss01" on;
  color: #ff0000;
  margin-top: 7px;
  margin-bottom: 7px;
`;

const EmailField = styled(EmailInput)`
  height: 50px;
`;

const PasswordField = styled(PasswordInput)`
  height: 50px;
  margin-top: 15px;
`;

const SignInButton = styled(PrimaryButton)`
  margin-top: 24px;
  min-width: 137px;
`;

const ForgotPasswordLink = styled(ClickableLink)`
  margin-top: 29px;
`;

const SignUpLink = styled(ClickableLink)`
  margin-top: 11px;
`;

const UnconfirmedUserDescription = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 130%;
  font-feature-settings: "ss01" on;
  color: #000000;
  margin-top: 7px;
  margin-bottom: 7px;
`;

const VerificationCodeField = styled(TextInput)`
  height: 50px;
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

const GoBackLink = styled(ClickableLink)`
  margin-top: 22px;
`;

class SignInComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEmailError: false,
      isPasswordError: false,
      errorMessage: null,
      email: null,
      password: null,
      verificationCode: null,
      isVerificationCodeError: false,
      isUnconfirmedUser: false,
      isSignInPending: false
    };
    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handleVerificationCodeInput = this.handleVerificationCodeInput.bind(this);
    this.handleSignInWithGoogle = this.handleSignInWithGoogle.bind(this);
    this.handleSignInClick = this.handleSignInClick.bind(this);
    this.showSignInScreen = this.showSignInScreen.bind(this);
    this.handleSignInVerification = this.handleSignInVerification.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(e) {
    if (e.key === "Enter") {
      if (this.state.isUnconfirmedUser === true) {
        this.handleSignInVerification();
      } else {
        this.handleSignInClick();
      }
    }
  }

  handleEmailInput(e) {
    this.setState({ ...this.state, email: e.target.value.trim(), isEmailError: false });
  }

  handlePasswordInput(e) {
    this.setState({ ...this.state, password: e.target.value, isPasswordError: false });
  }

  handleVerificationCodeInput(value, e) {
    this.setState({ ...this.state, verificationCode: e.target.value, isVerificationCodeError: false });
  }

  handleSignInClick() {
    const email = this.state.email;
    const password = this.state.password;
    let isEmailError = false;
    let isPasswordError = false;
    let errorMessage = "";

    if (!email) {
      errorMessage = i18n.t("emptyEmail");
      isEmailError = true;
    }
    if (!password) {
      errorMessage += errorMessage.length > 0 ? ` ${i18n.t("emptyPassword")}` : i18n.t("emptyPassword");
      isPasswordError = true;
    }

    if (!errorMessage && isEmailValid(email) === false) {
      errorMessage = i18n.t("wrongEmailFormat");
      isEmailError = true;
    }

    if (isEmailError === false && isPasswordError === false) {
      this.signIn();
    } else {
      this.setState({
        ...this.state,
        isEmailError,
        isPasswordError,
        errorMessage
      });
    }
  }

  signIn() {
    this.setState({ ...this.state, isSignInPending: true });

    const email = this.state.email;
    const password = this.state.password;
    signInWithEmailPassword(
      email,
      password,
      data => {
        this.handleSuccessfulSignIn();
      },
      error => {
        if (error.code === "UserNotConfirmedException") {
          resendSignupCode(
            email,
            () => {
              this.setState({ ...this.state, isSignInPending: false });
              this.showUnconfirmedUserScreen();
            },
            error => {
              this.setState({ ...this.state, isSignInPending: false, errorMessage: error.message });
            }
          );
        } else {
          this.setState({ ...this.state, isSignInPending: false, errorMessage: error.message });
        }
      }
    );
  }

  handleSignInVerification() {
    const verificationCode = this.state.verificationCode;

    if (!verificationCode) {
      this.setState({ ...this.state, isVerificationCodeError: true, errorMessage: i18n.t("emptyVerificationCode") });
    } else {
      this.setState({ ...this.state, isSignInPending: true });
      confirmSignup(
        this.state.email,
        verificationCode,
        data => {
          this.signIn();
        },
        error => {
          if (error.code === "CodeMismatchException") {
            error.message = i18n.t("wrongVerificationCode");
          }
          this.setState({ ...this.state, isSignInPending: false, errorMessage: error.message });
        }
      );
    }
  }

  handleSuccessfulSignIn() {
    window.location.reload();
  }

  showUnconfirmedUserScreen() {
    this.setState({ ...this.state, isVerificationCodeError: false, errorMessage: null, isUnconfirmedUser: true });
  }

  showSignInScreen() {
    this.setState({
      ...this.state,
      isUnconfirmedUser: false,
      verificationCode: null,
      isVerificationCodeError: false
    });
  }

  handleSignInWithGoogle() {
    signInWithGoogle();
  }

  render() {
    const isUnconfirmedUser = this.state.isUnconfirmedUser;
    const isSignInPending = this.state.isSignInPending;

    if (isUnconfirmedUser === true) {
      const verificationCode = this.state.verificationCode;
      const isVerificationCodeError = this.state.isVerificationCodeError;
      const errorMessage = this.state.errorMessage;

      return (
        <Container>
          <ContentContainer>
            <AppLogo />
            <SignInForm>
              <Title>{i18n.t("signIn")}</Title>
              {!errorMessage === false && <ErrorMessage>{errorMessage}</ErrorMessage>}
              {!errorMessage === true && (
                <UnconfirmedUserDescription>{i18n.t("verificationCodeEmailed")}</UnconfirmedUserDescription>
              )}
              <VerificationCodeField
                placeholder={i18n.t("verificationCodeHint")}
                inputError={isVerificationCodeError}
                value={verificationCode}
                onChange={this.handleVerificationCodeInput}
                onKeyDown={this.handleKeyDown}
              />
              <SignInButton
                title={i18n.t("signIn")}
                onClick={this.handleSignInVerification}
                isLoading={isSignInPending}
              />
              <GoBackLink onClick={this.showSignInScreen}>{i18n.t("goBackLink")}</GoBackLink>
            </SignInForm>
          </ContentContainer>
        </Container>
      );
    } else {
      const isEmailError = this.state.isEmailError;
      const isPasswordError = this.state.isPasswordError;
      const errorMessage = this.state.errorMessage;
      const email = this.state.email;
      const password = this.state.password;

      return (
        <Container>
          <ContentContainer>
            <AppLogo />
            <SignInForm>
              <Title>{i18n.t("signIn")}</Title>
              <GoogleSignInButton tabIndex={"0"} onClick={this.handleSignInWithGoogle} />
              {!errorMessage === true && <OrLabel>{i18n.t("or")}</OrLabel>}
              {!errorMessage === false && <ErrorMessage>{errorMessage}</ErrorMessage>}
              <EmailField
                id="email"
                placeholder={i18n.t("email")}
                inputError={isEmailError}
                value={email}
                onChange={this.handleEmailInput}
                onKeyDown={this.handleKeyDown}
                autoComplete="username"
              />
              <PasswordField
                id="password"
                placeholder={i18n.t("password")}
                inputError={isPasswordError}
                value={password}
                onChange={this.handlePasswordInput}
                hidePasswordStrength={true}
                onKeyDown={this.handleKeyDown}
                autoComplete="current-password"
              />
              <SignInButton
                id="signin"
                title={i18n.t("signIn")}
                onClick={this.handleSignInClick}
                isLoading={isSignInPending}
              />
              <ForgotPasswordLink to={routes.FORGOT_PASSWORD}>{i18n.t("forgotPasswordLink")}</ForgotPasswordLink>
              <SignUpLink to={routes.SIGNUP}>{i18n.t("signUpLink")}</SignUpLink>
            </SignInForm>
          </ContentContainer>
        </Container>
      );
    }
  }
}

export default withRouter(SignInComponent);
