import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

// export const removeChannel = createAsyncThunk(
//   'channels/removeChannel',
//   async (payload) => {
//     await axios.delete(getRoute(''));
//     return payload;
//   },
// );

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState(),
  reducers: {
    setChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    updateChannel: channelsAdapter.updateOne,
    deleteChannel: channelsAdapter.removeOne,
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getChannels.fulfilled, channelsAdapter.addMany);
  //   // .addCase(addChannel.fulfilled, channelsAdapter.addOne)
  //   // .addCase(removeChannel.fulfilled, channelsAdapter.removeOne)
  //   // .addCase(updateChannel.fulfilled, channelsAdapter.updateOne);
  // },
});
export const {
  setChannels, addChannel, updateChannel, deleteChannel,
} = channelsSlice.actions;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
