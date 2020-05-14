import React from "react";
import styled from "styled-components";
import theme from "theme";
import Spinner from "components/loader/Spinner";

const Button = styled.button`
  position: relative;
  width: fit-content;
  height: 44px;
  min-width: 155px;
  background-color: ${props =>
    props.isLoading === true || props.isDisabled === true
      ? theme.primaryButtonLoadingBackgroundColor
      : theme.primaryButtonBackgroundColor};
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => (props.isDisabled === true ? theme.primaryButtonDisabledColor : theme.primaryButtonColor)};
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  cursor: pointer;
`;

const ButtonSpinner = styled(Spinner)`
  position: absolute;
  width: 20px;
  height: 20px;
  margin-top: 1px;
`;

class PrimaryButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.isLoading === true || this.props.isDisabled === true) {
      return;
    }
    this.props.onClick(e);
  }

  render() {
    const { className, title, isLoading, isDisabled, onClick, ...other } = this.props;

    return (
      <Button
        className={className}
        {...other}
        tabIndex={"0"}
        onClick={this.handleClick}
        isLoading={isLoading}
        isDisabled={isDisabled}
      >
        {isLoading === true ? "" : title}
        {isLoading === true && <ButtonSpinner />}
      </Button>
    );
  }
}

export default PrimaryButton;
