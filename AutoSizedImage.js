import React from 'react';
import {
  Image,
  Dimensions,
} from 'react-native';

let width = Dimensions.get('window').width - 32;

const baseStyle = {
  backgroundColor: 'transparent',
};

export default class AutoSizedImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // set width 0 is for preventing mipmapping in iOS
      // You must specify a width and height for the image %s
      width: this.props.style.width || width,
      height: this.props.style.height || 0,
    };
  }

  async componentWillMount() {
    //avoid repaint if width/height is given
    if (this.props.style.width && this.props.style.height) {
      return;
    }
    await Image.getSize(this.props.source.uri, (w, h) => {
      console.log('image ', this.props.source.uri, w, h)

      if (!w) {
        w = 100
      }

      if (!h) {
        h = 100
      }
      this.setState({width: w, height: h});
    });
  }

  render() {
    const finalSize = {};
    if (this.state.width > width) {
      finalSize.width = width;
      const ratio = width / this.state.width;
      finalSize.height = this.state.height * ratio;
    }
    const style = Object.assign(
      baseStyle,
      this.props.style,
      this.state,
      finalSize
    );
    let source = {};
    if (!finalSize.width || !finalSize.height) {
      source = Object.assign(source, this.props.source, this.state);
    } else {
      source = Object.assign(source, this.props.source, finalSize);
    }

    return <Image style={style} source={source} />;
  }
}
