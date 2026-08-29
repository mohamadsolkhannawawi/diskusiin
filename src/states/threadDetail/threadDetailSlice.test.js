import {describe, it, expect} from 'vitest';
import threadDetailReducer, {
  clearThreadDetail,
  optimisticVoteThreadDetail,
  rollbackThreadDetailVote,
} from './threadDetailSlice';

describe('threadDetailReducer', () => {
  it('should return the initial state when given an unknown action', () => {
    const initialState = {
      value: null,
      status: 'idle',
      error: null,
    };
    const action = {type: 'UNKNOWN'};
    const nextState = threadDetailReducer(initialState, action);

    expect(nextState).toEqual(initialState);
  });

  it('should handle clearThreadDetail', () => {
    const initialState = {
      value: {id: 'thread-1', title: 'Test'},
      status: 'succeeded',
      error: null,
    };
    const nextState = threadDetailReducer(initialState, clearThreadDetail());

    expect(nextState.value).toEqual(null);
    expect(nextState.status).toEqual('idle');
  });

  it('should handle optimisticVoteThreadDetail correctly', () => {
    const initialState = {
      value: {
        id: 'thread-1',
        upVotesBy: [],
        downVotesBy: [],
      },
      status: 'succeeded',
      error: null,
    };

    const action = optimisticVoteThreadDetail({
      clicked: 'up',
      userId: 'user-1',
    });
    
    const nextState = threadDetailReducer(initialState, action);
    
    expect(nextState.value.upVotesBy).toContain('user-1');
    expect(nextState.value.previousVoteSnapshot).toBeDefined();
  });

  it('should handle rollbackThreadDetailVote correctly', () => {
    const initialState = {
      value: {
        id: 'thread-1',
        upVotesBy: ['user-1'],
        downVotesBy: [],
        previousVoteSnapshot: {
          upVotesBy: [],
          downVotesBy: [],
        },
      },
      status: 'succeeded',
      error: null,
    };

    const action = rollbackThreadDetailVote();
    const nextState = threadDetailReducer(initialState, action);
    
    expect(nextState.value.upVotesBy).not.toContain('user-1');
    expect(nextState.value.previousVoteSnapshot).toBeUndefined();
  });
});
