import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { deleteChannel } from './channelsSlice';

const messagesAdapter = createEntityAdapter();

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    setMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder.addCase(deleteChannel, (state, { payload }) => {
      const filteredMessages = Object.values(state.entities)
        .filter(({ channelId }) => channelId !== payload);
      messagesAdapter.setAll(state, filteredMessages);
    });
  },
});
export const { setMessages, addMessage } = messagesSlice.actions;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
