import {describe, it, expect} from 'vitest';
import authUserReducer, {unsetAuthUser} from './authUserSlice';

describe('authUserReducer', () => {
  it('should return the initial state when given an unknown action', () => {
    const initialState = {
      value: null,
      status: 'idle',
      error: null,
    };
    const action = {type: 'UNKNOWN'};
    const nextState = authUserReducer(initialState, action);

    expect(nextState).toEqual(initialState);
  });

  it('should handle unsetAuthUser correctly', () => {
    const initialState = {
      value: {id: 1, name: 'Test User'},
      status: 'succeeded',
      error: null,
    };
    const nextState = authUserReducer(initialState, unsetAuthUser());

    expect(nextState.value).toEqual(null);
  });

  it('should handle asyncLoginUser.pending correctly', () => {
    const initialState = {
      value: null,
      status: 'idle',
      error: null,
    };
    const action = {type: 'authUser/login/pending'};
    const nextState = authUserReducer(initialState, action);

    expect(nextState.status).toEqual('loading');
    expect(nextState.error).toEqual(null);
  });

  it('should handle asyncLoginUser.fulfilled correctly', () => {
    const initialState = {
      value: null,
      status: 'loading',
      error: null,
    };
    const action = {
      type: 'authUser/login/fulfilled',
      payload: {id: 1, name: 'Test User'},
    };
    const nextState = authUserReducer(initialState, action);

    expect(nextState.status).toEqual('succeeded');
    expect(nextState.value).toEqual(action.payload);
  });

  it('should handle asyncLoginUser.rejected correctly', () => {
    const initialState = {
      value: null,
      status: 'loading',
      error: null,
    };
    const action = {
      type: 'authUser/login/rejected',
      error: {message: 'Login failed'},
    };
    const nextState = authUserReducer(initialState, action);

    expect(nextState.status).toEqual('failed');
    expect(nextState.error).toEqual('Login failed');
  });
});
