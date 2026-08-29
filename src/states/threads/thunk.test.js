import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {asyncFetchThreads, voteThread} from './threadsSlice';
import api from '../../utils/api';

describe('threads thunks', () => {
  beforeEach(() => {
    api._getAllThreads = api.getAllThreads;
    api._upVoteThread = api.upVoteThread;
  });

  afterEach(() => {
    api.getAllThreads = api._getAllThreads;
    api.upVoteThread = api._upVoteThread;
    
    delete api._getAllThreads;
    delete api._upVoteThread;
  });

  describe('asyncFetchThreads', () => {
    it('should dispatch pending and fulfilled when fetch success', async () => {
      const fakeThreads = [{id: 'thread-1', title: 'Test Thread'}];
      api.getAllThreads = vi.fn().mockResolvedValue(fakeThreads);

      const dispatch = vi.fn();
      const getState = vi.fn();
      
      const thunk = asyncFetchThreads();
      await thunk(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'threads/fetchThreads/pending'}));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'threads/fetchThreads/fulfilled',
        payload: fakeThreads,
      }));
    });

    it('should dispatch pending and rejected when fetch fails', async () => {
      api.getAllThreads = vi.fn().mockRejectedValue(new Error('Network error'));

      const dispatch = vi.fn();
      const getState = vi.fn();
      
      const thunk = asyncFetchThreads();
      await thunk(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'threads/fetchThreads/pending'}));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'threads/fetchThreads/rejected',
      }));
    });
  });

  describe('voteThread', () => {
    it('should dispatch optimistic and asyncToggleVoteThread', () => {
      const dispatch = vi.fn();
      const getState = vi.fn().mockReturnValue({
        authUser: {value: {id: 'user-1'}},
        threads: {
          items: [{id: 'thread-1', upVotesBy: [], downVotesBy: []}],
        },
      });

      const thunk = voteThread('thread-1', 'up');
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({type: 'threads/optimisticVoteThread'})
      );
      // asyncToggleVoteThread is an async thunk, dispatching it will invoke it
      // So we expect dispatch to have been called with a function (the thunk)
      expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});
