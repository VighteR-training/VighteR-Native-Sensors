import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Title, Text, ListItem } from 'native-base';
import RNSensors from 'react-native-sensors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import db from '../config/firebase';
import { assignGyroscope } from '../actions/gyroscopeActions';

const { Gyroscope } = RNSensors;
const gyroscopeObservable = new Gyroscope({
  updateInterval: 100, // defaults to 100ms
});

class MainController extends Component {
  componentWillMount() {
    gyroscopeObservable.subscribe(gyroscope => {
      this.props.assignGyroscope(gyroscope);
    });
  }

  componentWillUnmount() {
    gyroscopeObservable.stop();
  }

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Header</Title>
          </Body>
        </Header>
        <ListItem>
          <Text>{JSON.stringify(this.props.gyroscope)}</Text>
        </ListItem>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    gyroscope: {
      ...state.gyroscopeReducer
    }
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    assignGyroscope
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(MainController)