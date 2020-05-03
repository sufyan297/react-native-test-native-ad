import React from 'react';
import { SectionList, View, Text, TouchableWithoutFeedback, Image, PixelRatio, Platform } from 'react-native';
import CocktailListItem from './CocktailListItem';
import { get, map, groupBy, upperCase, set } from 'lodash';
import { isAlphabet, nextChar } from '../libs/common';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import AdCard from './AdCard';

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
          renderItem={({ item, section, index }) => this.renderItem({ item, section, index })}

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