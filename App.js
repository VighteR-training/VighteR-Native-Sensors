import React from 'react';
import { Text, View } from 'react-native';
import MainController from './src/components/MainController';

export default class App extends React.Component {
  render() {
    return (
      <View>
        <MainController/>
      </View>
    );
  }
}
