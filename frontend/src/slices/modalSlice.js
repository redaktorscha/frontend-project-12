/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null,
  targetChannelId: null,
};

const modalSlice = createSlice({
  name: 'modalState',
  initialState,
  reducers: {
    setModalType(state, { payload }) {
      state.type = payload.type;
    },
    setTargetChannelId(state, { payload }) {
      state.targetChannelId = payload.targetChannelId;
    },
  },
});
export const { actions } = modalSlice;
export default modalSlice.reducer;
