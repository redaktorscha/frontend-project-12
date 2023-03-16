/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null,
  targetChannelId: null,
  isOpened: false,
};

const modalSlice = createSlice({
  name: 'modalState',
  initialState,
  reducers: {
    handleOpen(state, { payload }) {
      state.type = payload.type;
      state.isOpened = true;
      state.targetChannelId = payload.targetChannelId;
    },
    handleClose(state, { payload }) {
      state.type = payload.type;
      state.isOpened = false;
      state.targetChannelId = payload.targetChannelId;
    },
  },
});
export const { actions } = modalSlice;
export default modalSlice.reducer;
