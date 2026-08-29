import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';

/**
 * Thunk: register a new account. The actual `fetch()` call lives here,
 * never inside a React component's lifecycle/effect.
 */
export const asyncRegisterUser = createAsyncThunk(
  'authUser/register',
  async ({name, email, password}) => {
    await api.register({name, email, password});
  },
);

/**
 * Thunk: log in, store the access token, then fetch the owner's profile.
 */
export const asyncLoginUser = createAsyncThunk(
  'authUser/login',
  async ({email, password}) => {
    const accessToken = await api.login({email, password});
    api.putAccessToken(accessToken);

    const user = await api.getOwnProfile();
    return user;
  },
);

/**
 * Thunk: restore the session (if any) when the app first loads.
 */
export const asyncPreloadAuthUser = createAsyncThunk(
  'authUser/preload',
  async (_, {rejectWithValue}) => {
    if (!api.getAccessToken()) {
      return rejectWithValue(null);
    }

    try {
      const user = await api.getOwnProfile();
      return user;
    } catch (error) {
      api.removeAccessToken();
      return rejectWithValue(null);
    }
  },
);

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: {
    value: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    unsetAuthUser: (state) => {
      state.value = null;
      api.removeAccessToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncLoginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(asyncLoginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;
      })
      .addCase(asyncLoginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(asyncRegisterUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(asyncRegisterUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(asyncRegisterUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(asyncPreloadAuthUser.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(asyncPreloadAuthUser.rejected, (state) => {
        state.value = null;
      });
  },
});

export const {unsetAuthUser} = authUserSlice.actions;
export default authUserSlice.reducer;
