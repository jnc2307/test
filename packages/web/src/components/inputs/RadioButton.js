import React from "react";
import styled from "styled-components";
import checkedRadioButton from "assets/images/radio_button_checked.svg";
import uncheckedRadioButton from "assets/images/radio_button_unchecked.svg";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const CheckboxSquare = styled.div`
  width: 17px;
  height: 17px;
  background-image: url(${props => (props.checked === true ? checkedRadioButton : uncheckedRadioButton)});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  cursor: pointer;
`;

const CheckboxLabel = styled.div`
  margin-left: 10px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  font-feature-settings: "ss01" on;
  color: #000000;
  color: black;
  cursor: pointer;
`;

class RadioButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = { checked: props.checked === true };

    this.handleSelection = this.handleSelection.bind(this);
    this.preloadIcons();
  }

  preloadIcons() {
    const icons = [checkedRadioButton, uncheckedRadioButton];

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

  handleSelection() {
    const newCheckedState = true;
    this.setState({ checked: newCheckedState });

    if (this.props.onChange) {
      this.props.onChange(this.props.value);
    }
  }

  render() {
    return (
      <Container className={this.props.className}>
        <CheckboxSquare checked={this.state.checked} onClick={this.handleSelection} />
        <CheckboxLabel onClick={this.handleSelection}>{this.props.label}</CheckboxLabel>
      </Container>
    );
  }
}

export default RadioButton;
