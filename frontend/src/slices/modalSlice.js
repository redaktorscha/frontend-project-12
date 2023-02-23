/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null,
  targetChannel: null,
};

const modalSlice = createSlice({
  name: 'modalState',
  initialState,
  reducers: {
    setModalType(state, { payload }) {
      state.type = payload.type;
    },
    setTargetChannel(state, { payload }) {
      state.targetChannel = payload.targetChannel;
    },
  },
});
export const { actions } = modalSlice;
export default modalSlice.reducer;
