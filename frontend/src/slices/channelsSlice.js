import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

// export const addChannel = createAsyncThunk(
//   'channels/addChannel',
//   async (payload) => {
//     const response = await axios.post(getRoute(''), { name: payload });
//     return response.data;
//   },
// );

// export const removeChannel = createAsyncThunk(
//   'channels/removeChannel',
//   async (payload) => {
//     await axios.delete(getRoute(''));
//     return payload;
//   },
// );

// export const updateChannel = createAsyncThunk(
//   'channels/updateChannel',
//   async (payload) => {
//     await axios.patch(getRoute(''));
//     return payload;
//   },
// );

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState(),
  reducers: {
    setChannels: channelsAdapter.addMany,
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getChannels.fulfilled, channelsAdapter.addMany);
  //   // .addCase(addChannel.fulfilled, channelsAdapter.addOne)
  //   // .addCase(removeChannel.fulfilled, channelsAdapter.removeOne)
  //   // .addCase(updateChannel.fulfilled, channelsAdapter.updateOne);
  // },
});
export const { setChannels } = channelsSlice.actions;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
