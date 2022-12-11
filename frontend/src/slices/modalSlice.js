/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  type: null,
};

const modalSlice = createSlice({
  name: 'modalState',
  initialState,
  reducers: {
    setIsOpen(state, { payload }) {
      state.isOpen = payload;
    },
    setType(state, { payload }) {
      state.type = payload;
    },
  },
});
export const { setIsOpen, setType } = modalSlice.actions;
export default modalSlice.reducer;
