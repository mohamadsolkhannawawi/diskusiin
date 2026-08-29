import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';

export const asyncFetchLeaderboards = createAsyncThunk(
  'leaderboards/fetch',
  async () => api.getLeaderboards(),
);

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchLeaderboards.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(asyncFetchLeaderboards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(asyncFetchLeaderboards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default leaderboardsSlice.reducer;
