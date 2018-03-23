import React from 'react';
import { Container } from 'native-base';
import {Provider} from 'react-redux';

import MainController from './src/components/MainController';
import store from './src/store/index';

export default class App extends React.Component {
  render() {
    return (
      <Provider store = {store}>
        <MainController/>
      </Provider>
    );
  }
}
