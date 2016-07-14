import React, { PropTypes as T } from 'react'

import {
  View,
  Text,
  Image,
  StyleSheet,

  Animated,
} from 'react-native'

// replace with sticker component
import Icon from 'react-native-vector-icons/FontAwesome'
const size = 50
const stickerNames = [
  'flag', 'bolt', 'thumbs-up', 'camera', 'beer', 'binoculars', 'building',
  'bomb', 'circle', 'circle-o', 'dashboard', 'desktop', 'male', 'female',
  'hand-paper-o', 'hand-scissors-o', 'lemon-o', 'leaf'
]
const stickers = stickerNames.map((name, idx) => ({
  id: idx,
  name: name,
  Component: () => <Icon size={size} name={name} />
}))
// end replace

import StickerPicker, {Sticker} from '../../components/Stickers'

console.log('Sticker ->', Sticker);

export class PhotoView extends React.Component {
  static propTypes: {
    photo: T.object
  }

  constructor(props) {
    super(props);

    this.state = {
      canScrollStickers: true,
      dropZoneValues: null,
      pan: new Animated.ValueXY(),

      placedStickers: {}
    }
  }

  draggingStickersStart() {
    this.setState({
      canScrollStickers: false
    })
  }

  draggingStickersEnd() {
    this.setState({
      canScrollStickers: true
    })
  }

  setDropZoneValues(event){      //Step 1
    this.setState({
      dropZoneValues : event.nativeEvent.layout
    });
  }

  isDropZone(gesture) {
    const dz = this.state.dropZoneValues;
    return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
  }

  renderSticker(sticker, otherProps={}) {
    const {actions} = this.props;

    return (
      <Sticker
        {...otherProps}
        key={sticker.id}
        sticker={sticker}
        actions={actions}
        isDropZone={this.isDropZone.bind(this)}
        setLocation={this.setLocation.bind(this)}
        onDrag={this.draggingStickersStart.bind(this)}
        onDragEnd={this.draggingStickersEnd.bind(this)} />
    )
  }

  setLocation({nativeEvent}, sticker, pan, gesture) {
    const newSticker = Object.assign({}, sticker, {
      key: +new Date(),
      initialLocation: {x: +nativeEvent.pageX, y: +nativeEvent.pageY}
    })

    const {placedStickers} = this.state;

    this.setState({
      placedStickers: {
        ...placedStickers,
        [sticker.id]: newSticker
      }
    })
  }

/**/
  render() {
    const {actions} = this.props;
    const {routeProps} = this.props.route;
    const {photo} = routeProps;
    const {placedStickers, canScrollStickers} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.image}>
          {Object.keys(placedStickers)
              .map(stickerKey => {
                const sticker = placedStickers[stickerKey];
                const StickerComponent = this.renderSticker(sticker, {
                  initialLocation: sticker.initialLocation
                })
                const StickerEle =
                  React.createElement(StickerComponent, {
                    key: stickerKey
                  });

                return (
                  <View><StickerEle key={stickerKey} /></View>
                )
            })
          }
          <Image
            onLayout={this.setDropZoneValues.bind(this)}
            style={styles.imageContainer}
            source={{uri: photo.url }} />
        </View>
        <View style={styles.picker}>
          <StickerPicker
            stickers={stickers}
            canScroll={canScrollStickers}
            renderSticker={this.renderSticker.bind(this)} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  imageContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  image: {
    flex: 5,
    zIndex: 1,
  },
  picker: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  sticker: {
  }
})

export default PhotoView;
