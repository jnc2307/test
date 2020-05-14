import React from "react";
import styled from "styled-components";
import { formatNumberWithCurrency, getSymbolForCurrency } from "@kubera/common";

const Input = styled.input``;

class CurrencyInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    if (this.isValidAmountInput(e.target.value) === false) {
      return;
    }
    this.props.onChange(this.getAmountFromInput(e.target.value), e);
  }

  isValidAmountInput(input) {
    if (input === "") {
      return false;
    }

    input = input.replace(/,/g, "");
    if (isNaN(input) === false) {
      return true;
    }
    if (input.charAt(0) === getSymbolForCurrency(this.props.currency) && isNaN(input.substr(1)) === false) {
      return true;
    }
    return false;
  }

  getAmountFromInput(input) {
    const amount =
      input.charAt(0) === getSymbolForCurrency(this.props.currency) ? input.substr(1).replace(/,/g, "") : input;
    return amount === "" ? 0 : parseInt(amount);
  }

  render() {
    const { className, type, onChange, value, currency, ...other } = this.props;
    const displayString = formatNumberWithCurrency(value, currency);

    return (
      <Input
        {...other}
        className={className}
        type="text"
        value={displayString === null ? "" : displayString}
        onChange={this.handleInputChange}
      />
    );
  }
}

export default CurrencyInput;
