import React from "react";
import styled from "styled-components";
import i18n from "i18next";
import {
  signInWithGoogle,
  isEmailValid,
  signUpWithEmailPassword,
  confirmSignup,
  signInWithEmailPassword,
  getPasswordStrength,
  passwordStrengthLevels
} from "@kubera/common";
import PrimaryButton from "components/button/PrimaryButton";
import AppLogo from "components/labels/AppLogo";
import signUpWithGoogleImage from "assets/images/signup_with_google.png";
import EmailInput from "components/inputs/EmailInput";
import PasswordInput from "components/inputs/PasswordInput";
import TextInput from "components/inputs/TextInput";
import ClickableLink from "components/labels/ClickableLink";
import { websiteUrls, routes } from "routes";
import ConfirmationDialog from "components/dialog/ConfirmationDialog";

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
  min-height: 561px;
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
  background-image: url(${signUpWithGoogleImage});
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

const NameField = styled(TextInput)`
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

const EmailField = styled(EmailInput)`
  height: 50px;
  margin-top: 15px;
`;

const PasswordField = styled(PasswordInput)`
  height: 50px;
  margin-top: 15px;
`;

const SignUpTip = styled.div`
  margin-top: 9px;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  letter-spacing: 0.01em;
  font-feature-settings: "pnum" on, "lnum" on, "ss01" on;
  color: #000000;
`;

const SignUpButton = styled(PrimaryButton)`
  margin-top: 19px;
  min-width: 137px;
`;

const SignInLink = styled(ClickableLink)`
  margin-top: 17px;
`;

const PolicyDetails = styled.div`
  margin-top: 22px;
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 143%;
  font-feature-settings: "ss01" on;
  color: #000000;
  white-space: pre-wrap;
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
  margin-top: 17px;
`;

class SignUpComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNameError: false,
      isEmailError: false,
      isPasswordError: false,
      name: null,
      email: null,
      password: null,
      verificationCode: null,
      isVerificationCodeError: false,
      isUnconfirmedUser: false,
      isSignUpPending: false,
      showWeakPasswordDialog: false
    };
    this.handleNameInput = this.handleNameInput.bind(this);
    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handleSignUpWithGoogle = this.handleSignUpWithGoogle.bind(this);
    this.handleSignUpClick = this.handleSignUpClick.bind(this);
    this.handleVerificationCodeInput = this.handleVerificationCodeInput.bind(this);
    this.handleSignUpVerification = this.handleSignUpVerification.bind(this);
    this.showSignUpScreen = this.showSignUpScreen.bind(this);
    this.handleWeakPasswordDialogNegativeButtonClick = this.handleWeakPasswordDialogNegativeButtonClick.bind(this);
    this.handleWeakPasswordDialogPositiveButtonClick = this.handleWeakPasswordDialogPositiveButtonClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(e) {
    if (e.key === "Enter") {
      if (this.state.isUnconfirmedUser === true) {
        this.handleSignUpVerification();
      } else {
        this.handleSignUpClick();
      }
    }
  }

  handleNameInput(value, e) {
    this.setState({ ...this.state, name: e.target.value, isNameError: false });
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

  handleSignUpClick() {
    const name = this.state.name;
    const email = this.state.email;
    const password = this.state.password;
    let isNameError = false;
    let isEmailError = false;
    let isPasswordError = false;
    let errorMessage = "";
    let errorCount = 0;

    if (!name) {
      errorMessage = i18n.t("emptyName");
      isNameError = true;
      errorMessage++;
    }

    if (!email) {
      errorMessage = i18n.t("emptyEmail");
      isEmailError = true;
      errorCount++;
    } else if (isEmailValid(this.state.email) === false) {
      errorMessage = i18n.t("wrongEmailFormat");
      isEmailError = true;
      errorCount++;
    }

    if (!password) {
      errorMessage = i18n.t("emptyPassword");
      isPasswordError = true;
      errorCount++;
    } else if (password.length < PasswordInput.minPasswordLength) {
      errorMessage = i18n.t("passwordTooShort");
      isPasswordError = true;
      errorCount++;
    } else if (getPasswordStrength(password) === passwordStrengthLevels.WEAK) {
      this.setState({ ...this.state, showWeakPasswordDialog: true });
      return;
    }

    if (errorCount === 0) {
      this.signUp();
    } else {
      if (errorCount > 1) {
        errorMessage = i18n.t("multipleSignupInputError");
      }

      this.setState({
        ...this.state,
        isNameError,
        isEmailError,
        isPasswordError,
        errorMessage
      });
    }
  }

  signUp() {
    this.setState({ ...this.state, isSignUpPending: true, showWeakPasswordDialog: false });

    const name = this.state.name;
    const email = this.state.email;
    const password = this.state.password;

    signUpWithEmailPassword(
      name,
      email,
      password,
      data => {
        if (data.userConfirmed === false) {
          this.setState({ ...this.state, isSignUpPending: false });
          this.showUnconfirmedUserScreen();
        } else {
          this.handleSuccessfulSignUp();
        }
      },
      error => {
        if (error.code === "UserNotConfirmedException") {
          this.setState({ ...this.state, isSignUpPending: false });
          this.showUnconfirmedUserScreen();
        } else {
          if (error.code === "UsernameExistsException") {
            error.message = i18n.t("emailTaken");
          } else if (error.code === "InvalidPasswordException") {
            error.message = i18n.t("passwordNotMatchingPolicy");
          } else if (error.code === "UserLambdaValidationException") {
            error.message = i18n.t("emailUsedForGoogleIn");
          }
          this.setState({ ...this.state, isSignUpPending: false, errorMessage: error.message });
        }
      }
    );
  }

  signIn() {
    this.setState({ ...this.state, isSignUpPending: true });

    const email = this.state.email;
    const password = this.state.password;
    signInWithEmailPassword(
      email,
      password,
      data => {
        this.handleSuccessfulSignUp();
      },
      error => {
        this.setState({ ...this.state, isSignUpPending: false, errorMessage: error.message });
      }
    );
  }

  handleSignUpVerification() {
    const verificationCode = this.state.verificationCode;

    if (!verificationCode) {
      this.setState({ ...this.state, isVerificationCodeError: true, errorMessage: i18n.t("emptyVerificationCode") });
    } else {
      this.setState({ ...this.state, isSignUpPending: true });
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
          this.setState({ ...this.state, isSignUpPending: false, errorMessage: error.message });
        }
      );
    }
  }

  showUnconfirmedUserScreen() {
    this.setState({ ...this.state, isVerificationCodeError: false, errorMessage: null, isUnconfirmedUser: true });
  }

  showSignUpScreen() {
    this.setState({
      ...this.state,
      isUnconfirmedUser: false,
      verificationCode: null,
      isVerificationCodeError: false
    });
  }

  handleSuccessfulSignUp() {
    window.location.reload();
  }

  handleSignUpWithGoogle() {
    signInWithGoogle();
  }

  handleWeakPasswordDialogNegativeButtonClick() {
    this.setState({ ...this.state, showWeakPasswordDialog: false });
  }

  handleWeakPasswordDialogPositiveButtonClick() {
    this.signUp();
  }

  render() {
    const isUnconfirmedUser = this.state.isUnconfirmedUser;
    const isSignUpPending = this.state.isSignUpPending;

    if (isUnconfirmedUser === true) {
      const verificationCode = this.state.verificationCode;
      const isVerificationCodeError = this.state.isVerificationCodeError;
      const errorMessage = this.state.errorMessage;

      return (
        <Container>
          <ContentContainer>
            <AppLogo />
            <SignInForm>
              <Title>{i18n.t("signUp")}</Title>
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
              <SignUpButton
                title={i18n.t("signUp")}
                onClick={this.handleSignUpVerification}
                isLoading={isSignUpPending}
              />
              <PolicyDetails>
                <span>{"By continuing to sign up you accept our\n"}</span>
                <ClickableLink href={websiteUrls.TERMS_OF_SERVICE} target="_blank">
                  {"Terms of Service"}
                </ClickableLink>
                <span>{" and "}</span>
                <ClickableLink href={websiteUrls.PRIVACY_POLICY} target="_blank">
                  {"Privacy Policy."}
                </ClickableLink>
              </PolicyDetails>
              <SignInLink to={routes.SIGNIN}>{i18n.t("signInLink")}</SignInLink>
              <GoBackLink onClick={this.showSignUpScreen}>{i18n.t("goBackLink")}</GoBackLink>
            </SignInForm>
          </ContentContainer>
        </Container>
      );
    } else {
      const isNameError = this.state.isNameError;
      const isEmailError = this.state.isEmailError;
      const isPasswordError = this.state.isPasswordError;
      const errorMessage = this.state.errorMessage;
      const name = this.state.name;
      const email = this.state.email;
      const password = this.state.password;
      const showWeakPasswordDialog = this.state.showWeakPasswordDialog;

      return (
        <Container>
          <ContentContainer>
            <AppLogo />
            <SignInForm>
              <Title>{i18n.t("signUp")}</Title>
              <GoogleSignInButton tabIndex={"0"} onClick={this.handleSignUpWithGoogle} />
              {!errorMessage === true && <OrLabel>{i18n.t("or")}</OrLabel>}
              {!errorMessage === false && <ErrorMessage>{errorMessage}</ErrorMessage>}
              <NameField
                placeholder={i18n.t("signupNamePlaceholder")}
                inputError={isNameError}
                value={name}
                onChange={this.handleNameInput}
                onKeyDown={this.handleKeyDown}
              />
              <EmailField
                placeholder={i18n.t("email")}
                inputError={isEmailError}
                value={email}
                onChange={this.handleEmailInput}
                onKeyDown={this.handleKeyDown}
              />
              <PasswordField
                placeholder={i18n.t("password")}
                inputError={isPasswordError}
                value={password}
                onChange={this.handlePasswordInput}
                onKeyDown={this.handleKeyDown}
              />
              <SignUpTip>{i18n.t("passwordTip")}</SignUpTip>
              <SignUpButton title={i18n.t("signUp")} onClick={this.handleSignUpClick} isLoading={isSignUpPending} />
              <PolicyDetails>
                <span>{"By continuing to sign up you accept our\n"}</span>
                <ClickableLink href={websiteUrls.TERMS_OF_SERVICE} target="_blank">
                  {"Terms of Service"}
                </ClickableLink>
                <span>{" and "}</span>
                <ClickableLink href={websiteUrls.PRIVACY_POLICY} target="_blank">
                  {"Privacy Policy."}
                </ClickableLink>
              </PolicyDetails>
              <SignInLink to={routes.SIGNIN}>{i18n.t("signInLink")}</SignInLink>
            </SignInForm>
          </ContentContainer>
          {showWeakPasswordDialog === true && (
            <ConfirmationDialog
              title={i18n.t("weakPasswordDialogTitle")}
              description={i18n.t("weakPasswordDialogDescription")}
              positiveButtonTitle={i18n.t("signUp")}
              negativeButtonTitle={i18n.t("cancel")}
              handleNegativeButtonClick={this.handleWeakPasswordDialogNegativeButtonClick}
              handlePositiveButtonClick={this.handleWeakPasswordDialogPositiveButtonClick}
            />
          )}
        </Container>
      );
    }
  }
}

export default SignUpComponent;
