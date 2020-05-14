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
    props.isLoading === true ? theme.primaryButtonLoadingBackgroundColor : theme.primaryButtonBackgroundColor};
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${theme.primaryButtonColor};
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  box-sizing: border-box;
  cursor: pointer;
`;

const ButtonSpinner = styled(Spinner)`
  position: absolute;
  width: 20px;
  height: 20px;
  margin-top: 1px;
`;

const DisabledOverlay = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 100%;
`;

class SecondaryButton extends React.Component {
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
      <Button className={className} {...other} tabIndex={"0"} onClick={this.handleClick} isLoading={isLoading}>
        {isLoading === true ? "" : title}
        {isLoading === true && <ButtonSpinner />}
        {isDisabled === true && <DisabledOverlay>{""}</DisabledOverlay>}
      </Button>
    );
  }
}

export default SecondaryButton;
