import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({ currentChannelId: null }),
  reducers: {
    setChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    updateChannel: channelsAdapter.updateOne,
    deleteChannel: channelsAdapter.removeOne,
    setCurrentChannelId(state, { payload }) {
      // eslint-disable-next-line no-param-reassign
      state.currentChannelId = payload;
    },
  },
});
export const {
  setChannels, addChannel, updateChannel, deleteChannel, setCurrentChannelId,
} = channelsSlice.actions;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
