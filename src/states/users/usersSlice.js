import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';

export const asyncFetchUsers = createAsyncThunk(
  'users/fetch',
  async () => api.getAllUsers(),
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(asyncFetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(asyncFetchUsers.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default usersSlice.reducer;
