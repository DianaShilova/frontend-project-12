import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState()

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: messagesAdapter.addOne,
        addMessages: messagesAdapter.addMany,
        removeMessages: (state, { payload }) => {
            messagesAdapter.removeOne(state, payload);
        },
        updateMessages: messagesAdapter.updateOne,
    },
})

export const { addMessage, addMessages, removeMessages, updateMessages } = messagesSlice.actions;
export default messagesSlice.reducer;