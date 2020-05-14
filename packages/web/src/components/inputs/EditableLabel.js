import React from "react";
import styled from "styled-components";
import theme from "theme";

const EditableDiv = styled.div`
  margin: 0;
  border: 0;
  width: ${props => props.width};
  min-width: 30px;
  overflow: hidden;
  outline: ${props => (props.isEditable === true ? "2px solid " + theme.focusOutlineColor : 0)};
  cursor: ${props => (props.isEditable === true ? "text" : props.isClickable === true ? "pointer" : "auto")};
`;

class EditableLabel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isEditable: false };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.labelRef = React.createRef();
  }

  isEditable() {
    return this.state.isEditable;
  }

  edit() {
    setTimeout(() => {
      this.setState({ isEditable: true });
      this.labelRef.current.focus();
    }, 0);
  }

  handleKeyDown(e) {
    if (e.key === "Enter") {
      e.target.blur();
    }
  }

  handleFocus(e) {
    var sel, range;
    range = document.createRange();
    range.selectNodeContents(e.target);
    sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    if (this.props.onFocus !== undefined) {
      this.props.onFocus(e);
    }
  }

  handleBlur(e) {
    this.setState({ isEditable: false });

    if (this.props.onFocus !== undefined) {
      this.props.onBlur(e);
    }

    this.props.onChange(e.currentTarget.innerText);
  }

  render() {
    const { className, onChange, onFocus, onBlur, isClickable, ...other } = this.props;
    const value = this.props.value;
    const isEditable = this.state.isEditable;

    return (
      <EditableDiv
        {...other}
        ref={this.labelRef}
        className={className}
        contentEditable={isEditable}
        suppressContentEditableWarning={true}
        isEditable={isEditable}
        isClickable={isClickable}
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        {value}
      </EditableDiv>
    );
  }
}

export default EditableLabel;
//export default React.forwardRef((props, ref) => <EditableLabel outerRef={ref} {...props} />);
