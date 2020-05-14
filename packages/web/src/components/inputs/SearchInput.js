import React from "react";
import styled from "styled-components";
import theme from "theme";
import searchIcon from "assets/images/search_icon.svg";
import { addKeyboardEventListener, removeKeyboardEventListener } from "utilities/KeyboardEventManager";
import Spinner from "components/loader/Spinner";

const Container = styled.div`
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  align-items: center;
`;

const Icon = styled.div`
  width: 12px;
  height: 12px;
  outline: 0;
  padding: 0;
  border: 0;
  margin-left: 13px;
  background-color: transparent;
  background-image: url(${searchIcon});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 12px 12px;
`;

const Input = styled.input`
  flex: 1;
  margin: 0;
  margin-left: 6px;
  padding: 0;
  outline: 0;
  border: 0;
  font-style: inherit;
  font-weight: inherit;
  font-size: inherit;
  line-height: inherit;
  background-color: transparent;

  ::placeholder {
    color: ${theme.searchInputPlaceholderColor};
  }
`;

const SearchSpinner = styled(Spinner)`
  width: 15px;
  height: 15px;
  margin-right: 10px;
`;

class SearchInput extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    this.timer = null;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    addKeyboardEventListener(this.handleKeyDown);
  }

  componentWillUnmount() {
    removeKeyboardEventListener(this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.key === "Escape") {
      if (this.props.value && this.inputRef.current) {
        this.inputRef.current.value = "";
        this.handleSearchTermChange("");
        return true;
      }
    }
    return false;
  }

  handleInputChange(e) {
    this.handleSearchTermChange(e.target.value);
  }

  handleSearchTermChange(value) {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      if (this.props.onChange) {
        this.props.onChange(value);
      }
      this.timer = null;
    }, 150);
  }

  render() {
    const { className, type, onChange, value, isLoading, ...other } = this.props;

    return (
      <Container className={className}>
        <Icon />
        <Input
          {...other}
          ref={this.inputRef}
          type="text"
          onChange={this.handleInputChange}
          autoComplete="new-password"
        />
        {!isLoading === false && <SearchSpinner darkTheme={true} />}
      </Container>
    );
  }
}

export default SearchInput;
