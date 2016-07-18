import React, { PropTypes as T} from 'react'

import {
  View,
  Text,
  Animated,
  Image
} from 'react-native'

export class LoadingImage extends React.Component {

  static propTypes = {
    backgroundColor: T.string,
    style: T.array
  };

  static defaultProps = {
    backgroundColor: '#444bfc'
  }

  constructor(props) {
    super(props);

    this.state = {
      thumbnailOpacity: new Animated.Value(0)
    }
  }

  componentDidMount() {
    this.props.loadImage();
  }

  onLoad() {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 0,
      duration: 250
    }).start();
  }

  onThumbnailLoad() {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 1,
      duration: 250
    }).start();
  }
  render() {
    const {key, source, loadImage, style, backgroundColor} = this.props;
    const width = style.width || 50;
    const height = style.height || 50;

    return (
      <View 
        width={width} height={height}
        backgroundColor={backgroundColor}>
          <Animated.Image
            resizeMode={'contain'}
            key={key}
            style={[
              {position: 'absolute'},
              style
            ]}
            source={source}
            onLoad={this.onLoad.bind(this)} />
          <Animated.Image 
            resizeMode={'contain'}
            key={key}
            style={[
              {opacity: this.state.thumbnailOpacity},
              this.props.style
            ]}
            source={this.props.thumbnail}
            onload={this.onThumbnailLoad.bind(this)} />
      </View>
    );
  }
}

export default LoadingImage