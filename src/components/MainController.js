import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Title, Text, ListItem } from 'native-base';
import RNSensors from 'react-native-sensors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import db from '../config/firebase';
import { assignGyroscope, assignGyroscopeArray } from '../actions/gyroscopeActions';

const { Gyroscope } = RNSensors;
const gyroscopeObservable = new Gyroscope({
  updateInterval: 100, // defaults to 100ms
});

class MainController extends Component {
  constructor(props){
    super(props);
  }

  componentWillMount() {
    gyroscopeObservable.subscribe(gyroscope => {
      const {x, y, z} = gyroscope;
      if (
        (Math.round(x) !== 0 && Math.floor(x) !== 0)  && (Math.round(x) !== -0 && Math.floor(x) !== -0)   && 
        (Math.round(y) !== 0 && Math.floor(y) !== 0)  && (Math.round(y) !== -0 && Math.floor(y) !== -0)  &&
        (Math.round(z) !== 0 && Math.floor(z) !== 0)  && (Math.round(z) !== -0 && Math.floor(z) !== -0) ) {
          this.props.assignGyroscopeArray(gyroscope);
          this.props.assignGyroscope(gyroscope);
      }
    });
  }

  componentWillUnmount() {
    gyroscopeObservable.stop();
  }

  render() {
  const maxZ = Math.max.apply(Math,this.props.gyroscopeArray.map(item => item.z));
  const showing = this.props.gyroscopeArray.filter(item => {
    return item.z === maxZ 
  }); 
  let magnitude = 0; 
  
  if(showing.length > 0){   
    magnitude = Math.sqrt((showing[0].z * showing[0].z) + (showing[0].y * showing[0].y) + (showing[0].x * showing[0].x)); 
  }

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
        <ListItem>
          <Text>{JSON.stringify(showing)}</Text>
        </ListItem>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    gyroscope: {
      ...state.gyroscopeReducer
    },
    gyroscopeArray: [
      ...state.gyroscopeArrayReducer
    ]
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    assignGyroscope,
    assignGyroscopeArray
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(MainController)