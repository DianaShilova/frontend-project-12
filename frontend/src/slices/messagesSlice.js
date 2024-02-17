import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    removeMessages: (state, { payload }) => {
      console.log("payload", payload);
      let ids = state.ids.filter(
        (id) => state.entities[id].channelId !== payload,
      );
      const entities = ids.reduce((result, id) => {
        result[id] = state.entities[id];

        return result;
      }, {});

      return {
        ...state,
        ids,
        entities,
      };
    },
    updateMessages: messagesAdapter.updateOne,
  },
});

export const { addMessage, addMessages, removeMessages, updateMessages } =
  messagesSlice.actions;
export default messagesSlice.reducer;
