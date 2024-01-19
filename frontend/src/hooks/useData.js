import { useContext, useEffect, useMemo } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addChannels,
  addChannel,
  setChannel,
} from "../slices/channelsSlice.js";
import { addMessages } from "../slices/messagesSlice.js";
import { addMessage } from "../slices/messagesSlice.js";
import { io } from "socket.io-client";
import { AuthContext } from "../contexts/authContext.jsx";

export const useData = () => {
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const channelId = useSelector((store) => store.channels.currentChannelId);

  useEffect(() => {
    axios
      .get("/api/v1/data", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        dispatch(addChannels(response.data.channels));
        dispatch(addMessages(response.data.messages));
      });
  }, []);
  const socket = useMemo(() => io("http://localhost:3000"), []);

  useEffect(() => {
    const handleNewMessage = (message) => {
      dispatch(addMessage(message));
    };
    socket.on("newMessage", handleNewMessage);

    const handleNewChannel = (channel) => {
      dispatch(addChannel(channel));
    };
    socket.on("newChannel", handleNewChannel);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newChannel", handleNewChannel);
    };
  }, []);

  const handleSetChannel = (id) => {
    console.log(id);
    dispatch(setChannel(id));
  };

  const sendMessage = async (value) => {
    return new Promise((resolve) => {
      socket.emit(
        "newMessage",
        {
          text: value,
          name: authContext.username,
          channelId,
        },
        () => {
          resolve();
        },
      );
    });
  };

  const sendChannel = async (channelName) => {
    return new Promise((resolve) => {
      socket.emit(
        "newChannel",
        {
          name: channelName,
        },
        () => {
          resolve();
        },
      );
    });
  };
  return { sendMessage, sendChannel, handleSetChannel };
};
