import { createSlice } from '@reduxjs/toolkit';

const currentChannelSlice = createSlice({
  name: 'currentChannelId',
  initialState: null,
  reducers: {
    setCurrentChannel(state, { payload }) {
      return payload;
    },
  },
});
export const { setCurrentChannel } = currentChannelSlice.actions;
export default currentChannelSlice.reducer;
