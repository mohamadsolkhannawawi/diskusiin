import {createSlice} from '@reduxjs/toolkit';
import {asyncPreloadAuthUser} from '../authUser/authUserSlice';

const isPreloadSlice = createSlice({
  name: 'isPreload',
  initialState: true,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncPreloadAuthUser.fulfilled, () => false)
      .addCase(asyncPreloadAuthUser.rejected, () => false);
  },
});

export default isPreloadSlice.reducer;
