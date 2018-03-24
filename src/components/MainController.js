import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Title, Text, ListItem } from 'native-base';
import RNSensors from 'react-native-sensors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import db from '../config/firebase';
import { assignGyroscope, assignGyroscopeArray, resetGyroscopeArray } from '../actions/gyroscopeActions';
import Platform from '../helpers/dimensions';

const { Gyroscope } = RNSensors;
const gyroscopeObservable = new Gyroscope({
  updateInterval: 300
});

class MainController extends Component {
  constructor(props){
    super(props);
    this.state = {
      chosen: null,
      magnitude: null,
      email: 'vlootfie@gmail.com',
      temp: [],
      orientation: {
        isPortrait: false,
        isLandscape: false,
        isPhone: false,
        isTablet: false
      }
    }
  }

  componentWillMount() {
    gyroscopeObservable.subscribe(gyroscope => {
      this.setState({
        orientation: {
        isPortrait : Platform.isPortrait(),
        isLandscape : Platform.isLandscape(),
        isPhone : Platform.isPhone(),
        isTablet : Platform.isTablet(),
        }
      })
      const {x, y, z} = gyroscope;
      if (z > 1) {
          this.props.assignGyroscopeArray(gyroscope);
          this.props.assignGyroscope(gyroscope);

          const maxZ = Math.max.apply(Math,this.props.gyroscopeArray.map(item => item.z));
          const showing = this.props.gyroscopeArray.filter(item => {
            return item.z === maxZ 
          });

          let magnitude = 0; 
          
          if(showing.length > 0){   
            magnitude = Math.sqrt((showing[0].z * showing[0].z) + (showing[0].y * showing[0].y) + (showing[0].x * showing[0].x)); 
          }

          this.setState({
            magnitude,
            chosen: showing[0]
          })
          this.getSignal();             
      }
    });
  }

  componentWillUnmount() {
    gyroscopeObservable.stop();
  }

  saveHistoryIntoFirebase(obj) {

    db.ref(this.state.email.split('@')[0]).set(obj)
    .then(() => {
      this.props.resetGyroscopeArray()
      this.changeStatus(obj)
    })
    .catch(err => {
      console.log(err)
    })
  }

  changeStatus(obj) {
    db.ref(this.state.email.split('@')[0]).set({...obj, ready: false});
  }

  getSignal(callback){
    
    db.ref(this.state.email.split('@')[0]).on('value', (snapshot) => {
      let data = snapshot.val()
      if(data.ready){
        setTimeout(()=>{
          this.setState(
            {
              temp: [...this.state.temp, {power: this.state.magnitude, gyroscope: this.state.chosen, type: data.type}]
            }
          )          
          this.saveHistoryIntoFirebase({power: this.state.magnitude, gyroscope: this.state.chosen, type: data.type})
        }, 3000)
      }
    })
  }

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>VighteR</Title>
          </Body>
        </Header>
        <ListItem>
          <Text>{JSON.stringify(this.props.gyroscope)}</Text>
        </ListItem>
        <ListItem>
          <Text>{JSON.stringify(this.state.chosen)}</Text>
        </ListItem>
        <Text>
          isPortrait = { this.state.orientation.isPortrait ? 'true\n' : 'false\n'}
          isLandscape = { this.state.orientation.isLandscape ? 'true\n' : 'false\n'}
          isPhone = { this.state.orientation.isPhone ? 'true\n' : 'false\n'}
          isTablet = {this.state.orientation.isTablet ? 'true\n' : 'false\n'}
        </Text>
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
    assignGyroscopeArray,
    resetGyroscopeArray
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(MainController)