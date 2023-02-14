import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({ currentChannelId: null }),
  reducers: {
    setChannels(state, { payload }) {
      channelsAdapter.addMany(state, payload.channels);
    },
    addChannel(state, { payload }) {
      channelsAdapter.addOne(state, payload.channel);
    },
    updateChannel(state, { payload }) {
      channelsAdapter.updateOne(state, payload.channel);
    },
    deleteChannel(state, { payload }) {
      channelsAdapter.removeOne(state, payload.id);
    },
    setCurrentChannelId(state, { payload }) {
      // eslint-disable-next-line no-param-reassign
      state.currentChannelId = payload.currentChannelId;
    },
  },
});

export const { actions } = channelsSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
