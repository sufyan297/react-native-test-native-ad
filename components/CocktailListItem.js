import React from 'react';
import { View, Text, Image, SectionList, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { BASE_IMG_URL, FONT_FAMILY, FONT_COLOR, MAIN_COLOR } from '../config/globals';
import { get } from 'lodash';
import FastImage from 'react-native-fast-image';

export default class CocktailListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  onFavouriteCocktail(cocktail) {
    //Send To Parent
    if (this.props.onFavourite) {
      this.props.onFavourite(cocktail);

      if (this.swiperRow) {
        this.swiperRow.closeRow();
      }
    }
  }

  removeFavouriteCocktail(cocktail) {
    //Send To Parent
    if (this.props.onFavourite) {
      this.props.onFavourite(cocktail);

      if (this.swiperRow) {
        this.swiperRow.closeRow();
      }
    }
  }

  onCocktailDetail(cocktail) {
    //Send To Parent
    if (this.swiperRow) {
      this.swiperRow.closeRow();
    }
  }

  onRowDidOpen() {
    setTimeout(() => {
      if (this.swiperRow) {
        this.swiperRow.closeRow();
      }
    }, 3000)
  }

  render() {
    const item = get(this.props, 'context', {});

    return (
      <View>
        <SwipeRow
          ref={(x) => (this.swiperRow = x)}
          rightOpenValue={-75}
          disableRightSwipe={true}
          disableLeftSwipe={true}
          disableLeftSwipe={this.props.disableLeftSwipe}
          swipeToClosePercent={0}
          closeOnRowPress={true}
          onRowDidOpen={() => this.onRowDidOpen()}
          recalculateHiddenLayout={true}
        >

          {/* Hidden Row */}
          <View style={styles.rowBack}>
            {
              get(item, 'isFavourite', false) ?
                <TouchableOpacity
                  onPress={() => this.removeFavouriteCocktail(item)}
                  style={{ backgroundColor: MAIN_COLOR, height: 70, width: 75, marginTop: 30, marginBottom: 30, justifyContent: 'center', alignItems: 'center' }}>
                </TouchableOpacity>
                :
                <TouchableOpacity
                  onPress={() => this.onFavouriteCocktail(item)}
                  style={{ backgroundColor: MAIN_COLOR, height: 70, width: 75, marginTop: 30, marginBottom: 30, justifyContent: 'center', alignItems: 'center' }}>
                </TouchableOpacity>
            }
          </View>

          {/* Visible Row */}
            <TouchableWithoutFeedback
              delayPressIn={500}
              onPress={() => this.onCocktailDetail(item)} style={{zIndex: -1}}>

              <View style={{ height: 85, flexDirection: 'row', backgroundColor:'white', paddingLeft: this.props.paddingLeft || 20, paddingRight: this.props.paddingRight || 20, }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <FastImage source={{ uri: BASE_IMG_URL + get(item, 'media.directory', null) + 'tm_' + get(item, 'media.value', null) }} style={{ height: 70, width: 40 }} resizeMode={'contain'} />
                </View>

                <View style={{ flex: 4, paddingLeft: 20, justifyContent: 'center' }}>
                  <Text style={{ fontFamily: FONT_FAMILY, color: '#2b2c30', fontSize: 18, paddingBottom: 8 }}>{item.name}</Text>
                  {
                    this.props.type === 'custom_mycraft' ?
                      <Text style={{ fontFamily: FONT_FAMILY, color: FONT_COLOR, fontSize: 15 }}>{item.missing_ingredients}</Text>
                    : null
                  }

                  {
                    !this.props.type ?
                      <Text style={{ fontFamily: FONT_FAMILY, color: FONT_COLOR, fontSize: 15 }}>{item.flavour_keywords.join(', ')}</Text>
                    : null
                  }
                </View>

                <View style={{ justifyContent: 'center', paddingRight: 10 }}>
                </View>

                <TouchableWithoutFeedback onPress={() => this.onCocktailDetail(item)}>
                  <View style={{ justifyContent: 'center' }}>
                  </View>
                </TouchableWithoutFeedback>
              </View>

            </TouchableWithoutFeedback>

        </SwipeRow>
        {
          this.props.showDivider ?
              <View style={{height: 2, borderWidth: 1, borderColor: '#f0f0f0', marginRight: 20, marginLeft: 20 }} />
            : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  rowBack: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});