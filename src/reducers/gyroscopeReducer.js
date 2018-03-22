import { GENERATE_GYROSCOPE } from '../actionTypes';

const gyroscopeReducerInit = {
	x: 'unknown',
	y: 'unknown',
	z: 'unknown'
}

export const gyroscopeReducer = (state = gyroscopeReducerInit, action) => {
	switch (action.type) {
		case GENERATE_GYROSCOPE:
			return {...action.payload}
		default:
			return {...state}
	}
}