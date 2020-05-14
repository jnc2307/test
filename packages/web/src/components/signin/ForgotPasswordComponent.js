import React from "react";
import styled from "styled-components";
import i18n from "i18next";
import { isEmailValid, forgotPassword } from "@kubera/common";
import PrimaryButton from "components/button/PrimaryButton";
import AppLogo from "components/labels/AppLogo";
import EmailInput from "components/inputs/EmailInput";
import ClickableLink from "components/labels/ClickableLink";
import { routes } from "routes";
import { withRouter } from "react-router-dom";
import { queryParams } from "routes";

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

const ErrorMessage = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 130%;
  font-feature-settings: "ss01" on;
  color: #ff0000;
  margin-top: 7px;
  margin-bottom: 7px;
  visibility: ${props => (props.visible === true ? "visible" : "hidden")};
`;

const EmailField = styled(EmailInput)`
  height: 50px;
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

class ForgotPasswordComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      isEmailError: false,
      errorMessage: null,
      isRequestPending: false
    };
    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.handleResetPasswordClick = this.handleResetPasswordClick.bind(this);
  }

  handleEmailInput(e) {
    this.setState({ ...this.state, email: e.target.value.trim(), isEmailError: false, errorMessage: null });
  }

  handleResetPasswordClick() {
    const email = this.state.email;
    let isEmailError = false;
    let errorMessage = null;

    if (!email) {
      errorMessage = i18n.t("emptyEmailForgotPassword");
      isEmailError = true;
    } else if (isEmailValid(email) === false) {
      errorMessage = i18n.t("wrongEmailFormat");
      isEmailError = true;
    }

    if (isEmailError === false) {
      this.resetPassword();
    } else {
      this.setState({
        ...this.state,
        isEmailError,
        errorMessage
      });
    }
  }

  resetPassword() {
    this.setState({ ...this.state, isRequestPending: true });

    const email = this.state.email;
    forgotPassword(
      email,
      () => {
        this.showForgotPasswordConfirmationScreen();
      },
      error => {
        if (error.code === "UserNotFoundException") {
          this.showForgotPasswordConfirmationScreen();
          return;
        }
        this.setState({ ...this.state, isRequestPending: false, errorMessage: error.message });
      }
    );
  }

  showForgotPasswordConfirmationScreen() {
    this.props.history.push({
      ...this.props.location,
      pathname: routes.FORGOT_PASSWORD_CONFIRMATION,
      hash: "",
      search: `${queryParams.EMAIL_ID}=${encodeURIComponent(this.state.email)}`
    });
  }

  render() {
    const isRequestPending = this.state.isRequestPending;
    const isEmailError = this.state.isEmailError;
    const email = this.state.email;
    const errorMessage = this.state.errorMessage;

    return (
      <Container>
        <ContentContainer>
          <AppLogo />
          <SignInForm>
            <Title>{i18n.t("forgotPassword").replace(" ", "\n")}</Title>
            <ErrorMessage visible={!errorMessage === false}>
              {!errorMessage === true ? "&nbsp;" : errorMessage}
            </ErrorMessage>
            <EmailField
              placeholder={i18n.t("yourEmail")}
              inputError={isEmailError}
              value={email}
              onChange={this.handleEmailInput}
              autoFocus={true}
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

export default withRouter(ForgotPasswordComponent);
