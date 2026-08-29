import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {asyncFetchThreadDetail, voteThreadDetail} from './threadDetailSlice';
import api from '../../utils/api';

describe('threadDetail thunks', () => {
  beforeEach(() => {
    api._getThreadDetail = api.getThreadDetail;
  });

  afterEach(() => {
    api.getThreadDetail = api._getThreadDetail;
    delete api._getThreadDetail;
  });

  describe('asyncFetchThreadDetail', () => {
    it('should dispatch pending and fulfilled when fetch success', async () => {
      const fakeDetail = {id: 'thread-1', title: 'Test', comments: []};
      api.getThreadDetail = vi.fn().mockResolvedValue(fakeDetail);

      const dispatch = vi.fn();
      const getState = vi.fn();
      
      const thunk = asyncFetchThreadDetail('thread-1');
      await thunk(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'threadDetail/fetch/pending'}));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'threadDetail/fetch/fulfilled',
        payload: fakeDetail,
      }));
    });

    it('should dispatch pending and rejected when fetch fails', async () => {
      api.getThreadDetail = vi.fn().mockRejectedValue(new Error('Network error'));

      const dispatch = vi.fn();
      const getState = vi.fn();
      
      const thunk = asyncFetchThreadDetail('thread-1');
      await thunk(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'threadDetail/fetch/pending'}));
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'threadDetail/fetch/rejected',
      }));
    });
  });

  describe('voteThreadDetail', () => {
    it('should dispatch optimistic and asyncToggleVoteThreadDetail', () => {
      const dispatch = vi.fn();
      const getState = vi.fn().mockReturnValue({
        authUser: {value: {id: 'user-1'}},
        threadDetail: {
          value: {id: 'thread-1', upVotesBy: [], downVotesBy: []},
        },
      });

      const thunk = voteThreadDetail('thread-1', 'up');
      thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({type: 'threadDetail/optimisticVoteThreadDetail'})
      );
      expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});
