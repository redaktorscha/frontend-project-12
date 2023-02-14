/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  type: null,
  targetChannel: null,
};

const modalSlice = createSlice({
  name: 'modalState',
  initialState,
  reducers: {
    setIsOpen(state, { payload }) {
      state.isOpen = payload.isOpen;
    },
    setType(state, { payload }) {
      state.type = payload.type;
    },
    setTargetChannel(state, { payload }) {
      state.targetChannel = payload.targetChannel;
    },
  },
});
export const { actions } = modalSlice;
export default modalSlice.reducer;
