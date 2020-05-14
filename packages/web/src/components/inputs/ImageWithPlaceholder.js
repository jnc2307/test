import React from "react";
import styled from "styled-components";

const ProfileImagePlaceholder = styled.div`
  position: relative;
  background-image: url(${props => props.placeholder});
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  visibility: ${props => (props.visible === true ? "visible" : "hidden")};
`;

const ProfileImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: white;
  visibility: ${props => (props.visible === true ? "visible" : "hidden")};
  object-fit: cover;
`;

class ImageWithPlaceholder extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showImage: false, showPlaceholder: false };
    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.handleImageError = this.handleImageError.bind(this);

    // This is to prevent flickering when the browser is
    // loading the image from cache and the placeholder gets
    // show intermittently and creates a flash
    setTimeout(() => {
      this.setState({ ...this.state, showPlaceholder: true });
    }, 0.1);
  }

  handleImageError() {
    this.setState({ ...this.state, showImage: false, showPlaceholder: true });
  }

  handleImageLoad() {
    this.setState({ ...this.state, showImage: true });
  }

  render() {
    const { className, placeholder, imageUrl, ...other } = this.props;
    const showImage = this.state.showImage;
    const showPlaceholder = this.state.showPlaceholder;

    return (
      <ProfileImagePlaceholder {...other} className={className} placeholder={placeholder} visible={showPlaceholder}>
        <ProfileImage
          src={imageUrl}
          visible={showImage}
          onLoad={this.handleImageLoad}
          onError={this.handleImageError}
        />
      </ProfileImagePlaceholder>
    );
  }
}

export default ImageWithPlaceholder;
