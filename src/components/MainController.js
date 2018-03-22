import React, { Component } from 'react';
import { Container, Button, Text } from 'native-base';
export default class MainController extends Component {
  render() {
    return (
      <Container>
        <Button>
          <Text>
            ON/OFF
          </Text>
        </Button>
      </Container>
    );
  }
}