import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {asyncLoginUser} from './authUserSlice';
import api from '../../utils/api';

describe('asyncLoginUser thunk', () => {
  beforeEach(() => {
    api._login = api.login;
    api._putAccessToken = api.putAccessToken;
    api._getOwnProfile = api.getOwnProfile;
  });

  afterEach(() => {
    api.login = api._login;
    api.putAccessToken = api._putAccessToken;
    api.getOwnProfile = api._getOwnProfile;

    delete api._login;
    delete api._putAccessToken;
    delete api._getOwnProfile;
  });

  it('should dispatch pending and fulfilled when login success', async () => {
    const fakeToken = 'fake-token';
    const fakeUser = {id: 1, name: 'Test User'};

    api.login = vi.fn().mockResolvedValue(fakeToken);
    api.putAccessToken = vi.fn();
    api.getOwnProfile = vi.fn().mockResolvedValue(fakeUser);

    const dispatch = vi.fn();
    const getState = vi.fn();

    // Call the thunk action creator to get the thunk function
    const thunk = asyncLoginUser({email: 'test@test.com', password: 'password'});

    // Execute the thunk function
    await thunk(dispatch, getState, undefined);

    // Verify dispatch calls
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'authUser/login/pending'}));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'authUser/login/fulfilled',
      payload: fakeUser,
    }));

    // Verify API calls
    expect(api.login).toHaveBeenCalledWith({email: 'test@test.com', password: 'password'});
    expect(api.putAccessToken).toHaveBeenCalledWith(fakeToken);
    expect(api.getOwnProfile).toHaveBeenCalled();
  });

  it('should dispatch pending and rejected when login fails', async () => {
    const error = new Error('Login failed');
    api.login = vi.fn().mockRejectedValue(error);
    api.putAccessToken = vi.fn();
    api.getOwnProfile = vi.fn();

    const dispatch = vi.fn();
    const getState = vi.fn();

    const thunk = asyncLoginUser({email: 'test@test.com', password: 'wrong'});
    await thunk(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({type: 'authUser/login/pending'}));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'authUser/login/rejected',
    }));

    expect(api.login).toHaveBeenCalledWith({email: 'test@test.com', password: 'wrong'});
    expect(api.putAccessToken).not.toHaveBeenCalled();
    expect(api.getOwnProfile).not.toHaveBeenCalled();
  });
});
