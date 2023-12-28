import { configureStore } from "@reduxjs/toolkit";
import channelsSlice from "./channelsSlice";
import messagesSlice from "./messagesSlice";
import { usersApi } from "../api/users";
import { channelsApi } from "../api/channels";

export default configureStore({
    reducer: {
        channels: channelsSlice,
        messages: messagesSlice,
        [usersApi.reducerPath]: usersApi.reducer,
        [channelsApi.reducerPath]: channelsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(usersApi.middleware, channelsApi.middleware),
});
