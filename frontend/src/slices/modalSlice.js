/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null,
  targetChannelId: null,
  isOpen: false,
};

const modalSlice = createSlice({
  name: 'modalState',
  initialState,
  reducers: {
    setModalType(state, { payload }) {
      state.type = payload.type;
    },
    setIsOpen(state, { payload }) {
      state.isOpen = payload.isOpen;
    },
    setIsClosed(state, { payload }) {
      state.isOpen = payload.isOpen;
    },
    setTargetChannelId(state, { payload }) {
      state.targetChannelId = payload.targetChannelId;
    },
  },
});
export const { actions } = modalSlice;
export default modalSlice.reducer;
