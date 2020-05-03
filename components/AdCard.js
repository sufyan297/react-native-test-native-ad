import React from 'react';
import NativeAdView, {
  CallToActionView,
  IconView,
  HeadlineView,
  TaglineView,
  AdvertiserView,
  MediaView,
  AdBadge
} from 'react-native-admob-native-ads';
import { View } from 'react-native';
import { FONT_FAMILY, PRIMARY_COLOR, MAIN_COLOR } from '../config/globals';

export default class AdCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAd: null
    };
  }

  render() {
    if (this.state.showAd === false) {
      return null;
    }
    return (
      <View style={{flex: 1}}>
        <NativeAdView
          style={{
            width: "100%",
            alignSelf: "center",
            height: 85
          }}
          delayAdLoading={this.props.delayAdloading} // here
          onAdLoaded={() => this.setState({showAd: true})}
          onAdFailedToLoad={(err) => {
            this.setState({showAd: false});
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
        <View style={{height: 2, borderWidth: 1, borderColor: '#f0f0f0', marginRight: 20, marginLeft: 20 }} />

      </View>
    )
  }
}