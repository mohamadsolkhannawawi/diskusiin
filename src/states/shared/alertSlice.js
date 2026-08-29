import {createSlice, nanoid} from '@reduxjs/toolkit';

const alertSlice = createSlice({
  name: 'alert',
  initialState: [],
  reducers: {
    showAlert: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (message, type = 'error') => ({
        payload: {id: nanoid(), message, type},
      }),
    },
    dismissAlert: (state, action) => state.filter((item) => item.id !== action.payload),
  },
});

export const {showAlert, dismissAlert} = alertSlice.actions;
export default alertSlice.reducer;
