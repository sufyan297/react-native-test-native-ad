import React from 'react';
import { SectionList, View, Text, TouchableWithoutFeedback, Image, PixelRatio, Platform } from 'react-native';
// import CocktailListItem from './CocktailListItem';
import { get, map, groupBy, upperCase, set } from 'lodash';
import { isAlphabet, nextChar } from '../libs/common';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
// import AdCard from './AdCard';


import FastImage from 'react-native-fast-image';
import { BASE_IMG_URL, FONT_FAMILY, FONT_COLOR, MAIN_COLOR } from '../config/globals';

import NativeAdView, {
  CallToActionView,
  IconView,
  HeadlineView,
  TaglineView,
  AdvertiserView,
  MediaView,
  AdBadge
} from 'react-native-admob-native-ads';


const AdCard = ({delayAdLoading = 0}) => (
  <NativeAdView
    style={{
      width: "100%",
      alignSelf: "center",
      height: 85
    }}
    delayAdLoading={delayAdLoading} // here
    // onAdLoaded={() => this.setState({showAd: true})}
    onAdFailedToLoad={(err) => {
      // this.setState({showAd: false});
      console.log("ERR: ",err);
    }}
    onAdClicked={() => {
      console.log("ad Clicked.")
    }}
    adUnitID="ca-app-pub-3940256099942544/2247696110" // TEST adUnitID
    // adUnitID={'ca-app-pub-7136861504772259/5676937433'}
  >
    <View
      style={{
        height: 85,
        width: "100%",
        backgroundColor: "white",
      }}
    >
      <View style={{marginLeft: 10, marginBottom: 8, marginTop: 5}}>
        <AdBadge 
          style={{width: 20}}
          textStyle={{textAlign: 'center'}}
        />
      </View>
      <View
        style={{
          height: 85,
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <IconView
          style={{
            paddingTop: 20,
            width: 60,
            height: 60,
          }}
        />
        <View
          style={{
            width: "65%",
            maxWidth: "65%",
            paddingHorizontal: 6,
            marginLeft: 7
          }}
        >
          <HeadlineView
            style={{
              fontSize: 18,
              fontFamily: FONT_FAMILY,
              color: '#2b2c30'
            }}
            numberOfLines={1}
            textBreakStrategy={'highQuality'}
          />
          <TaglineView
            numberOfLines={1}
            style={{
              fontSize: 13,
              fontFamily: FONT_FAMILY,
              color: "#707070"
            }}
          />
          <AdvertiserView
            style={{
              fontSize: 10,
              color: "#707070",
              fontFamily: FONT_FAMILY
            }}
          />
        </View>
        
        <View style={{borderRadius: 3, borderWidth: 1, borderColor: MAIN_COLOR}}>
          <CallToActionView
            style={{
              height: 44,
              paddingHorizontal: 10,
              justifyContent: "center",
              alignItems: "center",
              elevation: 1,
              backgroundColor: 'none',
              flexWrap: 'wrap'
            }}
            textStyle={{ color: MAIN_COLOR, fontSize: 12, fontFamily: FONT_FAMILY}}
          />
        </View>
      </View>
    </View>
  </NativeAdView>
)

const CocktailListItem = ({ item, index, sectionIndex }) => (
  <TouchableWithoutFeedback
    delayPressIn={500}
    onPress={() => this.onCocktailDetail(item)} style={{zIndex: -1}}>

    <View style={{ height: 85, flexDirection: 'row', backgroundColor:'white', paddingLeft: 20, paddingRight: 20, }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <FastImage source={{ uri: BASE_IMG_URL + get(item, 'media.directory', null) + 'tm_' + get(item, 'media.value', null) }} style={{ height: 70, width: 40 }} resizeMode={'contain'} />
      </View>

      <View style={{ flex: 4, paddingLeft: 20, justifyContent: 'center' }}>
        <Text style={{ fontFamily: FONT_FAMILY, color: '#2b2c30', fontSize: 18, paddingBottom: 8 }}>{item.name}</Text>

        <Text style={{ fontFamily: FONT_FAMILY, color: FONT_COLOR, fontSize: 15 }}>{get(item,'flavour_keywords', []).join(', ')}</Text>
      </View>

      <View style={{ justifyContent: 'center', paddingRight: 10 }}>
      </View>

      <TouchableWithoutFeedback onPress={() => this.onCocktailDetail(item)}>
        <View style={{ justifyContent: 'center' }}>
        </View>
      </TouchableWithoutFeedback>
    </View>

  </TouchableWithoutFeedback>
)

export default class CocktailList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cocktails: [],
      scrollTotop: false,
      lastLetter: null
    };

    //ref
    this.sectionList = null;
    this.getItemLayout = sectionListGetItemLayout({
      // The height of the row with rowData at the given sectionIndex and rowIndex
      getItemHeight: (rowData, sectionIndex, rowIndex) => 85, //sectionIndex === 0 ? 100 : 120,

      // These three properties are optional
      getSeparatorHeight: () => 1 / PixelRatio.get(), // The height of your separators
      getSectionHeaderHeight: () => 20, // The height of your section headers
      getSectionFooterHeight: () => 10, // The height of your section footers
    })

    this.viewabilityConfig = {
      waitForInteraction: true,
      // viewAreaCoveragePercentThreshold: 75,
      itemVisiblePercentThreshold: 75
    }
  }

  componentDidMount() {
    this.onCocktailData(this.props);
    console.log("[CocktailList]");
    //
    if (this.props.scrollToSection && this.state.lastLetter !== this.props.scrollToSection) {
      this.onScrollToSection(this.props.scrollToSection || 'A');
      this.setState({lastLetter: this.props.scrollToSection});
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.onCocktailData(nextProps);

    if (nextProps.scrollToSection && this.state.lastLetter !== nextProps.scrollToSection) {
      this.onScrollToSection(nextProps.scrollToSection || 'A');
      this.setState({lastLetter: nextProps.scrollToSection});
    }
  }

  //------ Scrub Bar
  getSectionIndexByLetter(letter) {
    const cocktails = this.state.cocktails;
    let index = 0, flg = false;
    cocktails.some((alphabet, key) => {
      if (alphabet.title == letter) {
        index = key;
        flg = true;
        return true;
      }
    });

    if (flg || letter == 'z') {
      return index;
    } else {
      const nextLetter = nextChar(letter).toUpperCase();
      // console.log("NextLetter: ", nextLetter)
      return this.getSectionIndexByLetter(nextLetter);
    }
  }

  onScrollToSection(letter) {
    const index = this.getSectionIndexByLetter(letter);
    try {
      if (this.sectionList && index > -1) {
        this.sectionList.scrollToLocation({animted: false, sectionIndex: index, itemIndex: 0, viewOffset: 0, viewPosition: 0});
        // this.sectionList.scrollToLocation({ animated: true, sectionIndex: index, itemIndex: -1, viewPosition: 0, viewOffset: 0 });
      }
    } catch (error) {
      console.log("scroll error",error);
    }
  }
  //----------------

  renderItem({ item, section, index }) {
    const sectionItemLength = get(section, 'data.length', 0);

    if (item.isAd || (item.letter === 'A' && index === 0)) {
      return (
        <View style={{ width: '100%', paddingLeft: 20 }}>
          <AdCard delayAdLoading={item.index === 0 ? 0 : 1000 * 1 * parseInt(Math.random() * 10)} />
        </View>
      )
    } else {
      return (
        <CocktailListItem
          index={index}
          showPreview={true}
          context={item}
          // showAd={((item.letter === 'A' && index === 0) || item.index === 11) ? true : false}
          onFavourite={(cocktail) => this.onFavouriteCocktail(cocktail, section, index)}
          onCocktailDetail={(cocktail) => this.onCocktailDetail(cocktail)}
          paddingLeft={this.props.paddingLeft}
          paddingRight={this.props.paddingRight}
          marginLeft={this.props.marginLeft}
          marginRight={this.props.marginRight}
          showDivider={(sectionItemLength - 1) === index ? false : true}
          // if custom_mycraft
          type={this.props.type}
        />
      )
    }
  }

  renderNewItem({item, section, index}) {
    // if (item.isAd) {
    //   return (
    //     <AdCard delayAdLoading={item.index === 0 ? 0 : 1000 * 1 * parseInt(Math.random() * 10)} />
    //   )
    // } else {
      return (
        <TouchableWithoutFeedback>
          <View style={{height: 85, flexDirection: 'row', backgroundColor:'white', paddingLeft: 20, paddingRight: 20}}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <FastImage source={{ uri: BASE_IMG_URL + get(item, 'media.directory', null) + 'tm_' + get(item, 'media.value', null) }} style={{ height: 70, width: 40 }} resizeMode={'contain'} />
            </View>
            <View style={{flex: 4, paddingLeft: 20, justifyContent: 'center'}}>
              <Text>{item.name}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
    // }
  }

  //onFav/unFav
  async onFavouriteCocktail(cocktail, section, index) {
    //API Call

  }

  //onCocktail Press
  onCocktailDetail(cocktail) {

  }

  renderSectionHeader(title) {
    return (
      !this.props.hideHeader && title !== null?
        <View style={{ backgroundColor: '#ececec', height: 30, justifyContent: 'center' }}>
          <Text style={{ paddingLeft: 20, fontSize: 20, fontFamily: 'Oswald-Bold' }}>{title}</Text>
        </View>
        : null
    )
  }

  onCocktailData(props) {
    const tmpData = [], finalData = [];
    const data = get(props, 'context', []);
    if (get(props, 'type', null) === 'custom_mycraft') {
      this.setState({cocktails: data});
    } else {
      let itemIndex = 0;
      data.map((val, idx) => {
        itemIndex ++;
        const tmpLetter = isAlphabet(upperCase(get(val, 'name').charAt(0))) ? upperCase(get(val, 'name').charAt(0)) : '#';
        if (itemIndex > 11) {
          tmpData.push({
            isAd: true,
            index: itemIndex,
            id: val.id + 'ad',
            letter: tmpLetter
          })
          itemIndex = 0;
        }
        tmpData.push({
          ...val,
          index: itemIndex,
          isAd: false,
          letter: tmpLetter
        })
      })
      map(groupBy(tmpData, 'letter'), (val, key) => {
        finalData.push({
          title: key,
          data: val
        })
      });
      this.setState({ cocktails: finalData });
    }
  }

  keyExtractor = (item, index) => item.id;

  onScroll(e) {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 250) {
      if (this.state.scrollTotop !== true) {
        this.setState({ scrollTotop: true });
      }
    } else {
      if (this.state.scrollTotop !== false) {
        this.setState({ scrollTotop: false });
      }
    }

    if (this.props.onScroll) {
      this.props.onScroll(y);
    }
  }
  
  render() {
    return (
      <View>
        <SectionList
          ref={ref => (this.sectionList = ref)}
          onRefresh={this.props.onRefresh ? this.props.onRefresh : null}
          refreshing={this.props.refreshing ? this.props.refreshing : false}
          keyExtractor={this.keyExtractor}
          ListHeaderComponent={this.props.ListHeaderComponent ? this.props.ListHeaderComponent : null}
          ListEmptyComponent={this.props.ListEmptyComponent ? this.props.ListEmptyComponent : null}

          onScroll={this.props.scrollTotop ? (e) => this.onScroll(e) : null}
          scrollEventThrottle={16}

          renderSectionHeader={({ section: { title } }) => this.renderSectionHeader(title)}
          renderItem={({item}) => !item.isAd ? CocktailListItem({item}) : AdCard({ delayAdLoading: item.index === 0 ? 0 : 1000 * 1 * parseInt(Math.random() * 10)})}

          sections={this.state.cocktails} //DATA

          stickySectionHeadersEnabled={true}
          initialNumToRender={21}
          windowSize={21}
          maxToRenderPerBatch={21}
          // removeClippedSubviews={true}
          // decelerationRate={Platform.OS === 'android' ? 0.965 : 0.975}
          disableVirtualization={false}
          getItemLayout={this.getItemLayout}
          // viewabilityConfig={this.viewabilityConfig}
          // onViewableItemsChanged={(info) => this.onViewableItemsChanged(info)}
        />

        {
          this.props.scrollTotop && this.state.scrollTotop ?
            <TouchableWithoutFeedback
              onPress={() => {
                if (this.sectionList) {
                  this.setState({ activeSectionIndex: 0 }, () => this.sectionList.scrollToLocation({ animated: true, sectionIndex: 0, itemIndex: 0, viewPosition: 0 }))
                }
              }}
            >
              <View style={{ position: 'absolute', bottom: 0, right: 20 }}>

              </View>
            </TouchableWithoutFeedback>
            :
            null
        }
      </View>
    )
  }
}