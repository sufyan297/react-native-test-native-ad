/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import CocktailList from './components/CocktailList';
import Cocktails from './libs/data';
import { orderBy } from 'lodash';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const data = orderBy(Cocktails, 'name', 'asc');
    this.setState({data});
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <CocktailList context={this.state.data} />
      </View>
    )
  }
}