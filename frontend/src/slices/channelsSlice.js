import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  currentChannelId: "1",
});

const channelSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: (state, { payload }) => {
      channelsAdapter.removeOne(state, payload);
    },
    updateChannels: channelsAdapter.updateOne,
    setChannel: (state, { payload }) => {
      return { ...state, currentChannelId: payload };
    },
  },
});

export const {
  addChannel,
  addChannels,
  removeChannel,
  updateChannels,
  setChannel,
} = channelSlice.actions;
export default channelSlice.reducer;
