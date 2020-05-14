import React from "react";
import styled from "styled-components";
import checkboxCheckedIcon from "assets/images/checkbox_checked.svg";
import checkboxUncheckedIcon from "assets/images/checkbox_unchecked.svg";
import checkboxDisabledIcon from "assets/images/checkbox_disabled.svg";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const CheckboxSquare = styled.div`
  width: 15px;
  height: 15px;
  min-width: 15px;
  background-image: url(${props =>
    props.disabled === true
      ? checkboxDisabledIcon
      : props.checked === true
      ? checkboxCheckedIcon
      : checkboxUncheckedIcon});
  background-repeat: no-repeat;
  background-position: center;
`;

const CheckboxLabel = styled.div`
  margin-left: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  font-feature-settings: "ss01" on;
  color: ${props => (props.disabled === true ? "rgba(0, 0, 0, 0.5)" : "black")};
`;

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = { checked: props.checked === true };

    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }

  componentDidMount() {
    this.preloadIcons();
  }

  preloadIcons() {
    const icons = [checkboxCheckedIcon, checkboxUncheckedIcon, checkboxDisabledIcon];

    for (const icon of icons) {
      const img = new Image();
      img.src = icon;
    }
  }

  componentDidUpdate(oldProps) {
    if (this.state.checked !== this.props.checked) {
      this.setState({ checked: this.props.checked });
    }
  }

  toggleCheckbox() {
    if (this.props.disabled === true) {
      return;
    }
    const newCheckedState = !this.state.checked;
    this.setState({ checked: newCheckedState });

    if (this.props.onChange) {
      this.props.onChange(newCheckedState);
    }
  }

  render() {
    return (
      <Container className={this.props.className}>
        <CheckboxSquare checked={this.state.checked} disabled={this.props.disabled} onClick={this.toggleCheckbox} />
        <CheckboxLabel disabled={this.props.disabled}>{this.props.label}</CheckboxLabel>
      </Container>
    );
  }
}

export default Checkbox;
