import {describe, it, expect} from 'vitest';
import threadsReducer, {optimisticVoteThread, rollbackThreadVote} from './threadsSlice';

describe('threadsReducer', () => {
  it('should return the initial state when given an unknown action', () => {
    const initialState = {
      items: [],
      status: 'idle',
      error: null,
    };
    const action = {type: 'UNKNOWN'};
    const nextState = threadsReducer(initialState, action);

    expect(nextState).toEqual(initialState);
  });

  it('should handle asyncFetchThreads.fulfilled', () => {
    const initialState = {
      items: [],
      status: 'loading',
      error: null,
    };
    const mockThreads = [{id: 1, title: 'Test Thread'}];
    const action = {
      type: 'threads/fetchThreads/fulfilled',
      payload: mockThreads,
    };
    const nextState = threadsReducer(initialState, action);

    expect(nextState.status).toEqual('succeeded');
    expect(nextState.items).toEqual(mockThreads);
  });

  it('should handle optimisticVoteThread correctly', () => {
    const initialState = {
      items: [
        {
          id: 'thread-1',
          upVotesBy: [],
          downVotesBy: [],
        },
      ],
      status: 'succeeded',
      error: null,
    };

    const action = optimisticVoteThread({
      threadId: 'thread-1',
      clicked: 'up',
      userId: 'user-1',
    });
    
    const nextState = threadsReducer(initialState, action);
    
    expect(nextState.items[0].upVotesBy).toContain('user-1');
    expect(nextState.items[0].previousVoteSnapshot).toBeDefined();
  });

  it('should handle rollbackThreadVote correctly', () => {
    const initialState = {
      items: [
        {
          id: 'thread-1',
          upVotesBy: ['user-1'],
          downVotesBy: [],
          previousVoteSnapshot: {
            upVotesBy: [],
            downVotesBy: [],
          },
        },
      ],
      status: 'succeeded',
      error: null,
    };

    const action = rollbackThreadVote({threadId: 'thread-1'});
    const nextState = threadsReducer(initialState, action);
    
    expect(nextState.items[0].upVotesBy).not.toContain('user-1');
    expect(nextState.items[0].previousVoteSnapshot).toBeUndefined();
  });
});
