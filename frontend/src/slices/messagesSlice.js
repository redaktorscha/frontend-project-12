import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();

// export const sendMessage = createAsyncThunk(
//   'messages/addMessage',
//   async (payload) => {
//     const response = await axios.post(getRoute(''), { name: payload });
//     return response.data;
//   },
// );

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    setMessages: messagesAdapter.addMany,
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getMessages.fulfilled, messagesAdapter.addMany)
  //     .addCase(sendMessage.fulfilled, messagesAdapter.addOne);
  // },
});
export const { setMessages } = messagesSlice.actions;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
