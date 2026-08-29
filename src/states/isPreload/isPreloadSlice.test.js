import {describe, it, expect} from 'vitest';
import isPreloadReducer from './isPreloadSlice';

describe('isPreloadReducer', () => {
  it('should return the initial state when given an unknown action', () => {
    const initialState = true;
    const action = {type: 'UNKNOWN'};
    const nextState = isPreloadReducer(initialState, action);

    expect(nextState).toEqual(initialState);
  });

  it('should return false when asyncPreloadAuthUser is fulfilled', () => {
    const initialState = true;
    const action = {type: 'authUser/preload/fulfilled'};
    const nextState = isPreloadReducer(initialState, action);

    expect(nextState).toEqual(false);
  });

  it('should return false when asyncPreloadAuthUser is rejected', () => {
    const initialState = true;
    const action = {type: 'authUser/preload/rejected'};
    const nextState = isPreloadReducer(initialState, action);

    expect(nextState).toEqual(false);
  });
});
