import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  currentChannelId: 1,
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
    updateChannel: (state, { payload }) => {
      return {
        ...state,
        entities: {
          ...state.entities,
          [payload.id]: {
            ...state.entities[payload.id],
            name: payload.name,
          },
        },
      };
    },
    setChannel: (state, { payload }) => {
      return { ...state, currentChannelId: payload };
    },
  },
});

export const {
  addChannel,
  addChannels,
  removeChannel,
  updateChannel,
  setChannel,
} = channelSlice.actions;
export default channelSlice.reducer;
