import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {asyncPreloadAuthUser} from '../authUser/authUserSlice';
import api from '../../utils/api';

describe('asyncPreloadAuthUser thunk', () => {
  beforeEach(() => {
    api._getAccessToken = api.getAccessToken;
    api._getOwnProfile = api.getOwnProfile;
    api._removeAccessToken = api.removeAccessToken;
  });

  afterEach(() => {
    api.getAccessToken = api._getAccessToken;
    api.getOwnProfile = api._getOwnProfile;
    api.removeAccessToken = api._removeAccessToken;

    delete api._getAccessToken;
    delete api._getOwnProfile;
    delete api._removeAccessToken;
  });

  it('should reject with null if no access token exists', async () => {
    api.getAccessToken = vi.fn().mockReturnValue(null);

    const dispatch = vi.fn();
    const getState = vi.fn();

    const thunk = asyncPreloadAuthUser();
    await thunk(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'authUser/preload/pending'}));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'authUser/preload/rejected',
      payload: null,
    }));
  });

  it('should dispatch pending and fulfilled when preload success', async () => {
    const fakeUser = {id: 1, name: 'Test User'};

    api.getAccessToken = vi.fn().mockReturnValue('some-token');
    api.getOwnProfile = vi.fn().mockResolvedValue(fakeUser);

    const dispatch = vi.fn();
    const getState = vi.fn();

    const thunk = asyncPreloadAuthUser();
    await thunk(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'authUser/preload/pending'}));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'authUser/preload/fulfilled',
      payload: fakeUser,
    }));
  });

  it('should dispatch pending and rejected, and remove token when API fails', async () => {
    api.getAccessToken = vi.fn().mockReturnValue('invalid-token');
    api.getOwnProfile = vi.fn().mockRejectedValue(new Error('Invalid token'));
    api.removeAccessToken = vi.fn();

    const dispatch = vi.fn();
    const getState = vi.fn();

    const thunk = asyncPreloadAuthUser();
    await thunk(dispatch, getState, undefined);

    expect(api.removeAccessToken).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'authUser/preload/pending'}));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'authUser/preload/rejected',
      payload: null,
    }));
  });
});
