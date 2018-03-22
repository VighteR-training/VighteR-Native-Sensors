import { GENERATE_GYROSCOPE } from '../actionTypes';

const generateGyroscope = (payload) => {
  return {
    type: GENERATE_GYROSCOPE,
    payload
  }
}

export const assignGyroscope = (gyroscope) => {
  return (dispatch) => {
    dispatch(generateGyroscope(gyroscope));
  }
}